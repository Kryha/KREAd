/* eslint-disable no-bitwise */
/* eslint-disable no-undef */
// @ts-check
import { updateCollectionMetrics } from './market-metrics.js';
import { assert, details as X } from '@agoric/assert';
import { AmountMath, BrandShape } from '@agoric/ertp';
import { makeScalarBigMapStore, prepareExoClassKit, M } from '@agoric/vat-data';
import { E } from '@endo/eventual-send';
import { errors } from './errors.js';
import {
  makeCharacterNftObjs,
  makeStorageNodeRecorderKits,
  makeCopyBagAmountShape,
} from './utils.js';

import { text } from './text.js';
import { makeCopyBag, mustMatch } from '@agoric/store';
import {
  CharacterI,
  HelperI,
  ItemI,
  MarketI,
  PublicI,
  CreatorI,
  CharacterGuardBagShape,
  ItemGuard,
  ItemGuardBagShape,
  CharacterRecorderGuard,
  ItemRecorderGuard,
  MarketRecorderGuard,
  MarketMetricsGuard,
  RarityGuard,
  BaseCharacterGuard,
  MarketEntryGuard,
  CharacterEntryGuard,
} from './type-guards.js';
import { atomicRearrange } from '@agoric/zoe/src/contractSupport/index.js';
import { multiplyBy } from '@agoric/zoe/src/contractSupport/ratio.js';

import '@agoric/zoe/exported.js';

/**
 * this provides the exoClassKit for our upgradable KREAd contract
 * Utilizes capabilities from the prepare function suchs as mints
 * timer service and values from the privateArgs
 *
 *
 * @param {import('@agoric/vat-data').Baggage} baggage
 * @param {ZCF} zcf
 * @param {{
 *   seed: number,
 *   mintFeeAmount: Amount<'nat'>,
 *   royaltyRate: Ratio,
 *   platformFeeRate: Ratio,
 *   mintRoyaltyRate: Ratio,
 *   mintPlatformFeeRate: Ratio,
 *   royaltyDepositFacet: DepositFacet,
 *   platformFeeDepositFacet: DepositFacet,
 *   paymentBrand: Brand,
 *   minUncommonRating: number
 * }} privateArgs
 * @param {{
 *   characterIssuerRecord: IssuerRecord<"copyBag">
 *   characterMint: ZCFMint<"copyBag">
 *   itemIssuerRecord: IssuerRecord<"copyBag">
 *   itemMint: ZCFMint<"copyBag">
 *   clock: import('@agoric/time/src/types.js').Clock
 *   storageNode: StorageNode
 *   makeRecorderKit: import('@agoric/zoe/src/contractSupport').MakeRecorderKit
 *   storageNodePaths: Object
 * }} powers
 */
export const prepareKreadKit = async (
  baggage,
  zcf,
  {
    seed,
    mintFeeAmount,
    royaltyRate,
    platformFeeRate,
    mintRoyaltyRate,
    mintPlatformFeeRate,
    royaltyDepositFacet,
    platformFeeDepositFacet,
    paymentBrand,
    minUncommonRating,
  },
  {
    characterIssuerRecord,
    characterMint,
    itemIssuerRecord,
    itemMint,
    clock,
    storageNode,
    makeRecorderKit,
    storageNodePaths,
  },
) => {
  const { brand: characterBrand } = characterIssuerRecord;
  const { brand: itemBrand } = itemIssuerRecord;

  const {
    characterKit,
    itemKit,
    marketCharacterKit,
    marketItemKit,
    marketCharacterMetricsKit,
    marketItemMetricsKit,
  } = await makeStorageNodeRecorderKits(
    storageNode,
    makeRecorderKit,
    storageNodePaths,
    {
      characterKit: CharacterRecorderGuard,
      itemKit: ItemRecorderGuard,
      marketCharacterKit: M.arrayOf(MarketRecorderGuard),
      marketItemKit: M.arrayOf(MarketRecorderGuard),
      marketCharacterMetricsKit: MarketMetricsGuard,
      marketItemMetricsKit: MarketMetricsGuard,
    },
  );
  const marketItemNode = marketItemKit.recorder.getStorageNode();
  const marketCharacterNode = marketCharacterKit.recorder.getStorageNode();

  const characterNode = characterKit.recorder.getStorageNode();

  const characterShape = makeCopyBagAmountShape(
    characterBrand,
    CharacterGuardBagShape,
  );
  const itemShape = makeCopyBagAmountShape(itemBrand, ItemGuardBagShape);

  const makeKreadKitInternal = prepareExoClassKit(
    baggage,
    'KreadKit',
    {
      helper: HelperI,
      character: CharacterI,
      item: ItemI,
      market: MarketI,
      public: PublicI,
      creator: CreatorI,
    },
    () => {
      return {
        character: harden({
          entries: makeScalarBigMapStore('characters', {
            durable: true,
            keyShape: M.string(),
            valueShape: M.or(CharacterEntryGuard, M.arrayOf(M.string())),
          }),
          bases: makeScalarBigMapStore('baseCharacters', {
            durable: true,
            keyShape: M.number(),
            valueShape: BaseCharacterGuard,
          }),
        }),
        item: harden({
          entries: makeScalarBigMapStore('items', {
            durable: true,
            keyShape: M.number(),
            valueShape: ItemRecorderGuard,
          }),
          bases: makeScalarBigMapStore('baseItems', {
            durable: true,
            keyShape: RarityGuard,
            valueShape: M.arrayOf(ItemGuard),
          }),
        }),
        market: harden({
          characterEntries: makeScalarBigMapStore('characterMarket', {
            durable: true,
            keyShape: M.string(),
            valueShape: MarketEntryGuard,
          }),
          itemEntries: makeScalarBigMapStore('itemMarket', {
            durable: true,
            keyShape: M.number(),
            valueShape: MarketEntryGuard,
          }),
          metrics: makeScalarBigMapStore('marketMetrics', {
            durable: true,
            keyShape: M.or('character', 'item'),
            valueShape: MarketMetricsGuard,
          }),
        }),
      };
    },
    {
      helper: {
        async getTimeStamp() {
          return E(clock).getCurrentTimestamp();
        },
        randomNumber() {
          seed |= 0;
          seed = (seed + 0x6d2b79f5) | 0;
          let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
          // eslint-disable-next-line operator-assignment
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        },
      },
      character: {
        calculateLevel(name) {
          const character = this.state.character.entries.get(name);
          let level = character.character.level;

          const itemLevels = character.inventory
            .getAmountAllocated('Item')
            .value.payload.map(([value, _supply]) => {
              return value.level;
            });

          level = itemLevels.reduce((acc, value) => acc + value, level);
          return level;
        },
        validateInventoryState(inventoryState) {
          const itemTypes = inventoryState.map((item) => item.category);
          return itemTypes.length === new Set(itemTypes).size;
        },
        isNameUnique(name) {
          return !this.state.character.entries.has(name);
        },
        getRandomBaseIndex() {
          const { helper } = this.facets;
          const { character: characterState } = this.state;
          const number = Math.floor(
            helper.randomNumber() * characterState.bases.getSize(),
          );
          return Array.from(characterState.bases.keys())[number];
        },
        initializeBaseCharacters(baseCharacters) {
          const { character: characterState } = this.state;
          if (characterState.bases.getSize() > 0) return;
          characterState.bases.addAll(baseCharacters);
        },
        async makeInventoryRecorderKit(path) {
          const node = await E(characterNode).makeChildNode(
            `inventory-${path}`,
          );
          return makeRecorderKit(node, M.arrayOf([ItemGuard, M.nat()]));
        },
        mint() {
          const handler = async (seat, offerArgs) => {
            const {
              helper,
              character: characterFacet,
              item,
              market: marketFacet,
            } = this.facets;

            const { character: characterState } = this.state;

            const { give } = seat.getProposal();
            mustMatch(
              offerArgs,
              M.splitRecord({
                name: M.string(harden({ stringLengthLimit: 20 })),
              }),
              'offerArgs',
            );

            const newCharacterName = offerArgs.name;

            AmountMath.isGTE(give.Price, mintFeeAmount) ||
              assert.fail(X`${errors.mintFeeTooLow}`);

            !characterState.entries.get('names').includes(newCharacterName) ||
              assert.fail(X`${errors.nameTaken(newCharacterName)}`);

            characterState.bases.getSize() > 0 ||
              assert.fail(X`${errors.allMinted}`);

            const re = /^[a-zA-Z0-9_-]*$/;
            (re.test(newCharacterName) && newCharacterName !== 'names') ||
              assert.fail(X`${errors.invalidName}`);

            const baseIndex = characterFacet.getRandomBaseIndex();
            const baseCharacter = characterState.bases.get(baseIndex);

            characterState.bases.delete(baseIndex);

            characterState.entries.set(
              'names',
              harden([
                ...characterState.entries.get('names'),
                newCharacterName,
              ]),
            );

            try {
              const currentTime = await helper.getTimeStamp();

              const [newCharacterAmount1, newCharacterAmount2] =
                makeCharacterNftObjs(
                  newCharacterName,
                  baseCharacter,
                  characterState.entries.getSize(),
                  currentTime,
                ).map((character) =>
                  AmountMath.make(
                    characterBrand,
                    makeCopyBag(harden([[character, 1n]])),
                  ),
                );

              const { zcfSeat, userSeat } = zcf.makeEmptySeatKit();

              const { zcfSeat: inventorySeat } = zcf.makeEmptySeatKit();
              // Mint character to user seat & inventorySeat
              characterMint.mintGains({ Asset: newCharacterAmount1 }, seat);
              characterMint.mintGains(
                { CharacterKey: newCharacterAmount2 },
                inventorySeat,
              );

              const inventoryKit =
                await characterFacet.makeInventoryRecorderKit(newCharacterName);

              await item.mintDefaultBatch(inventorySeat);

              const royaltyFee = multiplyBy(give.Price, mintRoyaltyRate);
              const platformFee = multiplyBy(give.Price, mintPlatformFeeRate);

              /** @type {TransferPart[]} */
              const transfers = [];
              transfers.push([
                seat,
                zcfSeat,
                { Price: royaltyFee },
                { Royalty: royaltyFee },
              ]);
              transfers.push([
                seat,
                zcfSeat,
                { Price: platformFee },
                { PlatformFee: platformFee },
              ]);

              try {
                atomicRearrange(zcf, harden(transfers));
              } catch (e) {
                assert.fail(X`${errors.rearrangeError}`);
              }

              seat.exit();
              zcfSeat.exit();

              const payouts = await E(userSeat).getPayouts();
              const royaltyPayout = await payouts.Royalty;
              const platformFeePayout = await payouts.PlatformFee;

              await E(royaltyDepositFacet).receive(royaltyPayout);
              await E(platformFeeDepositFacet).receive(platformFeePayout);

              // Add to state
              const character = {
                name: newCharacterName,
                character: newCharacterAmount1.value.payload[0][0],
                inventory: inventorySeat,
                inventoryKit,
                history: [
                  {
                    type: 'mint',
                    data: newCharacterAmount1.value[0],
                    timestamp: currentTime,
                  },
                ],
              };

              characterState.entries.addAll([
                [character.name, harden(character)],
              ]);

              // update metrics
              marketFacet.updateMetrics('character', {
                collectionSize: true,
                averageLevel: {
                  type: 'add',
                  value: character.character.level,
                },
              });

              characterKit.recorder.write(
                // write `character` minus `seat` prop
                (({ seat: _omitSeat, ...char }) => char)(character),
              );

              // TODO: consider refactoring what we put in the inventory node
              inventoryKit.recorder.write(
                inventorySeat.getAmountAllocated('Item').value.payload,
              );

              return text.mintCharacterReturn;
            } catch (e) {
              // restore base char deletion and and name entry
              characterState.bases.addAll([[baseIndex, baseCharacter]]);
              characterState.entries.set(
                'names',
                harden(
                  characterState.entries
                    .get('names')
                    .filter((name) => name !== newCharacterName),
                ),
              );
              return e;
            }
          };
          return zcf.makeInvitation(
            handler,
            'mintCharacterNfts',
            undefined,
            undefined,
          );
        },
        equip() {
          const handler = (seat) => {
            const { character: characterFacet } = this.facets;
            const { character: characterState } = this.state;

            // Retrieve Items and Inventory key from user seat
            const providedItemAmount = seat.getAmountAllocated('Item');
            const providedCharacterKeyAmount =
              seat.getAmountAllocated('CharacterKey1');
            const providedCharacterKey =
              providedCharacterKeyAmount.value.payload[0][0];
            const characterName = providedCharacterKey.name;

            // Find characterRecord entry based on provided key
            const characterRecord = characterState.entries.get(characterName);
            const inventorySeat = characterRecord.inventory;

            const { want } = seat.getProposal();
            const { CharacterKey2: wantedCharacter } = want;

            // Get current Character Key from inventorySeat
            const inventoryCharacterKey =
              inventorySeat.getAmountAllocated('CharacterKey');
            inventoryCharacterKey || assert.fail(X`${errors.noKeyInInventory}`);

            AmountMath.isEqual(
              wantedCharacter,
              inventoryCharacterKey,
              characterBrand,
            ) || assert.fail(X`${errors.inventoryKeyMismatch}`);

            // Ensure inventory STATE will be valid before reallocation
            let inventory = inventorySeat
              .getCurrentAllocation()
              .Item.value.payload.map(([value, _supply]) => value);
            if (providedItemAmount.value.payload[0])
              inventory = [
                ...inventory,
                providedItemAmount.value.payload[0][0],
              ];

            characterFacet.validateInventoryState(inventory) ||
              assert.fail(X`${errors.duplicateCategoryInInventory}`);

            /** @type {TransferPart[]} */
            const transfers = [];
            transfers.push([seat, inventorySeat, { Item: providedItemAmount }]);
            transfers.push([
              seat,
              inventorySeat,
              { CharacterKey1: providedCharacterKeyAmount },
              { CharacterKey: providedCharacterKeyAmount },
            ]);
            transfers.push([
              inventorySeat,
              seat,
              { CharacterKey: inventoryCharacterKey },
              { CharacterKey2: inventoryCharacterKey },
            ]);

            try {
              atomicRearrange(zcf, harden(transfers));
            } catch (e) {
              assert.fail(X`${errors.rearrangeError}`);
            }

            characterRecord.inventoryKit.recorder.write(
              inventorySeat.getAmountAllocated('Item').value.payload,
            );

            seat.exit();

            return text.equipReturn;
          };
          return zcf.makeInvitation(
            handler,
            'addToInventory',
            undefined,
            M.splitRecord({
              give: {
                CharacterKey1: M.splitRecord(characterShape),
                Item: M.splitRecord(itemShape),
              },
              want: {
                CharacterKey2: M.splitRecord(characterShape),
              },
            }),
          );
        },
        unequip() {
          const handler = async (seat) => {
            const { character: characterState } = this.state;

            // Retrieve Character key from user seat
            const providedCharacterKeyAmount =
              seat.getAmountAllocated('CharacterKey1');
            const providedCharacterKey =
              providedCharacterKeyAmount.value.payload[0][0];
            const characterName = providedCharacterKey.name;

            // Find character record entry based on provided key
            const characterRecord = characterState.entries.get(characterName);
            const inventorySeat = characterRecord.inventory;
            providedCharacterKey ||
              assert.fail(X`${errors.invalidCharacterKey}`);

            // Get reference to the wanted items and key
            const { want } = seat.getProposal();
            const { Item: requestedItems, CharacterKey2: wantedCharacter } =
              want;

            const inventoryCharacterKey =
              inventorySeat.getAmountAllocated('CharacterKey');
            inventoryCharacterKey || assert.fail(X`${errors.noKeyInInventory}`);

            // Ensure requested key and inventory key match

            AmountMath.isEqual(
              wantedCharacter,
              inventoryCharacterKey,
              characterBrand,
            ) || assert.fail(X`${errors.inventoryKeyMismatch}`);

            /** @type {TransferPart[]} */
            const transfers = [];
            transfers.push([inventorySeat, seat, { Item: requestedItems }]);
            transfers.push([
              seat,
              inventorySeat,
              { CharacterKey1: providedCharacterKeyAmount },
              { CharacterKey: providedCharacterKeyAmount },
            ]);
            transfers.push([
              inventorySeat,
              seat,
              { CharacterKey: wantedCharacter },
              { CharacterKey2: wantedCharacter },
            ]);

            try {
              atomicRearrange(zcf, harden(transfers));
            } catch (e) {
              assert.fail(X`${errors.rearrangeError}`);
            }

            characterRecord.inventoryKit.recorder.write(
              inventorySeat.getAmountAllocated('Item').value.payload,
            );

            seat.exit();
            return text.unequipReturn;
          };

          return zcf.makeInvitation(
            handler,
            'removeFromInventory',
            undefined,
            M.splitRecord({
              give: {
                CharacterKey1: M.splitRecord(characterShape),
              },
              want: {
                CharacterKey2: M.splitRecord(characterShape),
                Item: M.splitRecord(itemShape),
              },
            }),
          );
        },
        swap() {
          const handler = (seat) => {
            const { character: characterFacet } = this.facets;
            const { character: characterState } = this.state;

            // Retrieve Items and Inventory key from user seat
            const providedItemAmount = seat.getAmountAllocated('Item1');
            const providedCharacterKeyAmount =
              seat.getAmountAllocated('CharacterKey1');
            const providedCharacterKey =
              providedCharacterKeyAmount.value.payload[0][0];
            // const providedItems = providedItemAmount.value;
            const characterName = providedCharacterKey.name;

            // Find character record entry based on provided key
            const characterRecord = characterState.entries.get(characterName);
            const inventorySeat = characterRecord.inventory;
            providedCharacterKey ||
              assert.fail(X`${errors.invalidCharacterKey}`);

            const { want } = seat.getProposal();
            const {
              CharacterKey2: wantedCharacterAmount,
              Item2: wantedItemsAmount,
            } = want;

            // Ensure requested key and inventory key match
            const inventoryCharacterKey =
              inventorySeat.getAmountAllocated('CharacterKey');
            inventoryCharacterKey || assert.fail(X`${errors.noKeyInInventory}`);

            AmountMath.isEqual(
              wantedCharacterAmount,
              inventoryCharacterKey,
              characterBrand,
            ) || assert.fail(X`${errors.inventoryKeyMismatch}`);

            // Ensure inventory STATE is valid before reallocation
            let inventory = inventorySeat
              .getCurrentAllocation()
              .Item.value.payload.map(([value, _supply]) => value);

            if (wantedItemsAmount.value.payload[0])
              inventory = inventory.filter(
                (item) =>
                  item.category !==
                  wantedItemsAmount.value.payload[0][0].category,
              );
            if (providedItemAmount.value.payload[0])
              inventory = [
                ...inventory,
                providedItemAmount.value.payload[0][0],
              ];

            characterFacet.validateInventoryState(inventory) ||
              assert.fail(X`${errors.duplicateCategoryInInventory}`);

            /** @type {TransferPart[]} */
            const transfers = [];
            transfers.push([
              seat,
              inventorySeat,
              { Item1: providedItemAmount },
              { Item: providedItemAmount },
            ]);
            transfers.push([
              inventorySeat,
              seat,
              { Item: wantedItemsAmount },
              { Item2: wantedItemsAmount },
            ]);
            transfers.push([
              seat,
              inventorySeat,
              { CharacterKey1: providedCharacterKeyAmount },
              { CharacterKey: providedCharacterKeyAmount },
            ]);
            transfers.push([
              inventorySeat,
              seat,
              { CharacterKey: wantedCharacterAmount },
              { CharacterKey2: wantedCharacterAmount },
            ]);

            try {
              atomicRearrange(zcf, harden(transfers));
            } catch (e) {
              assert.fail(X`${errors.rearrangeError}`);
            }

            characterRecord.inventoryKit.recorder.write(
              inventorySeat.getAmountAllocated('Item').value.payload,
            );
            seat.exit();
          };

          return zcf.makeInvitation(
            handler,
            'itemInventorySwap',
            undefined,
            M.splitRecord({
              give: {
                CharacterKey1: M.splitRecord(characterShape),
                Item1: M.splitRecord(itemShape),
              },
              want: M.splitRecord(
                {
                  CharacterKey2: M.splitRecord(characterShape),
                },
                { Item2: M.splitRecord(itemShape) },
              ),
            }),
          );
        },
        unequipAll() {
          const handler = (seat) => {
            const { character: characterState } = this.state;

            // Retrieve Character key from user seat
            const providedCharacterKeyAmount =
              seat.getAmountAllocated('CharacterKey1');
            const providedCharacterKey =
              providedCharacterKeyAmount.value.payload[0][0];
            const characterName = providedCharacterKey.name;

            // Find character record entry based on provided key
            const characterRecord = characterState.entries.get(characterName);
            const inventorySeat = characterRecord.inventory;
            providedCharacterKey ||
              assert.fail(X`${errors.invalidCharacterKey}`);

            // Get reference to the wanted item
            const { want } = seat.getProposal();
            const { CharacterKey2: wantedCharacter } = want;

            // Get Character Key from inventorySeat
            const inventoryCharacterKey =
              inventorySeat.getAmountAllocated('CharacterKey');
            inventoryCharacterKey || assert.fail(X`${errors.noKeyInInventory}`);

            const items = inventorySeat.getAmountAllocated('Item', itemBrand);

            AmountMath.isEqual(
              wantedCharacter,
              inventoryCharacterKey,
              characterBrand,
            ) || assert.fail(X`${errors.inventoryKeyMismatch}`);

            /** @type {TransferPart[]} */
            const transfers = [];
            transfers.push([inventorySeat, seat, { Item: items }]);
            transfers.push([
              seat,
              inventorySeat,
              { CharacterKey1: providedCharacterKeyAmount },
              { CharacterKey: providedCharacterKeyAmount },
            ]);
            transfers.push([
              inventorySeat,
              seat,
              { CharacterKey: wantedCharacter },
              { CharacterKey2: wantedCharacter },
            ]);

            try {
              atomicRearrange(zcf, harden(transfers));
            } catch (e) {
              assert.fail(X`${errors.rearrangeError}`);
            }
            seat.exit();

            characterRecord.inventoryKit.recorder.write(
              inventorySeat.getAmountAllocated('Item').value.payload,
            );
          };

          return zcf.makeInvitation(
            handler,
            'removeAllItemsFromInventory',
            undefined,
            M.splitRecord({
              give: {
                CharacterKey1: M.splitRecord(characterShape),
              },
              want: {
                CharacterKey2: M.splitRecord(characterShape),
              },
            }),
          );
        },
      },
      item: {
        initializeBaseItems(baseItems) {
          const { item: itemState } = this.state;
          if (itemState.bases.getSize() > 0) return;

          const common = [];
          const uncommonToLegendary = [];

          baseItems.forEach((item) => {
            if (item.rarity < minUncommonRating) common.push(item);
            else uncommonToLegendary.push(item);
          });

          itemState.bases.addAll([
            ['common', harden(common)],
            ['uncommonToLegendary', harden(uncommonToLegendary)],
          ]);
        },
        // Mints the default set of items to a seat that doesn't exit
        async mintDefaultBatch(seat) {
          const { helper, market: marketFacet } = this.facets;
          const { item: itemState } = this.state;

          let commonBases = itemState.bases.get('common');
          const index1 = Math.floor(helper.randomNumber() * commonBases.length);
          const item1 = commonBases[index1];

          commonBases = commonBases.filter(
            (item) => item.category !== item1.category,
          );
          const index2 = Math.floor(helper.randomNumber() * commonBases.length);
          const item2 = commonBases[index2];

          const uncommonToLegendary = itemState.bases
            .get('uncommonToLegendary')
            .filter(
              (item) =>
                item.category !== item1.category &&
                item.category !== item2.category,
            );
          const index3 = Math.floor(
            helper.randomNumber() * uncommonToLegendary.length,
          );
          const item3 = uncommonToLegendary[index3];

          const items = [item1, item2, item3];

          const currentTime = await helper.getTimeStamp();

          const newItemAmount = AmountMath.make(
            itemBrand,
            makeCopyBag(harden(items.map((item) => [item, 1n]))),
          );

          await itemMint.mintGains({ Item: newItemAmount }, seat);

          let id = itemState.entries.getSize();

          items.forEach((i) => {
            const item = {
              id,
              item: i,
              history: [
                {
                  type: 'mint',
                  data: i,
                  timestamp: currentTime,
                },
              ],
            };

            itemState.entries.addAll([[id, harden(item)]]);
            itemKit.recorder.write(item);

            id += 1;
            // update metrics
            marketFacet.updateMetrics('item', {
              collectionSize: true,
              averageLevel: {
                type: 'add',
                value: item.item.level,
              },
            });
          });

          return text.mintItemReturn;
        },
        /**
         *
         * @param {ZCFSeat} seat
         * @param {[Item, bigint][]} itemBatch
         * @returns {Promise<string>}
         */
        async mintBatch(seat, itemBatch) {
          const { helper, market: marketFacet } = this.facets;
          const { item: itemState } = this.state;

          const currentTime = await helper.getTimeStamp();

          const newItemAmount = AmountMath.make(
            itemBrand,
            makeCopyBag(harden(itemBatch)),
          );

          await itemMint.mintGains({ Item: newItemAmount }, seat);

          let id = itemState.entries.getSize();

          itemBatch.forEach((copyBagEntry) => {
            const [itemAsset, itemSupply] = copyBagEntry;

            for (let n = 0; n < itemSupply; n += 1) {
              const item = {
                id,
                item: itemAsset,
                history: [
                  {
                    type: 'mint',
                    data: itemAsset,
                    timestamp: currentTime,
                  },
                ],
              };

              itemState.entries.addAll([[id, harden(item)]]);
              itemKit.recorder.write(item);

              id += 1;
              // update metrics
              marketFacet.updateMetrics('item', {
                collectionSize: true,
                averageLevel: {
                  type: 'add',
                  value: item.item.level,
                },
              });
            }
          });

          return text.mintItemReturn;
        },
        mint() {
          const handler = async (seat) => {
            const { helper, market: marketFacet } = this.facets;
            const { item: itemState } = this.state;

            const { want } = seat.getProposal();

            const currentTime = await helper.getTimeStamp();

            const items = want.Item.value.payload.map(([item, supply]) => {
              return [item, supply];
            });
            const newItemAmount = AmountMath.make(
              itemBrand,
              makeCopyBag(harden(items)),
            );

            itemMint.mintGains({ Asset: newItemAmount }, seat);

            seat.exit();

            let id = itemState.entries.getSize();

            items.forEach((j) => {
              const i = j[0];
              const item = {
                id,
                item: i,
                // Potentially have separate durable stores for the history
                history: [
                  {
                    type: 'mint',
                    data: i,
                    timestamp: currentTime,
                  },
                ],
              };

              itemState.entries.addAll([[id, harden(item)]]);
              itemKit.recorder.write(item);

              id += 1;
              // update metrics
              marketFacet.updateMetrics('item', {
                collectionSize: true,
                averageLevel: {
                  type: 'add',
                  value: item.item.level,
                },
              });
            });

            return text.mintItemReturn;
          };

          return zcf.makeInvitation(
            handler,
            'mintItemNfts',
            undefined,
            M.splitRecord({
              want: {
                Item: M.splitRecord(itemShape),
              },
            }),
          );
        },
      },
      market: {
        handleExitCharacter(entry) {
          const { market } = this.state;
          const { market: marketFacet, character: characterFacet } =
            this.facets;

          const { seat, asset, recorderKit } = entry;
          const characterLevel = characterFacet.calculateLevel(asset.name);

          const subscriber = E(seat).getSubscriber();
          void E.when(E(subscriber).getUpdateSince(), () => {
            marketFacet.updateMetrics('character', {
              marketplaceAverageLevel: {
                type: 'remove',
                value: characterLevel,
              },
            });

            market.characterEntries.delete(asset.name);

            void marketFacet.deleteNode(recorderKit.recorder.getStorageNode());
          });
        },
        handleExitItem(entry) {
          const { market } = this.state;
          const { market: marketFacet } = this.facets;

          const { seat, asset, id, recorderKit } = entry;

          const subscriber = E(seat).getSubscriber();
          E.when(E(subscriber).getUpdateSince(), () => {
            marketFacet.updateMetrics('item', {
              marketplaceAverageLevel: {
                type: 'remove',
                value: asset.level,
              },
            });

            market.itemEntries.delete(id);
            void marketFacet.deleteNode(recorderKit.recorder.getStorageNode());
          });
        },
        updateMetrics(collection, updateMetrics) {
          const updatedMetrics = updateCollectionMetrics(
            collection,
            this.state,
            updateMetrics,
          );
          if (collection === 'character') {
            marketCharacterMetricsKit.recorder.write(updatedMetrics);
          } else if (collection === 'item') {
            marketItemMetricsKit.recorder.write(updatedMetrics);
          }
        },
        async makeMarketItemRecorderKit(id) {
          const path = `item-${String(id)}`;
          const node = await E(marketItemNode).makeChildNode(path);
          return makeRecorderKit(node, MarketRecorderGuard);
        },
        async makeMarketCharacterRecorderKit(id) {
          const path = `character-${id}`;
          const node = await E(marketCharacterNode).makeChildNode(path);
          return makeRecorderKit(node, MarketRecorderGuard);
        },
        /**
         * Caveat assumes parent is either `marketCharacterNode` or
         * `marketItemNode` and only the latter has 'character' anywhere in its
         * path.
         *
         * @param {StorageNode} node
         */
        // STOPGAP until https://github.com/Agoric/agoric-sdk/issues/7405 is available in Mainnet
        async deleteNode(node) {
          const path = await E(node).getPath();
          const segments = path.split('.');
          const parent = path.includes('character')
            ? marketCharacterNode
            : marketItemNode;
          const childSegment = segments.at(-1);
          assert(childSegment, `missing child path segment in ${path}`);
          const deletable = E(parent).makeChildNode(childSegment, {
            sequence: false,
          });
          await E(deletable).setValue('');
        },
        sellItem() {
          const handler = async (seat) => {
            const { market } = this.state;
            const { market: marketFacet } = this.facets;

            // Inspect allocation of Character keyword in seller seat
            const itemInSellSeat = seat.getAmountAllocated('Item');
            const { want } = seat.getProposal();

            paymentBrand === want.Price.brand ||
              assert.fail(X`${errors.incorrectPaymentBrand(paymentBrand)}`);
            const askingPrice = {
              brand: want.Price.brand,
              value: want.Price.value,
            };
            const royalty = multiplyBy(want.Price, royaltyRate);
            const platformFee = multiplyBy(want.Price, platformFeeRate);

            const item = itemInSellSeat.value.payload[0][0];
            const id = this.state.market.metrics.get('item').putForSaleCount;

            const entryRecorder = await marketFacet.makeMarketItemRecorderKit(
              id,
            );

            // Add to store array
            const newEntry = {
              seat,
              askingPrice,
              royalty,
              platformFee,
              id,
              asset: item,
              recorderKit: entryRecorder,
              isFirstSale: false,
            };

            // update metrics
            marketFacet.updateMetrics('item', {
              marketplaceAverageLevel: {
                type: 'add',
                value: item.level,
              },
            });

            market.itemEntries.addAll([[newEntry.id, harden(newEntry)]]);

            const {
              seat: _omitSeat,
              recorderKit,
              recorderNode: _omitNode,
              ...entry
            } = newEntry;
            recorderKit.recorder.write(entry);
            marketFacet.updateMetrics('item', { putForSaleCount: true });

            marketFacet.handleExitItem(newEntry);
          };

          return zcf.makeInvitation(
            handler,
            'Sell Item in KREAd marketplace',
            undefined,
            M.splitRecord({
              give: {
                Item: M.splitRecord(itemShape),
              },
              want: {
                Price: M.splitRecord({
                  brand: BrandShape,
                  value: M.nat(),
                }),
              },
            }),
          );
        },
        publishItemCollection() {
          /**
           *
           * @param {ZCFSeat} seat
           * @param {{
           *    itemsToSell: [Item, bigint][],
           * }} privateArgs
           */
          const handler = async (seat, { itemsToSell }) => {
            const { market } = this.state;
            const { market: marketFacet, item } = this.facets;

            // const { zcfSeat: internalSellSeat } = zcf.makeEmptySeatKit();
            const internalSellSeat = seat;
            await item.mintBatch(internalSellSeat, itemsToSell);

            const { want } = seat.getProposal();
            const askingPrice = {
              brand: want.Price.brand,
              value: want.Price.value,
            };
            const royalty = {
              brand: want.Price.brand,
              value: BigInt(royaltyRate * Number(want.Price.value)),
            };
            const platformFee = {
              brand: want.Price.brand,
              value: BigInt(platformFeeRate * Number(want.Price.value)),
            };

            const claimedIdAndRecorder = await Promise.all(
              itemsToSell.map(async (copyBagEntry) => {
                const [_, itemSupply] = copyBagEntry;
                const supplyRange = Array.from(
                  Array(Number(itemSupply)).keys(),
                );
                const idAndRecorder = await Promise.all(
                  // FIXME why is this mapping over a value it ignores?
                  supplyRange.map(async (_) => {
                    const id =
                      this.state.market.metrics.get('item').putForSaleCount;
                    await marketFacet.updateMetrics('item', {
                      putForSaleCount: true,
                    });
                    const entryRecorder =
                      await marketFacet.makeMarketItemRecorderKit(id);

                    return [id, entryRecorder];
                  }),
                );
                return idAndRecorder;
              }),
            );

            itemsToSell.forEach(async (copyBagEntry, i) => {
              const [itemAsset, itemSupply] = copyBagEntry;

              for (let n = 0; n < itemSupply; n += 1) {
                const [id, entryRecorder] = claimedIdAndRecorder[i][n];

                // Add to store array
                const newEntry = {
                  seat: internalSellSeat,
                  askingPrice,
                  royalty,
                  platformFee,
                  id,
                  asset: itemAsset,
                  recorderKit: entryRecorder,
                  isFirstSale: true,
                };

                // update metrics
                marketFacet.updateMetrics('item', {
                  marketplaceAverageLevel: {
                    type: 'add',
                    value: itemAsset.level,
                  },
                });

                market.itemEntries.addAll([[newEntry.id, harden(newEntry)]]);
                const { seat: _omitSeat, recorderKit, ...entry } = newEntry;
                recorderKit.recorder.write(entry);
              }
            });
          };

          return zcf.makeInvitation(
            handler,
            'PublishItemCollection',
            undefined,
            M.splitRecord({
              want: {
                Price: M.splitRecord({
                  brand: BrandShape,
                  value: M.nat(),
                }),
              },
            }),
          );
        },
        sellCharacter() {
          const handler = async (seat) => {
            const { market } = this.state;
            const { character: characterFacet, market: marketFacet } =
              this.facets;

            // Inspect allocation of Character keyword in seller seat
            const characterInSellSeat = seat.getAmountAllocated('Character');
            const { want } = seat.getProposal();

            paymentBrand === want.Price.brand ||
              assert.fail(X`${errors.incorrectPaymentBrand(paymentBrand)}`);
            const askingPrice = {
              brand: want.Price.brand,
              value: want.Price.value,
            };
            const royalty = multiplyBy(want.Price, royaltyRate);
            const platformFee = multiplyBy(want.Price, platformFeeRate);

            const character = characterInSellSeat.value.payload[0][0];

            const entryRecorder =
              await marketFacet.makeMarketCharacterRecorderKit(character.name);

            // Add to store array
            const newEntry = {
              seat,
              askingPrice,
              royalty,
              platformFee,
              id: character.name,
              asset: character,
              recorderKit: entryRecorder,
              isFirstSale: false,
            };

            // update metrics
            const characterLevel = characterFacet.calculateLevel(
              character.name,
            );
            marketFacet.updateMetrics('character', {
              marketplaceAverageLevel: {
                type: 'add',
                value: characterLevel,
              },
            });

            market.characterEntries.addAll([[newEntry.id, harden(newEntry)]]);

            const { seat: _omitSeat, recorderKit, ...entry } = newEntry;
            recorderKit.recorder.write(entry);
            marketFacet.updateMetrics('character', { putForSaleCount: true });

            marketFacet.handleExitCharacter(newEntry);
          };

          return zcf.makeInvitation(
            handler,
            'Sell Character in KREAd marketplace',
            undefined,
            M.splitRecord({
              give: {
                Character: M.splitRecord(characterShape),
              },
              want: {
                Price: M.splitRecord({
                  brand: BrandShape,
                  value: M.nat(),
                }),
              },
            }),
          );
        },
        buyItem() {
          const handler = async (buyerSeat, offerArgs) => {
            const { market: marketFacet } = this.facets;
            const { market } = this.state;

            // Find store record based on wanted character
            const sellRecord = market.itemEntries.get(offerArgs.entryId);
            sellRecord ||
              assert.fail(X`${errors.itemNotFound(offerArgs.entryId)}`);

            /** @type {HelperFunctionReturn} */
            let result;
            if (sellRecord.isFirstSale) {
              result = await marketFacet.buyFirstSaleItem(
                sellRecord.seat,
                buyerSeat,
                sellRecord,
              );
            } else {
              result = await marketFacet.buySecondarySaleItem(
                sellRecord.seat,
                buyerSeat,
                sellRecord,
              );
            }
            result.success || assert.fail(X`${result.error}`);
          };

          return zcf.makeInvitation(
            handler,
            'Buy Item in KREAd marketplace',
            undefined,
            M.splitRecord({
              give: {
                Price: M.splitRecord({
                  brand: BrandShape,
                  value: M.nat(),
                }),
              },
              want: {
                Item: M.splitRecord(itemShape),
              },
            }),
          );
        },
        /**
         *
         * @param {ZCFSeat} sellerSeat
         * @param {ZCFSeat} buyerSeat
         * @param {ItemMarketRecord} sellRecord
         * @returns {Promise<HelperFunctionReturn>}
         */
        async buyFirstSaleItem(sellerSeat, buyerSeat, sellRecord) {
          const { market: marketFacet } = this.facets;
          const { market } = this.state;

          const { want, give } = buyerSeat.getProposal();
          const { Item: wantedItemAmount } = want;

          const itemForSaleAmount = harden({
            brand: itemBrand,
            value: makeCopyBag([[sellRecord.asset, 1n]]),
          });
          const itemForSalePrice = sellRecord.askingPrice;
          // Inspect Price keyword from buyer seat
          const { Price: providedMoneyAmount } = give;

          if (
            !AmountMath.isEqual(wantedItemAmount, itemForSaleAmount, itemBrand)
          ) {
            return {
              success: false,
              error: errors.sellerSeatMismatch,
            };
          }

          if (
            !AmountMath.isGTE(
              providedMoneyAmount,
              AmountMath.add(
                AmountMath.add(sellRecord.askingPrice, sellRecord.royalty),
                sellRecord.platformFee,
              ),
              paymentBrand,
            )
          ) {
            return {
              success: false,
              error: errors.insufficientFunds,
            };
          }

          const { zcfSeat, userSeat } = zcf.makeEmptySeatKit();

          /** @type {TransferPart[]} */
          const transfers = [];
          // Transfer item: seller -> buyer
          transfers.push([sellerSeat, buyerSeat, { Item: itemForSaleAmount }]);
          // Transfer artist royalty: buyer -> artist
          transfers.push([
            buyerSeat,
            zcfSeat,
            { Price: sellRecord.royalty },
            { Royalty: sellRecord.royalty },
          ]);
          // Transfer KREAd fees: buyer -> KREAd
          transfers.push([
            buyerSeat,
            zcfSeat,
            { Price: sellRecord.platformFee },
            { PlatformFee: sellRecord.platformFee },
          ]);

          // Transfer askingPrice: buyer -> artist
          transfers.push([
            buyerSeat,
            zcfSeat,
            {
              Price: AmountMath.subtract(
                providedMoneyAmount,
                AmountMath.add(sellRecord.royalty, sellRecord.platformFee),
              ),
            },
          ]);

          try {
            atomicRearrange(zcf, harden(transfers));
          } catch (e) {
            assert.fail(X`${errors.rearrangeError}`);
          }
          buyerSeat.exit();
          zcfSeat.exit();

          const payouts = await E(userSeat).getPayouts();
          const royaltyPayout = await payouts.Royalty;
          const platformFeePayout = await payouts.PlatformFee;

          await E(royaltyDepositFacet).receive(royaltyPayout);
          await E(platformFeeDepositFacet).receive(platformFeePayout);

          const askingPricePayout = await payouts.Price;
          await E(royaltyDepositFacet).receive(askingPricePayout);

          // Remove entry from market
          marketFacet.updateMetrics('item', {
            marketplaceAverageLevel: {
              type: 'remove',
              value: sellRecord.asset.level,
            },
          });

          market.itemEntries.delete(sellRecord.id);
          void marketFacet.deleteNode(
            sellRecord.recorderKit.recorder.getStorageNode(),
          );

          // update metrics
          marketFacet.updateMetrics('item', {
            amountSold: true,
            latestSalePrice: Number(itemForSalePrice.value),
          });
          return {
            success: true,
            error: '',
          };
        },
        /**
         *
         * @param {ZCFSeat} sellerSeat
         * @param {ZCFSeat} buyerSeat
         * @param {ItemMarketRecord} sellRecord
         * @returns {Promise<HelperFunctionReturn>}
         */
        async buySecondarySaleItem(sellerSeat, buyerSeat, sellRecord) {
          const { market: marketFacet } = this.facets;

          const { want, give } = buyerSeat.getProposal();
          const { Item: wantedItemAmount } = want;

          const itemForSaleAmount = sellerSeat.getProposal().give.Item;
          const itemForSalePrice = sellerSeat.getProposal().want.Price;

          // Inspect Price keyword from buyer seat
          const { Price: providedMoneyAmount } = give;

          if (
            !AmountMath.isEqual(wantedItemAmount, itemForSaleAmount, itemBrand)
          ) {
            return {
              success: false,
              error: errors.sellerSeatMismatch,
            };
          }

          if (
            !AmountMath.isGTE(
              providedMoneyAmount,
              AmountMath.add(
                AmountMath.add(sellRecord.askingPrice, sellRecord.royalty),
                sellRecord.platformFee,
              ),
              paymentBrand,
            )
          ) {
            return {
              success: false,
              error: errors.insufficientFunds,
            };
          }

          const { zcfSeat, userSeat } = zcf.makeEmptySeatKit();

          /** @type {TransferPart[]} */
          const transfers = [];
          // Transfer item: seller -> buyer
          transfers.push([sellerSeat, buyerSeat, { Item: itemForSaleAmount }]);
          // Transfer artist royalty: buyer -> artist
          transfers.push([
            buyerSeat,
            zcfSeat,
            { Price: sellRecord.royalty },
            { Royalty: sellRecord.royalty },
          ]);
          // Transfer KREAd fees: buyer -> KREAd
          transfers.push([
            buyerSeat,
            zcfSeat,
            { Price: sellRecord.platformFee },
            { PlatformFee: sellRecord.platformFee },
          ]);

          // Transfer askingPrice: buyer -> seller
          transfers.push([
            buyerSeat,
            sellerSeat,
            {
              Price: AmountMath.subtract(
                providedMoneyAmount,
                AmountMath.add(sellRecord.royalty, sellRecord.platformFee),
              ),
            },
          ]);

          try {
            atomicRearrange(zcf, harden(transfers));
          } catch (e) {
            assert.fail(X`${errors.rearrangeError}`);
          }

          buyerSeat.exit();
          sellerSeat.exit();
          zcfSeat.exit();

          const payouts = await E(userSeat).getPayouts();
          const royaltyPayout = await payouts.Royalty;
          const platformFeePayout = await payouts.PlatformFee;

          await E(royaltyDepositFacet).receive(royaltyPayout);
          await E(platformFeeDepositFacet).receive(platformFeePayout);

          // update metrics
          marketFacet.updateMetrics('item', {
            amountSold: true,
            latestSalePrice: Number(itemForSalePrice.value),
          });
          return {
            success: true,
            error: '',
          };
        },
        buyCharacter() {
          const handler = async (buyerSeat) => {
            const { market: marketFacet } = this.facets;
            const { market, character: characterState } = this.state;

            // Inspect Character keyword in buyer seat
            const { want, give } = buyerSeat.getProposal();
            const { Character: wantedCharacterAmount } = want;
            const character = wantedCharacterAmount.value.payload[0][0];

            // Find characterRecord entry based on wanted character
            const characterRecord = characterState.entries.get(character.name);
            characterRecord || assert.fail(X`${errors.character404}`);

            // Find store record based on wanted character
            const sellRecord = market.characterEntries.get(character.name);

            sellRecord || assert.fail(X`${errors.character404}`);
            const sellerSeat = sellRecord.seat;

            // Inspect Price keyword from buyer seat
            const { Price: providedMoneyAmount } = give;
            const { Character: characterForSaleAmount } =
              sellerSeat.getProposal().give;

            AmountMath.isEqual(
              wantedCharacterAmount,
              characterForSaleAmount,
              characterBrand,
            ) || assert.fail(X`${errors.sellerSeatMismatch}`);

            const characterForSalePrice = sellRecord.askingPrice;

            AmountMath.isGTE(
              providedMoneyAmount,
              AmountMath.add(
                AmountMath.add(sellRecord.askingPrice, sellRecord.royalty),
                sellRecord.platformFee,
              ),
              paymentBrand,
            ) || assert.fail(X`${errors.insufficientFunds}`);
            const { zcfSeat, userSeat } = zcf.makeEmptySeatKit();

            /** @type {TransferPart[]} */
            const transfers = [];
            transfers.push([
              sellerSeat,
              buyerSeat,
              { Character: characterForSaleAmount },
            ]);
            transfers.push([
              buyerSeat,
              zcfSeat,
              { Price: sellRecord.royalty },
              { Royalty: sellRecord.royalty },
            ]);
            transfers.push([
              buyerSeat,
              zcfSeat,
              { Price: sellRecord.platformFee },
              { PlatformFee: sellRecord.platformFee },
            ]);
            transfers.push([
              buyerSeat,
              sellerSeat,
              {
                Price: AmountMath.subtract(
                  providedMoneyAmount,
                  AmountMath.add(sellRecord.royalty, sellRecord.platformFee),
                ),
              },
            ]);

            try {
              atomicRearrange(zcf, harden(transfers));
            } catch (e) {
              assert.fail(X`${errors.rearrangeError}`);
            }
            zcfSeat.exit();

            const payouts = await E(userSeat).getPayouts();
            const royaltyPayout = await payouts.Royalty;
            const platformFeePayout = await payouts.PlatformFee;

            await E(royaltyDepositFacet).receive(royaltyPayout);
            await E(platformFeeDepositFacet).receive(platformFeePayout);

            // update metrics
            marketFacet.updateMetrics('character', {
              amountSold: true,
              latestSalePrice: Number(characterForSalePrice.value),
            });

            buyerSeat.exit();
            sellerSeat.exit();
          };

          return zcf.makeInvitation(
            handler,
            'Buy Character in KREAd marketplace',
            undefined,
            M.splitRecord({
              give: {
                Price: M.splitRecord({
                  brand: BrandShape,
                  value: M.nat(),
                }),
              },
              want: {
                Character: M.splitRecord(characterShape),
              },
            }),
          );
        },
      },
      creator: {
        makeMintItemInvitation() {
          const { item } = this.facets;
          return item.mint();
        },
        initializeMetrics() {
          const { market } = this.state;
          if (market.metrics.getSize() > 0) return;

          market.metrics.addAll(
            ['character', 'item'].map((key) => [
              key,
              harden({
                collectionSize: 0,
                averageLevel: 0,
                marketplaceAverageLevel: 0,
                amountSold: 0,
                latestSalePrice: 0,
                putForSaleCount: 0,
              }),
            ]),
          );

          marketCharacterMetricsKit.recorder.write(
            market.metrics.get('character'),
          );
          marketItemMetricsKit.recorder.write(market.metrics.get('item'));
        },
        reviveMarketExitSubscribers() {
          const { market } = this.state;
          const { market: marketFacet } = this.facets;

          const characters = Array.from(market.characterEntries.values());
          characters.forEach((entry) => marketFacet.handleExitCharacter(entry));

          const items = Array.from(market.itemEntries.values());
          items.forEach((entry) => marketFacet.handleExitItem(entry));
        },
        initializeBaseAssets(baseCharacters, baseItems) {
          const { character, item } = this.facets;
          character.initializeBaseCharacters(baseCharacters);
          item.initializeBaseItems(baseItems);
        },
        initializeCharacterNamesEntries() {
          const { character } = this.state;
          if (!character.entries.has('names')) {
            character.entries.init('names', harden([]));
          }
        },
        makePublishItemCollectionInvitation() {
          const { market } = this.facets;
          return market.publishItemCollection();
        },
      },
      public: {
        makeMintCharacterInvitation() {
          const { character } = this.facets;
          return character.mint();
        },
        getCharacters() {
          const characters = Array.from(
            this.state.character.entries.values(),
          ).filter((x) => !Array.isArray(x));
          return characters;
        },
        getCharacterInventory(name) {
          const character = this.state.character.entries.get(name);
          const { inventory } = character;
          const items = inventory.getAmountAllocated('Item', itemBrand).value
            .payload;
          return { items };
        },
        makeEquipInvitation() {
          const { character } = this.facets;
          return character.equip();
        },
        makeUnequipInvitation() {
          const { character } = this.facets;
          return character.unequip();
        },
        makeItemSwapInvitation() {
          const { character } = this.facets;
          return character.swap();
        },
        makeUnequipAllInvitation() {
          const { character } = this.facets;
          return character.unequipAll();
        },
        makeSellCharacterInvitation() {
          const { market } = this.facets;
          return market.sellCharacter();
        },
        makeBuyCharacterInvitation() {
          const { market } = this.facets;
          return market.buyCharacter();
        },
        getCharactersForSale() {
          const characters = Array.from(
            this.state.market.characterEntries.values(),
          );
          return characters;
        },
        makeSellItemInvitation() {
          const { market } = this.facets;
          return market.sellItem();
        },
        makeBuyItemInvitation() {
          const { market } = this.facets;
          return market.buyItem();
        },
        getItemsForSale() {
          const items = Array.from(this.state.market.itemEntries.values());
          return items;
        },
        getMarketMetrics() {
          const { market } = this.state;
          return {
            character: market.metrics.get('character'),
            item: market.metrics.get('item'),
          };
        },
        getCharacterLevel(name) {
          const { character } = this.facets;
          return character.calculateLevel(name);
        },
      },
    },
  );
  const facets = makeKreadKitInternal();
  return harden({ public: facets.public, creator: facets.creator });
};

harden(prepareKreadKit);
