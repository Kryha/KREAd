// @ts-check

/** @file  This is a module for use with swingset.CoreEval. */

import {E} from '@endo/far';
import {
  baseCharacters,
  baseItems,
} from './chain-storage-proposal.js';

const KREAD_LABEL = 'KREAd';

const contractInfo = {
  storagePath: 'kread',
  instanceName: 'kread',
};

const fail = (reason) => {
  throw reason;
};

/** @typedef {import('@agoric/deploy-script-support/src/coreProposalBehavior.js').BootstrapPowers} BootstrapPowers */
/** @typedef {import('@agoric/governance/src/types-ambient.js').GovernanceFacetKit} GovernanceFacetKit */

// copied from chain-storage-proposal because that file is a script, and this uses E.
const reserveThenGetNamePaths = async (nameAdmin, paths) => {
  /**
   * @param {ERef<import('@agoric/vats').NameAdmin>} nextAdmin
   * @param {string[]} path
   */
  const nextPath = async (nextAdmin, path) => {
    const [nextName, ...rest] = path;
    assert.typeof(nextName, 'string');

    // Ensure we wait for the next name until it exists.
    await E(nextAdmin).reserve(nextName);

    if (rest.length === 0) {
      // Now return the readonly lookup of the name.
      const nameHub = E(nextAdmin).readonly();
      return E(nameHub).lookup(nextName);
    }

    // Wait until the next admin is resolved.
    const restAdmin = await E(nextAdmin).lookupAdmin(nextName);
    return nextPath(restAdmin, rest);
  };

  return Promise.all(
    paths.map(async (path) => {
      Array.isArray(path) || Fail`path ${path} is not an array`;
      return nextPath(nameAdmin, path);
    }),
  );
};

/**
 * Generalized from basic-behaviors.js to take an arbitrary committee.
 *
 * @template {GovernableStartFn} SF
 * @param {BootstrapPowers} powers
 * @param {{object}} kreadConfig
 * @returns {Promise<GovernanceFacetKit<SF>>}
 */
const startGovernedInstance = async ({
  consume: {
    zoe,
    chainTimerService: chainTimerServiceP,
    chainStorage,
    board,
    kreadCommitteeCreatorFacet,
    agoricNames,
    namesByAddressAdmin,
  },
  produce: { kreadKit },
  brand: {
    produce: {
      KREAdCHARACTER: produceCharacterBrand,
      KREAdITEM: produceItemBrand,
    },
  },
  issuer: {
    consume: { IST: istIssuerP },
    produce: {
      KREAdCHARACTER: produceCharacterIssuer,
      KREAdITEM: produceItemIssuer,
    },
  },
  installation: { consume: { kreadKit: installP, contractGovernor: govP }},
  instance: {
    // @ts-expect-error bakeSaleKit isn't declared in vats/src/core/types.js
    produce: { [contractInfo.instanceName]: kread },
  },
}, { kreadConfig, }) => {
  const poserInvitationP = E(kreadCommitteeCreatorFacet).getPoserInvitation();
  const [
    initialPoserInvitation,
    timer,
    electorateInvitationAmount,
    marshaller,
    istIssuer,
    chainStorageSettled,
    kreadKitInstallation,
    contractGovernor,
    brand,
  ] =
    await Promise.all([
      poserInvitationP,
      chainTimerServiceP,
      E(E(zoe).getInvitationIssuer()).getAmountOf(poserInvitationP),
      E(board).getReadonlyMarshaller(),
      istIssuerP,
      chainStorage,
      installP,
      govP,
      E(istIssuerP).getBrand(),
    ]);

  const royaltyAddr = 'agoric1d33wj6vgjfdaefs6qzda8np8af6qfdzc433dsu';
  const platformFeeAddr = 'agoric1d33wj6vgjfdaefs6qzda8np8af6qfdzc433dsu';

  const [royaltyDepositFacet] = await reserveThenGetNamePaths(
    namesByAddressAdmin,
    [[royaltyAddr, 'depositFacet']],
  );
  const [platformFeeDepositFacet] = await reserveThenGetNamePaths(
    namesByAddressAdmin,
    [[platformFeeAddr, 'depositFacet']],
  );

  const royaltyRate = {
    numerator: 10n,
    denominator: 100n,
  };
  const platformFeeRate = {
    numerator: 3n,
    denominator: 100n,
  };

  const mintRoyaltyRate = {
    numerator: 85n,
    denominator: 100n,
  };
  const mintPlatformFeeRate = {
    numerator: 15n,
    denominator: 100n,
  };

  chainStorageSettled || fail(Error('no chainStorage - sim chain?'));
  const storageNode = E(chainStorageSettled).makeChildNode(
    contractInfo.storagePath,
  );
  const kreadPowers = { storageNode, marshaller };

  const governedTerms = harden({
    royaltyRate,
    platformFeeRate,
    mintRoyaltyRate,
    mintPlatformFeeRate,
    royaltyDepositFacet,
    platformFeeDepositFacet,
    paymentBrand: brand,
    mintFee: 30000000n,
    assetNames: {
      character: 'KREAdCHARACTER',
      item: 'KREAdITEM',
    },
    governedParams: {
      Electorate: {
        type: 'invitation',
        value: electorateInvitationAmount,
      },
    },
  });

  const governorTerms =
    harden({
      timer,
      governedContractInstallation: kreadKitInstallation,
      governed: {
        terms: governedTerms,
        issuerKeywordRecord: harden({ Money: istIssuer }),
        label: KREAD_LABEL,
      },
    },
  );

  const privateArgs = harden({ powers: kreadPowers, ...kreadConfig });

  const g = await  E(zoe).startInstance(
    contractGovernor,
    {},
    governorTerms,
    harden({
      committeeCreatorFacet: kreadCommitteeCreatorFacet,
      governed: {
        ...privateArgs,
        initialPoserInvitation,
      },
    }),
    `${KREAD_LABEL}-governor`,
  );

  const [instance, publicFacet, creatorFacet, adminFacet] = await Promise.all([
    E(g.creatorFacet).getInstance(),
    E(g.creatorFacet).getPublicFacet(),
    E(g.creatorFacet).getCreatorFacet(),
    E(g.creatorFacet).getAdminFacet(),
  ]);

  kreadKit.resolve(
    harden({
      label: KREAD_LABEL,
      instance,
      publicFacet,
      creatorFacet,
      adminFacet,

      governor: g.instance,
      governorCreatorFacet: g.creatorFacet,
      governorAdminFacet: g.adminFacet,
      privateArgs,
    }),
  );


  // Get board ids for instance and assets
  const boardId = await E(board).getId(instance);
  const {
    issuers: { KREAdCHARACTER: characterIssuer, KREAdITEM: itemIssuer },
    brands: { KREAdCHARACTER: characterBrand, KREAdITEM: itemBrand },
  } = await E(zoe).getTerms(instance);

  //FIXME: remove these infavour of terms and getting them differently
  const [
    CHARACTER_BRAND_BOARD_ID,
    CHARACTER_ISSUER_BOARD_ID,
    ITEM_BRAND_BOARD_ID,
    ITEM_ISSUER_BOARD_ID,
  ] = await Promise.all([
    E(board).getId(characterBrand),
    E(board).getId(characterIssuer),
    E(board).getId(itemBrand),
    E(board).getId(itemIssuer),
  ]);

  await E(creatorFacet).publishKreadInfo(
    boardId,
    CHARACTER_BRAND_BOARD_ID,
    CHARACTER_ISSUER_BOARD_ID,
    ITEM_BRAND_BOARD_ID,
    ITEM_ISSUER_BOARD_ID,
  );

  await Promise.all([
    E(creatorFacet).initializeBaseAssets(baseCharacters, baseItems),
    E(creatorFacet).initializeMetrics(),
    E(creatorFacet).reviveMarketExitSubscribers(),
  ]);

  kread.resolve(instance);

  produceCharacterIssuer.resolve(characterIssuer);
  produceCharacterBrand.resolve(characterBrand);
  produceItemIssuer.resolve(itemIssuer);
  produceItemBrand.resolve(itemBrand);

  console.log('CONTRACT INIT SUCCESS!');
  return { publicFacet, creatorFacet, instance };
};

/**
 * Execute a proposal to start a contract that publishes the KREAd dapp.
 *
 * See also:
 * BLDer DAO governance using arbitrary code injection: swingset.CoreEval
 * https://community.agoric.com/t/blder-dao-governance-using-arbitrary-code-injection-swingset-coreeval/99
 *
 * @param {BootstrapPowers} powers
 */
export const startKread = async powers => {
  const {
    consume: { board, agoricNamesAdmin, chainTimerService: clock },
    instance: {
      produce: { [contractInfo.instanceName]: kread },
    },
  } = powers;

  const kreadConfig = harden({
    baseCharacters,
    baseItems,
    clock,
    seed: 303,
  });

  const { publicFacet, creatorFacet, instance } = await startGovernedInstance(
    powers,
    { kreadConfig },
  );

  // Get board ids for instance and assets
  const boardId = await E(board).getId(instance);
  const {
    character: { issuer: characterIssuer, brand: characterBrand },
    item: { issuer: itemIssuer, brand: itemBrand },
    payment: { issuer: tokenIssuer, brand: tokenBrand },
  } = await E(publicFacet).getTokenInfo();

  const [
    CHARACTER_BRAND_BOARD_ID,
    CHARACTER_ISSUER_BOARD_ID,
    ITEM_BRAND_BOARD_ID,
    ITEM_ISSUER_BOARD_ID,
    TOKEN_BRAND_BOARD_ID,
    TOKEN_ISSUER_BOARD_ID,
  ] = await Promise.all([
    E(board).getId(characterBrand),
    E(board).getId(characterIssuer),
    E(board).getId(itemBrand),
    E(board).getId(itemIssuer),
    E(board).getId(tokenBrand),
    E(board).getId(tokenIssuer),
  ]);

  const assetBoardIds = {
    character: {
      issuer: CHARACTER_ISSUER_BOARD_ID,
      brand: CHARACTER_BRAND_BOARD_ID,
    },
    item: { issuer: ITEM_ISSUER_BOARD_ID, brand: ITEM_BRAND_BOARD_ID },
    paymentFT: { issuer: TOKEN_ISSUER_BOARD_ID, brand: TOKEN_BRAND_BOARD_ID },
  };

  await E(creatorFacet).publishKreadInfo(
    boardId,
    CHARACTER_BRAND_BOARD_ID,
    CHARACTER_ISSUER_BOARD_ID,
    ITEM_BRAND_BOARD_ID,
    ITEM_ISSUER_BOARD_ID,
    TOKEN_BRAND_BOARD_ID,
    TOKEN_ISSUER_BOARD_ID,
  );

  await E(creatorFacet).initializeMetrics();

  // TODO Get the most recent state of metrics from the storage node and send it to the contract
  // const data = {};
  // const restoreMetricsInvitation = await E(
  //   creatorFacet,
  // ).makeRestoreMetricsInvitation();
  // await E(zoe).offer(restoreMetricsInvitation, {}, {}, data);

  // Log board ids for use in frontend constants
  console.log(`KREAD BOARD ID: ${boardId}`);
  for (const [key, value] of Object.entries(assetBoardIds)) {
    console.log(`${key.toUpperCase()} BRAND BOARD ID: ${value.brand}`);
    console.log(`${key.toUpperCase()} ISSUER BOARD ID: ${value.issuer}`);
  }

  // Share instance widely via E(agoricNames).lookup('instance', <instance name>)
  kread.resolve(instance);

  const kindAdmin = (kind) => E(agoricNamesAdmin).lookupAdmin(kind);

  await E(kindAdmin('issuer')).update('KREAdCHARACTER', characterIssuer);
  await E(kindAdmin('brand')).update('KREAdCHARACTER', characterBrand);

  await E(kindAdmin('issuer')).update('KREAdITEM', itemIssuer);
  await E(kindAdmin('brand')).update('KREAdITEM', itemBrand);

  console.log('ASSETS ADDED TO AGORIC NAMES');
  // Share instance widely via E(agoricNames).lookup('instance', <instance name>)
};
harden(startKread);

export const getManifestForStartKread = async (
  { restoreRef },
  { kreadKitRef }
) => ({
  manifest: {
    [startKread.name]: {
      consume: {
        board: true,
        agoricNamesAdmin: true,
        zoe: true,
        chainTimerService: true,
        chainStorage: true,
        kreadCommitteeCreatorFacet: true,
        agoricNames: true,
        namesByAddressAdmin: true,
      },
      instance: {
        produce: { [contractInfo.instanceName]: true },
      },
      installation: {
        consume: {
          kreadKit: true,
          contractGovernor: true,
      }},
      brand: { produce: {
        KREAdCHARACTER: true,
        KREAdITEM: true,
      }},
      issuer: {
        consume: { IST: true },
        produce: {
          KREAdCHARACTER: true,
          KREAdITEM: true,
        }      },
      produce: { kreadKit: true },
    },
  },
  installations: {
    kreadKit: restoreRef(kreadKitRef),
  },
});
