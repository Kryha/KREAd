import { Far, deeplyFulfilled } from '@endo/marshal';
import { E } from '@endo/eventual-send';
import { makeFakeStorageKit } from '@agoric/internal/src/storage-test-utils';
import { buildManualTimer } from '@agoric/swingset-vat/tools/manual-timer';
import { makeFakeBoard } from '@agoric/vats/tools/board-utils';
import { makeTracer } from '@agoric/internal';
import { Fail, NonNullish } from '@agoric/assert';
import { makeIssuerKit } from '@agoric/ertp';
import { CONTRACT_ELECTORATE, ParamTypes } from '@agoric/governance';
import { makePromiseKit } from '@endo/promise-kit';
import { defaultCharacters } from '../../characters.js';
import { defaultItems } from '../../items.js';
import {
  setupMintTests,
  mintTooLongName,
  mintInvalidCharsInname,
  mintDuplicateName,
  mintExpectedFlow,
  mintFeeTooLow,
  mintForbiddenName,
  mintInventoryCheck,
  mintItemExpectedFlow,
  mintItemMultipleDifferentFlow,
  mintNoName,
  mintNoCharactersAvailable,
  mintSameItemSFT,
  mintItemMultipleFlow,
  mintNoOfferArgs,
} from './bootstrap-mint.js';
import {
  setupMarketTests,
  sellCharacter,
  buyCharacterOfferLessThanAskingPrice,
  buyCharacter,
  buyCharacterNotOnMarket,
  sellItem,
  buyItemOfferLessThanAskingPrice,
  buyItem,
  buyItemNotOnMarket,
  buyCharacterOfferMoreThanAskingPrice,
  buyItemOfferMoreThanAskingPrice,
  internalSellItemBatch,
  buyBatchSoldItem,
} from './bootstrap-market.js';
import {
  unequipAll,
  unequipAllEmptyInventory,
  unequipAlreadyUnequippedItem,
  unequipWithWrongCharacter,
  unequipItem,
  swapItems,
  swapItemsDifferentCategories,
  swapItemsInitiallyEmpty,
  setupInventoryTests,
  equipItemDuplicateCategory,
  equipItem,
} from './bootstrap-inventory.js';
import {
  initialization,
  setupMarketMetricsTests,
  collectionSize,
  averageLevelsCharacter,
  amountSoldCharacter,
  latestSalePriceCharacter,
} from './bootstrap-market-metrics.js';
import { blockMethods } from './bootstrap-governance.js';
import { makeRatio } from '@agoric/zoe/src/contractSupport/index.js';

const trace = makeTracer('kreadBootUpgrade');

const kreadV1BundleName = 'kreadV1';

export const buildRootObject = async () => {
  let vatAdmin;
  let initialPoserInvitation;
  let electorateInvitationAmount;
  let governedInstance;
  /** @type {Context} */
  let context;
  /** @type {import('@agoric/governance/tools/puppetContractGovernor').PuppetContractGovernorKit<import('../../../src/index.js').prepare>} */
  let governorFacets;

  const storageKit = makeFakeStorageKit('kread');
  const timer = buildManualTimer();
  const clock = await E(timer).getClock();
  const marshaller = makeFakeBoard().getReadonlyMarshaller();
  const installations = {};

  /** @type {PromiseKit<ZoeService>} */
  const { promise: zoe, ...zoePK } = makePromiseKit();
  const { promise: committeeCreator, ...ccPK } = makePromiseKit();

  const {
    mint: mintMockIST,
    issuer: issuerMockIST,
    brand: brandMockIST,
  } = makeIssuerKit('IST-mock', 'nat');

  const royaltyPurse = issuerMockIST.makeEmptyPurse();
  const platformFeePurse = issuerMockIST.makeEmptyPurse();
  const royaltyDepositFacet = royaltyPurse.getDepositFacet();
  const platformFeeDepositFacet = platformFeePurse.getDepositFacet();

  const royaltyRate = {
    numerator: 20n,
    denominator: 100n,
  };
  const platformFeeRate = {
    numerator: 20n,
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

  const kreadTerms = {
    mintFee: 30000000n,
    royaltyRate,
    platformFeeRate,
    mintRoyaltyRate,
    mintPlatformFeeRate,
    royaltyDepositFacet,
    platformFeeDepositFacet,
    assetNames: harden({
      character: 'KREAdCHARACTER',
      item: 'KREAdITEM',
    }),
    minUncommonRating: 20,
  };

  const staticPrivateArgs = {
    powers: {
      storageNode: storageKit.rootNode,
      marshaller,
    },
    clock,
    seed: 303,
  };

  const pathSegmentPattern = /^[a-zA-Z0-9_-]{1,100}$/;
  /** @type {(name: string) => void} */
  const assertPathSegment = (name) => {
    pathSegmentPattern.test(name) ||
      Fail`Path segment names must consist of 1 to 100 characters limited to ASCII alphanumerics, underscores, and/or dashes: ${name}`;
  };

  const sanitizePathSegment = (name) => {
    const candidate = name.replace(/[ ,]/g, '_');
    assertPathSegment(candidate);
    return candidate;
  };

  const committeeName = 'KREAd Committee';

  return Far('root', {
    /**
     *
     * @param {{
     * vatAdmin: ReturnType<import('@agoric/swingset-vat/src/vats/vat-admin/vat-vat-admin')['buildRootObject']>,
     * zoe: ReturnType<import('@agoric/vats/src/vat-zoe')['buildRootObject']>,
     * }} vats
     * @param {*} devices
     */
    bootstrap: async (vats, devices) => {
      vatAdmin = await E(vats.vatAdmin).createVatAdminService(devices.vatAdmin);
      const { zoeService } = await E(vats.zoe).buildZoe(
        vatAdmin,
        undefined,
        'zcf',
      );
      zoePK.resolve(zoeService);
      trace('Starting!');

      const v1BundleId = await E(vatAdmin).getBundleIDByName(kreadV1BundleName);
      trace('Got kread bundle');

      v1BundleId || Fail('Bundle id must not be empty.');
      installations.kreadV1 = await E(zoe).installBundleID(v1BundleId);
      trace('Installed kread bundle');

      installations.puppetContractGovernor = await E(zoe).installBundleID(
        await E(vatAdmin).getBundleIDByName('puppetContractGovernor'),
      );
      trace('Installed governor bundle');

      installations.committee = await E(zoe).installBundleID(
        await E(vatAdmin).getBundleIDByName('committee'),
      );
      trace('Installed committee bundle');

      const committeeStartResult = await E(zoe).startInstance(
        installations.committee,
        harden({}),
        {
          committeeName: 'KREAd Committee',
          committeeSize: 2,
        },
        {
          storageNode: storageKit.rootNode
            .makeChildNode('committees')
            .makeChildNode(sanitizePathSegment(committeeName)),
          marshaller,
        },
      );

      trace('Started committee');

      ccPK.resolve(committeeStartResult.creatorFacet);

      const poserInvitationP = E(committeeCreator).getPoserInvitation();
      [initialPoserInvitation, electorateInvitationAmount] = await Promise.all([
        poserInvitationP,
        E(E(zoe).getInvitationIssuer()).getAmountOf(poserInvitationP),
      ]);
    },
    buildV1: async () => {
      trace(`BOOT buildV1 start`);

      const governorTerms = await deeplyFulfilled(
        harden({
          timer,
          governedContractInstallation: NonNullish(installations.kreadV1),
          governed: {
            terms: {
              ...kreadTerms,
              governedParams: {
                [CONTRACT_ELECTORATE]: {
                  type: ParamTypes.INVITATION,
                  value: electorateInvitationAmount,
                },
              },
            },
            issuerKeywordRecord: { Money: issuerMockIST },
            label: 'KREAd',
          },
        }),
      );

      trace('got governorTerms');

      trace(`BOOT buildV1 startInstance`);
      governorFacets = await E(zoe).startInstance(
        NonNullish(installations.puppetContractGovernor),
        {},
        governorTerms,
        {
          economicCommitteeCreatorFacet: committeeCreator,
          governed: {
            ...staticPrivateArgs,
            initialPoserInvitation,
          },
        },
      );
      trace('BOOT buildV1 started instance');
      governedInstance = E(governorFacets.creatorFacet).getInstance();

      const publicFacet = await E(governorFacets.creatorFacet).getPublicFacet();
      const creatorFacet = await E(governorFacets.creatorFacet).getCreatorFacet();

      await E(creatorFacet).initializeBaseAssets(
        defaultCharacters,
        defaultItems,
      );
      await E(creatorFacet).initializeCharacterNamesEntries();
      await E(creatorFacet).initializeMetrics();

      const terms = await E(zoe).getTerms(governedInstance);
      const {
        issuers: { KREAdCHARACTER: characterIssuer, KREAdITEM: itemIssuer },
        brands: { KREAdCHARACTER: characterBrand, KREAdITEM: itemBrand },
      } = terms;

      context = {
        contractAssets: {
          character: { issuer: characterIssuer, brand: characterBrand },
          item: { issuer: itemIssuer, brand: itemBrand },
        },
        purses: {
          character: await E(characterIssuer).makeEmptyPurse(),
          item: await E(itemIssuer).makeEmptyPurse(),
          payment: issuerMockIST.makeEmptyPurse(),
        },
        paymentAsset: {
          mintMockIST,
          issuerMockIST,
          brandMockIST,
        },
        publicFacet,
        creatorFacet,
        governorFacets,
        zoe,
        royaltyPurse,
        platformFeePurse,
        royaltyRate: makeRatio(
          royaltyRate.numerator,
          brandMockIST,
          royaltyRate.denominator,
          brandMockIST,
        ),
        platformFeeRate: makeRatio(
          platformFeeRate.numerator,
          brandMockIST,
          platformFeeRate.denominator,
          brandMockIST,
        ),
      };
    },
    setupMintTests: async () => {
      context = await setupMintTests(context);
    },
    mintTooLongName: async () => {
      await mintTooLongName(context);
    },
    mintInvalidCharsInname: async () => {
      await mintInvalidCharsInname(context);
    },
    mintForbiddenName: async () => {
      await mintForbiddenName(context);
    },
    mintExpectedFlow: async () => {
      await mintExpectedFlow(context);
    },
    mintFeeTooLow: async () => {
      await mintFeeTooLow(context);
    },
    mintDuplicateName: async () => {
      await mintDuplicateName(context);
    },
    mintNoOfferArgs: async () => {
      await mintNoOfferArgs(context);
    },
    mintNoName: async () => {
      await mintNoName(context);
    },
    mintNoCharactersAvailable: async () => {
      await mintNoCharactersAvailable(context);
    },
    mintInventoryCheck: async () => {
      await mintInventoryCheck(context);
    },
    mintItemExpectedFlow: async () => {
      await mintItemExpectedFlow(context);
    },
    mintSameItemSFT: async () => {
      await mintSameItemSFT(context);
    },
    mintItemMultipleFlow: async () => {
      await mintItemMultipleFlow(context);
    },
    mintItemMultipleDifferentFlow: async () => {
      await mintItemMultipleDifferentFlow(context);
    },
    setupMarketTests: async () => {
      context = await setupMarketTests(context);
    },
    sellCharacter: async () => {
      await sellCharacter(context);
    },
    buyCharacterOfferLessThanAskingPrice: async () => {
      await buyCharacterOfferLessThanAskingPrice(context);
    },
    buyCharacter: async () => {
      await buyCharacter(context);
    },
    buyCharacterNotOnMarket: async () => {
      await buyCharacterNotOnMarket(context);
    },
    sellItem: async () => {
      await sellItem(context);
    },
    buyItemOfferLessThanAskingPrice: async () => {
      await buyItemOfferLessThanAskingPrice(context);
    },
    buyItem: async () => {
      await buyItem(context);
    },
    buyItemNotOnMarket: async () => {
      await buyItemNotOnMarket(context);
    },
    buyCharacterOfferMoreThanAskingPrice: async () => {
      await buyCharacterOfferMoreThanAskingPrice(context);
    },
    buyItemOfferMoreThanAskingPrice: async () => {
      await buyItemOfferMoreThanAskingPrice(context);
    },
    internalSellItemBatch: async () => {
      await internalSellItemBatch(context);
    },
    buyBatchSoldItem: async () => {
      await buyBatchSoldItem(context);
    },
    setupInventoryTests: async () => {
      context = await setupInventoryTests(context);
    },
    unequipItem: async () => {
      await unequipItem(context);
    },
    unequipAlreadyUnequippedItem: async () => {
      await unequipAlreadyUnequippedItem(context);
    },
    unequipWithWrongCharacter: async () => {
      await unequipWithWrongCharacter(context);
    },
    equipItem: async () => {
      await equipItem(context);
    },
    equipItemDuplicateCategory: async () => {
      await equipItemDuplicateCategory(context);
    },
    swapItems: async () => {
      await swapItems(context);
    },
    swapItemsDifferentCategories: async () => {
      await swapItemsDifferentCategories(context);
    },
    swapItemsInitiallyEmpty: async () => {
      await swapItemsInitiallyEmpty(context);
    },
    unequipAll: async () => {
      await unequipAll(context);
    },
    unequipAllEmptyInventory: async () => {
      await unequipAllEmptyInventory(context);
    },
    setupMarketMetricsTests: async () => {
      context = await setupMarketMetricsTests(context);
    },
    initialization: async () => {
      await initialization(context);
    },
    collectionSize: async () => {
      await collectionSize(context);
    },
    averageLevelsCharacter: async () => {
      await averageLevelsCharacter(context);
    },
    amountSoldCharacter: async () => {
      await amountSoldCharacter(context);
    },
    latestSalePriceCharacter: async () => {
      await latestSalePriceCharacter(context);
    },
    blockMethods: async () => {
      await blockMethods(context);
    },
    nullUpgrade: async () => {
      trace('start null upgrade');
      const bundleId = await E(vatAdmin).getBundleIDByName(kreadV1BundleName);

      const kreadAdminFacet = await E(
        governorFacets.creatorFacet,
      ).getAdminFacet();
      const upgradeResult = await E(kreadAdminFacet).upgradeContract(bundleId, {
        ...staticPrivateArgs,
        initialPoserInvitation,
      });
      assert.equal(upgradeResult.incarnationNumber, 1);
      trace('null upgrade completed');
    },
  });
};
