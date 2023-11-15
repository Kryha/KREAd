/* eslint-disable no-undef */
// @ts-check
import '@agoric/zoe/exported.js';

import { AmountMath, AssetKind } from '@agoric/ertp';
import { M } from '@agoric/store';
import { provideAll } from '@agoric/zoe/src/contractSupport/durability.js';
import { prepareRecorderKitMakers } from '@agoric/zoe/src/contractSupport/recorder.js';
import { makeRatio } from '@agoric/zoe/src/contractSupport/ratio.js';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { handleParamGovernance } from '@agoric/governance';

import { prepareKreadKit, provideKreadKitRecorderKits } from './kreadKit.js';
import { provide } from '@agoric/vat-data';

/**
 * This contract handles the mint of KREAd characters,
 * along with its corresponding item inventories and keys.
 * It also allows for equiping and unequiping items to
 * and from the inventory, using a token as access
 */

/** @typedef {import('@agoric/vat-data').Baggage} Baggage */
/** @typedef {import('@agoric/time/src/types').Clock} Clock */
/** @typedef {import('./type-guards.js').RatioObject} RatioObject */

export const meta = {
  privateArgsShape: M.splitRecord({
    initialPoserInvitation: InvitationShape,
    seed: M.number(),
    clock: M.eref(M.remotable('Clock')),
    powers: {
      storageNode: M.remotable('StorageNode'),
      marshaller: M.remotable('Marshaller'),
    },
  }),
  customTermsShape: M.splitRecord({
    royaltyRate: {
      numerator: M.lte(100n),
      denominator: M.eq(100n),
    },
    platformFeeRate: {
      numerator: M.lte(100n),
      denominator: M.eq(100n),
    },
    mintFee: M.nat(),
    mintRoyaltyRate: {
      numerator: M.lte(100n),
      denominator: M.eq(100n),
    },
    mintPlatformFeeRate: {
      numerator: M.lte(100n),
      denominator: M.eq(100n),
    },
    royaltyDepositFacet: M.any(),
    platformFeeDepositFacet: M.any(),
    assetNames: M.splitRecord({ character: M.string(), item: M.string() }),
  }),
};
harden(meta);

/**
 * @param {ZCF<KREAdTerms & GovernanceTerms<{}>>} zcf
 * @param {{
 *   seed: number
 *   powers: { storageNode: StorageNode, marshaller: Marshaller },
 *   clock: Clock
 *   defaultCharacters: object[],
 *   defaultItems: object[],
 *   initialPoserInvitation: Invitation
 * }} privateArgs
 *
 * @param {Baggage} baggage
 */
export const start = async (zcf, privateArgs, baggage) => {
  const terms = zcf.getTerms();

  // TODO: move to proposal
  const assetNames = terms.assetNames;

  // Setting up the mint capabilities here in the prepare function, as discussed with Turadg
  // durability is not a concern with these, and defining them here, passing on what's needed
  // ensures that the capabilities are where they need to be
  const { characterMint, itemMint } = await provideAll(baggage, {
    characterMint: () =>
      zcf.makeZCFMint(assetNames.character, AssetKind.COPY_BAG),
    itemMint: () => zcf.makeZCFMint(assetNames.item, AssetKind.COPY_BAG),
  });

  const characterIssuerRecord = characterMint.getIssuerRecord();
  const itemIssuerRecord = itemMint.getIssuerRecord();

  const { powers, clock, seed } = privateArgs;

  const {
    mintFee,
    royaltyRate,
    platformFeeRate,
    mintRoyaltyRate,
    mintPlatformFeeRate,
    royaltyDepositFacet,
    platformFeeDepositFacet,
    minUncommonRating,
    brands: { Money: paymentBrand },
  } = terms;

  const { makeRecorderKit } = prepareRecorderKitMakers(
    baggage,
    powers.marshaller,
  );

  /** @type {KreadKitRecorderKits} */
  const recorderKits = await provideKreadKitRecorderKits(
    baggage,
    powers.storageNode,
    makeRecorderKit,
  );

  assert(paymentBrand, 'missing paymentBrand');
  const mintFeeAmount = AmountMath.make(paymentBrand, mintFee);

  const objectToRatio = (brand, { numerator, denominator }) => {
    return makeRatio(numerator, brand, denominator, brand);
  };
  const mintRoyaltyRateRatio = objectToRatio(paymentBrand, mintRoyaltyRate);
  const mintPlatformFeeRatio = objectToRatio(paymentBrand, mintPlatformFeeRate);
  const royaltyRateRatio = objectToRatio(paymentBrand, royaltyRate);
  const platformFeeRatio = objectToRatio(paymentBrand, platformFeeRate);

  const makeKreadKit = prepareKreadKit(
    baggage,
    zcf,
    {
      seed,
      mintFeeAmount,
      royaltyRate: royaltyRateRatio,
      platformFeeRate: platformFeeRatio,
      mintRoyaltyRate: mintRoyaltyRateRatio,
      mintPlatformFeeRate: mintPlatformFeeRatio,
      royaltyDepositFacet,
      platformFeeDepositFacet,
      paymentBrand,
      minUncommonRating,
    },
    harden({
      recorderKits,
      characterMint,
      characterIssuerRecord,
      itemIssuerRecord,
      itemMint,
      clock,
      storageNode: powers.storageNode,
      makeRecorderKit,
    }),
  );

  const kreadKit = provide(baggage, 'kitSingleton', () => makeKreadKit());

  const { makeDurableGovernorFacet } = handleParamGovernance(
    zcf,
    privateArgs.initialPoserInvitation,
    {},
  );

  const { governorFacet } = makeDurableGovernorFacet(
    baggage,
    kreadKit.creator,
    {
      publishItemCollection: (price, itemsToSell) =>
        kreadKit.creator.publishItemCollection(price, itemsToSell),
    },
  );
  return harden({
    creatorFacet: governorFacet,
    // no governed parameters, so no need to augment.
    publicFacet: kreadKit.public,
  });
};

harden(start);
