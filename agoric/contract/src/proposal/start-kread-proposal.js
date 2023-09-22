// @ts-check

/** @file  This is a module for use with swingset.CoreEval. */

import { E } from '@endo/far';
import { baseCharacters, baseItems } from './base-inventory.js';

import '@agoric/governance/src/types-ambient.js';

const KREAD_LABEL = 'KREAd';

const contractInfo = {
  storagePath: 'kread',
  instanceName: 'kread',
};

const { Fail } = assert;

const fail = (reason) => {
  throw reason;
};

/** @typedef {import('@agoric/deploy-script-support/src/coreProposalBehavior.js').BootstrapPowers} BootstrapPowers */

export const reserveThenGetNamePaths = async (nameAdmin, paths) => {
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
 * Variant of startGovernedInstance from basic-behaviors.js, modified for
 * KREAd's needs. Takes an arbitrary committee. Could it be generalized more?
 *
 * @template {GovernableStartFn} SF
 * @param {BootstrapPowers} powers
 * @param {{object}} kreadConfig
 * @returns {Promise<GovernanceFacetKit<SF>>}
 */
// TODO rename to startGovernedKread
const startGovernedInstance = async (
  {
    consume: {
      zoe,
      chainTimerService: chainTimerServiceP,
      chainStorage,
      board,
      kreadCommitteeCreatorFacet,
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
    installation: {
      consume: { kreadKit: installP, contractGovernor: govP },
    },
    instance: {
      produce: { [contractInfo.instanceName]: produceKreadInstance },
    },
  },
  { kreadConfig },
) => {
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
    storageNode,
  ] = await Promise.all([
    poserInvitationP,
    chainTimerServiceP,
    E(E(zoe).getInvitationIssuer()).getAmountOf(poserInvitationP),
    E(board).getReadonlyMarshaller(),
    istIssuerP,
    chainStorage,
    installP,
    govP,
    E(istIssuerP).getBrand(),
    E(chainStorage).makeChildNode(contractInfo.storagePath),
  ]);

  // XX These should be looked up in start-kread-script and passed in
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
    minUncommonRating: 20,
    governedParams: {
      Electorate: {
        type: 'invitation',
        value: electorateInvitationAmount,
      },
    },
  });

  const governorTerms = harden({
    timer,
    governedContractInstallation: kreadKitInstallation,
    governed: {
      terms: governedTerms,
      issuerKeywordRecord: harden({ Money: istIssuer }),
      label: KREAD_LABEL,
    },
  });

  const privateArgs = harden({ powers: kreadPowers, ...kreadConfig });

  const g = await E(zoe).startInstance(
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

  // FIXME make sure this ends up in durable storage
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

  const {
    issuers: { KREAdCHARACTER: characterIssuer, KREAdITEM: itemIssuer },
    brands: { KREAdCHARACTER: characterBrand, KREAdITEM: itemBrand },
  } = await E(zoe).getTerms(instance);

  await Promise.all([
    E(creatorFacet).initializeBaseAssets(baseCharacters, baseItems),
    E(creatorFacet).initializeMetrics(),
    E(creatorFacet).initializeCharacterNamesEntries(),
    E(creatorFacet).reviveMarketExitSubscribers(),
  ]);

  produceKreadInstance.resolve(instance);

  // resolving these publishes into agoricNames for `issuer` and `brand`
  produceCharacterIssuer.resolve(characterIssuer);
  produceCharacterBrand.resolve(characterBrand);
  produceItemIssuer.resolve(itemIssuer);
  produceItemBrand.resolve(itemBrand);

  console.log('CONTRACT INIT SUCCESS!');
  return { publicFacet, creatorFacet, instance };
};

/**
 * Execute a proposal to start a contract that publishes the KREAd dapp.
 * Starts the contractGoverner contract which itself starts the KREAd instance.
 *
 * See also:
 * BLDer DAO governance using arbitrary code injection: swingset.CoreEval
 * https://community.agoric.com/t/blder-dao-governance-using-arbitrary-code-injection-swingset-coreeval/99
 *
 * @param {BootstrapPowers} powers
 */
// TODO rename to startKreadGovernor
export const startKread = async (powers) => {
  const {
    consume: {
      // FIXME `clock` should be E(chainTimerService).getClock()
      chainTimerService: clock,
    },
  } = powers;

  const kreadConfig = harden({
    baseCharacters,
    baseItems,
    clock,
    seed: 303,
  });

  // FIXME save the results durably
  await startGovernedInstance(powers, { kreadConfig });
};
harden(startKread);

export const getManifestForStartKread = async (
  { restoreRef },
  { kreadKitRef },
) => ({
  manifest: {
    [startKread.name]: {
      consume: {
        board: true,
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
        },
      },
      brand: {
        produce: {
          KREAdCHARACTER: true,
          KREAdITEM: true,
        },
      },
      issuer: {
        consume: { IST: true },
        produce: {
          KREAdCHARACTER: true,
          KREAdITEM: true,
        },
      },
      produce: { kreadKit: true },
    },
  },
  installations: {
    kreadKit: restoreRef(kreadKitRef),
  },
});
