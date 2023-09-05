/* eslint-disable no-undef */
// @ts-check
import '@agoric/zoe/exported';

import { AssetKind } from '@agoric/ertp';
import { M } from '@agoric/store';
import { prepareKreadKit } from './kreadKit.js';
import { provideAll } from '@agoric/zoe/src/contractSupport/durability.js';
import { prepareRecorderKitMakers } from '@agoric/zoe/src/contractSupport/recorder.js';

/**
 * This contract handles the mint of KREAd characters,
 * along with its corresponding item inventories and keys.
 * It also allows for equiping and unequiping items to
 * and from the inventory, using a token as access
 **/

/**
 * @typedef {import('@agoric/vat-data').Baggage} Baggage
 *
 * @typedef {import('@agoric/time/src/types').TimerService} TimerService
 */

/** @type {ContractMeta} */
export const meta = {
  privateArgsShape: M.splitRecord({
    defaultCharacters: M.any(), // TODO: see if these can be typed
    defaultItems: M.any(), // TODO: see if these can be typed
    seed: M.number(),
    chainTimerService: M.eref(M.remotable('TimerService')),
    powers: {
      storageNode: M.eref(M.remotable('StorageNode')),
      marshaller: M.eref(M.remotable('Marshaller')),
    },
  }),
};
harden(meta);

/**
 * @param {import('@agoric/vat-data').Baggage} baggage
 * @param {ZCF} zcf
 * @param {{
 *   defaultCharacters: object[],
 *   defaultItems: object[],
 *   seed: number
 *   chainTimerService: TimerService
 *   powers: { storageNode: StorageNode, marshaller: Marshaller }
 * }} privateArgs
 * */
export const start = async (zcf, privateArgs, baggage) => {
  //TODO: move to proposal
  const assetNames = {
    character: 'KREAdCHARACTER',
    item: 'KREAdITEM',
    paymentFT: 'KREAdTOKEN',
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
  const { characterMint, itemMint, paymentFTMint } = await provideAll(baggage, {
    characterMint: () =>
      zcf.makeZCFMint(assetNames.character, AssetKind.COPY_BAG),
    itemMint: () => zcf.makeZCFMint(assetNames.item, AssetKind.COPY_BAG),
    paymentFTMint: () => zcf.makeZCFMint(assetNames.paymentFT, AssetKind.NAT),
  });

  const characterIssuerRecord = characterMint.getIssuerRecord();
  const itemIssuerRecord = itemMint.getIssuerRecord();
  const paymentFTIssuerRecord = paymentFTMint.getIssuerRecord();

  const { defaultCharacters, defaultItems, powers, chainTimerService, seed } =
    privateArgs;

  const { makeRecorderKit } = prepareRecorderKitMakers(
    baggage,
    powers.marshaller,
  );

  const kreadKit = await harden(
    prepareKreadKit(
      baggage,
      zcf,
      {
        defaultCharacters,
        defaultItems,
        seed,
      },
      harden({
        characterIssuerRecord,
        characterMint,
        itemIssuerRecord,
        itemMint,
        paymentFTIssuerRecord,
        paymentFTMint,
        chainTimerService,
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
