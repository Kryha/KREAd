/* eslint-disable no-undef */
// @ts-check
import '@agoric/zoe/exported';

import { AssetKind } from '@agoric/ertp';
import { M } from '@agoric/store';
import { provideAll } from '@agoric/zoe/src/contractSupport/durability.js';
import { prepareRecorderKitMakers } from '@agoric/zoe/src/contractSupport/recorder.js';
import { prepareKreadKit } from './kreadKit.js';
import { makeRatio } from '@agoric/zoe/src/contractSupport/ratio.js';
import { RatioObject } from './type-guards.js';

/**
 * This contract handles the mint of KREAd characters,
 * along with its corresponding item inventories and keys.
 * It also allows for equiping and unequiping items to
 * and from the inventory, using a token as access
 */

/**
 * @typedef {import('@agoric/vat-data').Baggage} Baggage
 *
 * @typedef {import('@agoric/time/src/types').TimerService} TimerService
 */

/** @type {ContractMeta} */
export const meta = {
  privateArgsShape: M.splitRecord({
    seed: M.number(),
    clock: M.eref(M.remotable('Clock')),
    powers: {
      storageNode: M.eref(M.remotable('StorageNode')),
      marshaller: M.eref(M.remotable('Marshaller')),
    },
    royaltyRate: RatioObject,
    platformFeeRate: RatioObject,
    royaltyDepositFacet: M.any(),
    platformFeeDepositFacet: M.any(),
    paymentBrand: M.any(),
  }),
};
harden(meta);

/**
 * @param {ZCF} zcf
 * @param {{
 *   defaultCharacters: object[],
 *   defaultItems: object[],
 *   seed: number
 *   powers: { storageNode: StorageNode, marshaller: Marshaller },
 *   royaltyRate: RatioObject,
 *   platformFeeRate: RatioObject,
 *   royaltyDepositFacet: DepositFacet,
 *   platformFeeDepositFacet: DepositFacet,
 *   paymentBrand: Brand
 *   clock: import('@agoric/time/src/types').Clock
 * }} privateArgs
 * @param {import('@agoric/vat-data').Baggage} baggage
 */
export const start = async (zcf, privateArgs, baggage) => {
  // TODO: move to proposal
  const assetNames = {
    character: 'KREAdCHARACTER',
    item: 'KREAdITEM',
  };

  const storageNodePaths = {
    infoKit: 'info',
    characterKit: 'character',
    itemKit: 'item',
    marketCharacterKit: 'market-characters',
    marketItemKit: 'market-items',
    marketCharacterMetricsKit: 'market-character-metrics',
    marketItemMetricsKit: 'market-item-metrics',
  };

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

  const {
    powers,
    clock,
    seed,
    royaltyRate,
    platformFeeRate,
    royaltyDepositFacet,
    platformFeeDepositFacet,
    paymentBrand,
  } = privateArgs;

  const { makeRecorderKit } = prepareRecorderKitMakers(
    baggage,
    powers.marshaller,
  );

  const royaltyRateRatio = makeRatio(
    royaltyRate.numerator,
    paymentBrand,
    royaltyRate.denominator,
    paymentBrand,
  );
  const platformFeeRatio = makeRatio(
    platformFeeRate.numerator,
    paymentBrand,
    platformFeeRate.denominator,
    paymentBrand,
  );

  const kreadKit = await harden(
    prepareKreadKit(
      baggage,
      zcf,
      {
        seed,
        royaltyRate: royaltyRateRatio,
        platformFeeRate: platformFeeRatio,
        royaltyDepositFacet,
        platformFeeDepositFacet,
        paymentBrand,
      },
      harden({
        characterIssuerRecord,
        characterMint,
        itemIssuerRecord,
        itemMint,
        clock,
        storageNode: powers.storageNode,
        makeRecorderKit,
        storageNodePaths,
      }),
    ),
  );

  // currently still structuring this with just a public and creator facet
  // TODO: think if this still makes sense or if other patterns are more useful (e.g. characterFacet)
  return harden({
    creatorFacet: kreadKit.creator,
    publicFacet: kreadKit.public,
  });
};

harden(start);
