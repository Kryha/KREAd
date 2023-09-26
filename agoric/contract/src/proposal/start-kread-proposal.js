// @ts-check

/** @file  This is a module for use with swingset.CoreEval. */

// XXX this is unsupported, but it's already included in the bundle (statically linked)
import { makeTracer } from '@agoric/internal';
import { E } from '@endo/far';
import { deeplyFulfilled } from '@endo/marshal';

import {
  baseCharacters,
  baseItems,
  marketplaceListingsCommon,
  marketplaceListingsUncommon,
} from './base-inventory.js';

import '@agoric/governance/src/types-ambient.js';
import { AmountMath } from '@agoric/ertp/src/amountMath.js';

const KREAD_LABEL = 'KREAd';

const trace = makeTracer(KREAD_LABEL);

const contractInfo = {
  storagePath: 'kread',
  instanceName: 'kread',
};

const { Fail } = assert;

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

const CONTRACT_ELECTORATE = 'Electorate';
const ParamTypes = {
  INVITATION: 'invitation',
};

/**
 * @template {GovernableStartFn} SF
 * @param {{
 *   zoe: ERef<ZoeService>;
 *   governedContractInstallation: ERef<Installation<SF>>;
 *   issuerKeywordRecord?: IssuerKeywordRecord;
 *   terms: Record<string, unknown>;
 *   privateArgs: any; // TODO: connect with Installation type
 *   label: string;
 * }} zoeArgs
 * @param {{
 *   governedParams: Record<string, unknown>;
 *   timer: ERef<import('@agoric/time/src/types').TimerService>;
 *   contractGovernor: ERef<Installation>;
 *   committeeCreator: import('@agoric/inter-protocol/src/proposals/econ-behaviors.js').EconomyBootstrapPowers['consume']['economicCommitteeCreatorFacet'];
 * }} govArgs
 * @returns {Promise<GovernanceFacetKit<SF>>}
 */
const startGovernedInstance = async (
  {
    zoe,
    governedContractInstallation,
    issuerKeywordRecord,
    terms,
    privateArgs,
    label,
  },
  { governedParams, timer, contractGovernor, committeeCreator },
) => {
  const poserInvitationP = E(committeeCreator).getPoserInvitation();
  const [initialPoserInvitation, electorateInvitationAmount] =
    await Promise.all([
      poserInvitationP,
      E(E(zoe).getInvitationIssuer()).getAmountOf(poserInvitationP),
    ]);

  trace('awaiting governorTerms');
  const governorTerms = await deeplyFulfilled(
    harden({
      timer,
      governedContractInstallation,
      governed: {
        terms: {
          ...terms,
          governedParams: {
            [CONTRACT_ELECTORATE]: {
              type: ParamTypes.INVITATION,
              value: electorateInvitationAmount,
            },
            ...governedParams,
          },
        },
        issuerKeywordRecord,
        label,
      },
    }),
  );

  trace('awaiting startInstance');
  const governorFacets = await E(zoe).startInstance(
    contractGovernor,
    {},
    governorTerms,
    harden({
      economicCommitteeCreatorFacet: committeeCreator,
      governed: {
        ...privateArgs,
        initialPoserInvitation,
      },
    }),
    `${label}-governor`,
  );

  trace('awaiting facets');
  const [instance, publicFacet, creatorFacet, adminFacet] = await Promise.all([
    E(governorFacets.creatorFacet).getInstance(),
    E(governorFacets.creatorFacet).getPublicFacet(),
    E(governorFacets.creatorFacet).getCreatorFacet(),
    E(governorFacets.creatorFacet).getAdminFacet(),
  ]);
  /** @type {GovernanceFacetKit<SF>} */
  const facets = harden({
    instance,
    publicFacet,
    governor: governorFacets.instance,
    creatorFacet,
    adminFacet,
    governorCreatorFacet: governorFacets.creatorFacet,
    governorAdminFacet: governorFacets.adminFacet,
  });
  return facets;
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
 * @param {object} config
 * @param {{ royaltyAddr: string, platformFeeAddr: string }} config.options
 */
// TODO rename to startKreadGovernor
export const startKread = async (powers, config) => {
  const {
    // Extremely powerful. Must be attenuated immediately.
    // The APIs will be changed to not require this of the proposal.
    zone: rootZone,
    consume: {
      zoe,
      chainTimerService,
      chainStorage,
      board,
      kreadCommitteeCreatorFacet,
      namesByAddressAdmin,
    },
    produce: { kreadKit: produceKreadKit },
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
      consume: { kreadKit: installation, contractGovernor },
    },
    instance: {
      produce: { [contractInfo.instanceName]: produceKreadInstance },
    },
  } = powers;

  const zone = rootZone.subZone(contractInfo.storagePath);

  const { royaltyAddr, platformFeeAddr } = config.options;

  trace('awaiting royaltyDepositFacet');
  const [royaltyDepositFacet] = await reserveThenGetNamePaths(
    namesByAddressAdmin,
    [[royaltyAddr, 'depositFacet']],
  );
  trace('awaiting platformFeeDepositFacet');
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

  const kreadPowers = await deeplyFulfilled(
    harden({
      storageNode: E(chainStorage).makeChildNode(contractInfo.storagePath),
      marshaller: E(board).getReadonlyMarshaller(),
    }),
  );

  /** @type {KREAdTerms} */
  const terms = harden({
    royaltyRate,
    platformFeeRate,
    mintRoyaltyRate,
    mintPlatformFeeRate,
    royaltyDepositFacet,
    platformFeeDepositFacet,
    mintFee: 5000000n,
    assetNames: {
      character: 'KREAdCHARACTER',
      item: 'KREAdITEM',
    },
    minUncommonRating: 20,
  });

  const clock = await E(chainTimerService).getClock();
  const kreadConfig = harden({
    clock,
    seed: 303,
  });

  const privateArgs = harden({ powers: kreadPowers, ...kreadConfig });

  trace('awaiting Money');
  const Money = await istIssuerP;
  trace('awaiting startGovernedInstance');
  const facets = await startGovernedInstance(
    {
      zoe,
      governedContractInstallation: installation,
      issuerKeywordRecord: harden({ Money }),
      terms,
      privateArgs,
      label: KREAD_LABEL,
    },
    {
      governedParams: {},
      timer: chainTimerService,
      contractGovernor,
      committeeCreator: kreadCommitteeCreatorFacet,
    },
  );

  const kreadKit = harden({
    ...facets,
    label: KREAD_LABEL,
    privateArgs,
  });
  produceKreadKit.resolve(kreadKit);
  const ck = zone.mapStore('ContractKits');
  ck.init(facets.instance, kreadKit);

  trace('awaiting terms');
  const { creatorFacet, instance } = facets;
  const {
    issuers: { KREAdCHARACTER: characterIssuer, KREAdITEM: itemIssuer },
    brands: { KREAdCHARACTER: characterBrand, KREAdITEM: itemBrand },
  } = await E(zoe).getTerms(instance);

  const brand = await E(Money).getBrand();

  const marketPlaceAmountCommon = AmountMath.make(brand, 5000000n);
  const marketPlaceAmountUncommon = AmountMath.make(brand, 10000000n);

  trace('awaiting KREAd initialization');
  await Promise.all([
    E(creatorFacet).initializeBaseAssets(baseCharacters, baseItems),
    E(creatorFacet).initializeMetrics(),
    E(creatorFacet).initializeCharacterNamesEntries(),
    E(creatorFacet).reviveMarketExitSubscribers(),
    E(creatorFacet).publishItemCollection(
      marketPlaceAmountCommon,
      marketplaceListingsCommon,
    ),
    E(creatorFacet).publishItemCollection(
      marketPlaceAmountUncommon,
      marketplaceListingsUncommon,
    ),
  ]);

  produceKreadInstance.resolve(instance);

  // resolving these publishes into agoricNames for `issuer` and `brand`
  produceCharacterIssuer.resolve(characterIssuer);
  produceCharacterBrand.resolve(characterBrand);
  produceItemIssuer.resolve(itemIssuer);
  produceItemBrand.resolve(itemBrand);

  trace('CONTRACT INIT SUCCESS!');
};
harden(startKread);

export const getManifestForStartKread = async (
  { restoreRef },
  { royaltyAddr, platformFeeAddr, kreadKitRef },
) => ({
  manifest: {
    [startKread.name]: {
      zone: true,
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
  options: { royaltyAddr, platformFeeAddr },
});
