/* eslint-disable no-undef */
// @ts-check
import '@agoric/zoe/exported';
import { updateCharacterMetrics, updateItemMetrics } from './market-metrics';
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
import { makeCopyBag } from '@agoric/store';
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
  KreadInfoGuard,
  CharacterRecorderGuard,
  ItemRecorderGuard,
  MarketRecorderGuard,
  MarketMetricsGuard,
  RarityGuard,
  BaseCharacterGuard,
} from './type-guards.js';
import { atomicRearrange } from '@agoric/zoe/src/contractSupport/index.js';
import { multiplyBy } from '@agoric/zoe/src/contractSupport/ratio';
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
 *   royaltyRate: Ratio,
 *   platformFeeRate: Ratio,
 *   royaltyDepositFacet: DepositFacet,
 *   platformFeeDepositFacet: DepositFacet,
 *   paymentBrand
 * }} privateArgs
 * @param {{
 *   characterIssuerRecord: IssuerRecord<"copyBag">
 *   characterMint: ZCFMint<"copyBag">
 *   itemIssuerRecord: IssuerRecord<"copyBag">
 *   itemMint: ZCFMint<"copyBag">
 *   clock: import('@agoric/time/src/types.js').Clock
 *   storageNode: StorageNode
 *   makeRecorderKit: import('@agoric/zoe/src/contractSupport/recorder.js').RecorderKit
 *   storageNodePaths: Object
 * }} powers
 * */
export const prepareKreadKit = async (
  baggage,
  zcf,
  {
    seed,
    royaltyRate,
    platformFeeRate,
    royaltyDepositFacet,
    platformFeeDepositFacet,
    paymentBrand,
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
  const { issuer: characterIssuer, brand: characterBrand } =
    characterIssuerRecord;
  const { issuer: itemIssuer, brand: itemBrand } = itemIssuerRecord;

  const {
    infoKit,
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
      info: KreadInfoGuard,
      characterKit: CharacterRecorderGuard,
      itemKit: ItemRecorderGuard,
      marketCharacterKit: M.arrayOf(MarketRecorderGuard),
      marketItemKit: M.arrayOf(MarketRecorderGuard),
      marketCharacterMetricsKit: MarketMetricsGuard,
      marketItemMetricsKit: MarketMetricsGuard,
    },
  );

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
            valueShape: CharacterRecorderGuard,
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
            valueShape: MarketRecorderGuard,
          }),
          itemEntries: makeScalarBigMapStore('itemMarket', {
            durable: true,
            keyShape: M.number(),
            valueShape: MarketRecorderGuard,
          }),
        }),
        characterCollectionSize: 0,
        characterAverageLevel: 0,
        characterMarketplaceAverageLevel: 0,
        characterAmountSold: 0,
        characterLatestSalePrice: 0,
        itemCollectionSize: 0,
        itemAverageLevel: 0,
        itemMarketplaceAverageLevel: 0,
        itemAmountSold: 0,
        itemLatestSalePrice: 0,
        itemsPutForSaleAmount: 0,
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
          var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
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
            .value.payload.map(([value, supply]) => {
              return value.level;
            });

          level = itemLevels.reduce((acc, value) => acc + value, level);
          return level;
        },
        validateInventoryState(inventoryState) {
          const itemTypes = inventoryState.map((item) => item.category);
          assert(
            itemTypes.length === new Set(itemTypes).size,
            X`${errors.duplicateCategoryInInventory}`,
          );
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
          const node = await E(storageNode).makeChildNode(`inventory-${path}`);
          return makeRecorderKit(node, M.arrayOf([ItemGuard, M.nat()]));
        },
        mint() {
          const handler = async (seat) => {
            const {
              helper,
              character: characterFacet,
              item,
              market: marketFacet,
            } = this.facets;

            const { character: characterState } = this.state;

            const { want } = seat.getProposal();

            const newCharacterName = want.Asset.value.payload[0][0].name;

            if (characterState.entries.has(newCharacterName)) {
              seat.clear();
              seat.fail();
              return harden({ message: errors.nameTaken(newCharacterName) });
            }

            if (characterState.bases.getSize() === 0) {
              seat.clear();
              seat.fail();
              return harden({ message: errors.allMinted });
            }

            const currentTime = await helper.getTimeStamp();
            const baseIndex = characterFacet.getRandomBaseIndex();
            const baseCharacter = characterState.bases.get(baseIndex);
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

            const { zcfSeat: inventorySeat } = zcf.makeEmptySeatKit();
            // Mint character to user seat & inventorySeat
            characterMint.mintGains({ Asset: newCharacterAmount1 }, seat);
            characterMint.mintGains(
              { CharacterKey: newCharacterAmount2 },
              inventorySeat,
            );

            // Deleting here to ensure the base character does not get deleted before everything is minted
            // Consideration: can this be a race condition when multiple people mint at the same time?
            // This becomes more likely the less bases there are
            characterState.bases.delete(baseIndex);

            await item.mintDefaultBatch(inventorySeat);

            const inventoryKit = await characterFacet.makeInventoryRecorderKit(
              newCharacterName,
            );

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

            characterKit.recorder.write(character);

            // TODO: consider refactoring what we put in the inventory node
            inventoryKit.recorder.write(
              inventorySeat.getAmountAllocated('Item').value.payload,
            );

            seat.exit();

            return text.mintCharacterReturn;
          };
          return zcf.makeInvitation(
            handler,
            'mintCharacterNfts',
            undefined,
            M.splitRecord({
              want: {
                Asset: makeCopyBagAmountShape(
                  characterBrand,
                  M.bagOf({ name: M.string() }),
                ),
              },
            }),
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
            assert(inventoryCharacterKey, X`${errors.noKeyInInventory}`);
            assert(
              AmountMath.isEqual(
                wantedCharacter,
                inventoryCharacterKey,
                characterBrand,
              ),
              X`${errors.inventoryKeyMismatch}`,
            );

            // Ensure inventory STATE will be valid before reallocation
            let inventory = inventorySeat
              .getCurrentAllocation()
              .Item.value.payload.map(([value, supply]) => value);
            if (providedItemAmount.value.payload[0])
              inventory = [
                ...inventory,
                providedItemAmount.value.payload[0][0],
              ];

            try {
              // @ts-ignore
              characterFacet.validateInventoryState(inventory);
            } catch (e) {
              inventorySeat.clear();
              seat.clear();
              seat.fail(e);
              return `${errors.duplicateCategoryInInventory}`;
            }

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
              inventorySeat.clear();
              seat.clear();
              seat.fail(e);
              return;
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
            assert(providedCharacterKey, X`${errors.invalidCharacterKey}`);

            // Get reference to the wanted items and key
            const { want } = seat.getProposal();
            const { Item: requestedItems, CharacterKey2: wantedCharacter } =
              want;

            const inventoryCharacterKey =
              inventorySeat.getAmountAllocated('CharacterKey');
            assert(inventoryCharacterKey, X`${errors.noKeyInInventory}`);

            // Ensure requested key and inventory key match
            assert(
              AmountMath.isEqual(
                wantedCharacter,
                inventoryCharacterKey,
                characterBrand,
              ),
              X`${errors.inventoryKeyMismatch}`,
            );

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
              inventorySeat.clear();
              seat.clear();
              seat.fail(e);
              return `Swap assets error: ${e}`;
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
            assert(providedCharacterKey, X`${errors.invalidCharacterKey}`);

            const { want } = seat.getProposal();
            const {
              CharacterKey2: wantedCharacterAmount,
              Item2: wantedItemsAmount,
            } = want;

            // Ensure requested key and inventory key match
            const inventoryCharacterKey =
              inventorySeat.getAmountAllocated('CharacterKey');
            assert(inventoryCharacterKey, X`${errors.noKeyInInventory}`);
            assert(
              AmountMath.isEqual(
                wantedCharacterAmount,
                inventoryCharacterKey,
                characterBrand,
              ),
              X`${errors.inventoryKeyMismatch}`,
            );

            // Ensure inventory STATE is valid before reallocation
            let inventory = inventorySeat
              .getCurrentAllocation()
              .Item.value.payload.map(([value, supply]) => value);

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

            try {
              // @ts-ignore
              characterFacet.validateInventoryState(inventory);
            } catch (e) {
              inventorySeat.clear();
              seat.clear();
              seat.fail(e);
              return errors.duplicateCategoryInInventory;
            }

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

            atomicRearrange(zcf, harden(transfers));

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
            assert(providedCharacterKey, X`${errors.invalidCharacterKey}`);

            // Get reference to the wanted item
            const { want } = seat.getProposal();
            const { CharacterKey2: wantedCharacter } = want;

            // Get Character Key from inventorySeat
            const inventoryCharacterKey =
              inventorySeat.getAmountAllocated('CharacterKey');
            assert(inventoryCharacterKey, X`${errors.noKeyInInventory}`);

            const items = inventorySeat.getAmountAllocated('Item', itemBrand);
            assert(
              AmountMath.isEqual(
                wantedCharacter,
                inventoryCharacterKey,
                characterBrand,
              ),
              X`${errors.inventoryKeyMismatch}`,
            );

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

            atomicRearrange(zcf, harden(transfers));
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
          const uncommon = [];
          const rare = [];
          const legendary = [];
          const exotic = [];
          baseItems.forEach((item) => {
            if (item.rarity > 79) exotic.push(item);
            else if (item.rarity > 59) legendary.push(item);
            else if (item.rarity > 39) rare.push(item);
            else if (item.rarity > 19) uncommon.push(item);
            else common.push(item);
          });

          itemState.bases.addAll([
            ['common', harden(common)],
            ['uncommon', harden(uncommon)],
            ['rare', harden(rare)],
            ['legendary', harden(legendary)],
            ['exotic', harden(exotic)],
          ]);
        },
        // Mints the default set of items to a seat that doesn't exit
        // FIXME: change how this works with copy bag
        // define a limit of items to be able to be minted so we can generat a supply
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

          const legendaryBases = itemState.bases
            .get('legendary')
            .filter(
              (item) =>
                item.category !== item1.category &&
                item.category !== item2.category,
            );

          const index3 = Math.floor(
            helper.randomNumber() * legendaryBases.length,
          );
          const item3 = legendaryBases[index3];

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
            const [itemObject, itemSupply] = copyBagEntry;

            for (let n = 0; n < itemSupply; n++) {
              const item = {
                id,
                item: itemObject,
                history: [
                  {
                    type: 'mint',
                    data: itemObject,
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
      // TODO: figure out a way to handle the sell and buy more agnostic from the type of the amount
      market: {
        handleExitCharacter(entry) {
          const { market } = this.state;
          const { market: marketFacet, character: characterFacet } =
            this.facets;

          const { seat, object } = entry;
          const characterLevel = characterFacet.calculateLevel(object.name);

          const subscriber = E(seat).getSubscriber();
          E.when(E(subscriber).getUpdateSince(), () => {
            marketFacet.updateMetrics('character', {
              marketplaceAverageLevel: {
                type: 'remove',
                value: characterLevel,
              },
            });

            market.characterEntries.delete(object.name);

            marketCharacterKit.recorder.write(
              Array.from(market.characterEntries.values()),
            );
          });
        },
        handleExitItem(entry) {
          const { market } = this.state;
          const { market: marketFacet } = this.facets;

          const { seat, object, id } = entry;

          const subscriber = E(seat).getSubscriber();
          E.when(E(subscriber).getUpdateSince(), () => {
            marketFacet.updateMetrics('item', {
              marketplaceAverageLevel: {
                type: 'remove',
                value: object.level,
              },
            });

            market.itemEntries.delete(id);

            marketItemKit.recorder.write(
              Array.from(market.itemEntries.values()),
            );
          });
        },
        updateMetrics(collection, updateMetrics) {
          if (collection === 'character') {
            updateCharacterMetrics(
              this.state,
              updateMetrics,
              marketCharacterMetricsKit,
            );
          } else if (collection === 'item') {
            updateItemMetrics(this.state, updateMetrics, marketItemMetricsKit);
          }
        },
        sellItem() {
          const handler = (seat) => {
            const { market } = this.state;
            const { market: marketFacet } = this.facets;

            // Inspect allocation of Character keyword in seller seat
            const objectInSellSeat = seat.getAmountAllocated('Item');
            const { want } = seat.getProposal();

            assert(
              paymentBrand === want.Price.brand,
              X`${errors.incorrectPaymentBrand(paymentBrand)}`,
            );
            const askingPrice = {
              brand: want.Price.brand,
              value: want.Price.value,
            };
            const royalty = multiplyBy(want.Price, royaltyRate);
            const platformFee = multiplyBy(want.Price, platformFeeRate);

            const object = objectInSellSeat.value.payload[0][0];

            // Add to store array
            const newEntry = {
              seat,
              askingPrice,
              royalty,
              platformFee,
              id: this.state.itemsPutForSaleAmount,
              object,
              isFirstSale: false,
            };

            // update metrics
            marketFacet.updateMetrics('item', {
              marketplaceAverageLevel: {
                type: 'add',
                value: object.level,
              },
            });

            market.itemEntries.addAll([[newEntry.id, harden(newEntry)]]);

            marketItemKit.recorder.write(
              Array.from(market.itemEntries.values()),
            );

            marketFacet.handleExitItem(newEntry);
            this.state.itemsPutForSaleAmount++;
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
            const royalty = multiplyBy(want.Price, royaltyRate);
            const platformFee = multiplyBy(want.Price, platformFeeRate);

            itemsToSell.forEach((copyBagEntry) => {
              const [itemObject, itemSupply] = copyBagEntry;

              for (let n = 0; n < itemSupply; n++) {
                // Add to store array
                const newEntry = {
                  seat: internalSellSeat,
                  askingPrice,
                  royalty,
                  platformFee,
                  id: this.state.itemsPutForSaleAmount,
                  object: itemObject,
                  isFirstSale: true,
                };

                // update metrics
                marketFacet.updateMetrics('item', {
                  marketplaceAverageLevel: {
                    type: 'add',
                    value: itemObject.level,
                  },
                });

                market.itemEntries.addAll([[newEntry.id, harden(newEntry)]]);

                marketItemKit.recorder.write(
                  Array.from(market.itemEntries.values()),
                );

                this.state.itemsPutForSaleAmount++;
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
          const handler = (seat) => {
            const { market } = this.state;
            const { character: characterFacet, market: marketFacet } =
              this.facets;

            // Inspect allocation of Character keyword in seller seat
            const objectInSellSeat = seat.getAmountAllocated('Character');
            const { want } = seat.getProposal();

            assert(
              paymentBrand === want.Price.brand,
              X`${errors.incorrectPaymentBrand(paymentBrand)}`,
            );
            const askingPrice = {
              brand: want.Price.brand,
              value: want.Price.value,
            };
            const royalty = multiplyBy(want.Price, royaltyRate);
            const platformFee = multiplyBy(want.Price, platformFeeRate);

            const object = objectInSellSeat.value.payload[0][0];

            // Add to store array
            const newEntry = {
              seat,
              askingPrice,
              royalty,
              platformFee,
              id: object.name,
              object,
              isFirstSale: false,
            };

            // update metrics
            const characterLevel = characterFacet.calculateLevel(object.name);
            marketFacet.updateMetrics('character', {
              marketplaceAverageLevel: {
                type: 'add',
                value: characterLevel,
              },
            });

            market.characterEntries.addAll([[newEntry.id, harden(newEntry)]]);

            marketCharacterKit.recorder.write(
              Array.from(market.characterEntries.values()),
            );

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
            assert(sellRecord, X`${errors.itemNotFound(offerArgs.entryId)}`);

            if (sellRecord.isFirstSale) {
              marketFacet.buyFirstSaleItem(sellRecord.seat, buyerSeat, sellRecord);
            } else {
              marketFacet.buySecondarySaleItem(sellRecord.seat, buyerSeat, sellRecord);
            }
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
        async buyFirstSaleItem(sellerSeat, buyerSeat, sellRecord) {
          const { market: marketFacet } = this.facets;
          const { market } = this.state;

          const { want, give } = buyerSeat.getProposal();
          const { Item: wantedItemAmount } = want;

          const itemForSaleAmount = harden({
            brand: itemBrand,
            value: makeCopyBag([[sellRecord.object, 1n]]),
          });
          const itemForSalePrice = sellRecord.askingPrice;
          // Inspect Price keyword from buyer seat
          const { Price: providedMoneyAmount } = give;
          assert(
            AmountMath.isEqual(
              wantedItemAmount,
              itemForSaleAmount,
              itemBrand,
            ),
            X`${errors.sellerSeatMismatch}`,
          );

          assert(
            AmountMath.isGTE(
              providedMoneyAmount,
              AmountMath.add(
                AmountMath.add(sellRecord.askingPrice, sellRecord.royalty),
                sellRecord.platformFee,
              ),
              paymentBrand,
            ),
            X`${errors.insufficientFunds}`,
          );

          const { zcfSeat, userSeat } = zcf.makeEmptySeatKit();

          /** @type {TransferPart[]} */
          const transfers = [];
          // Transfer item: seller -> buyer
          transfers.push([
            sellerSeat,
            buyerSeat,
            { Item: itemForSaleAmount },
          ]);
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

          atomicRearrange(zcf, harden(transfers));

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
              value: sellRecord.object.level,
            },
          });

          market.itemEntries.delete(sellRecord.id);

          marketItemKit.recorder.write(
            Array.from(market.itemEntries.values()),
          );

          // update metrics
          marketFacet.updateMetrics('item', {
            amountSold: true,
            latestSalePrice: Number(itemForSalePrice.value),
          });
        },
        async buySecondarySaleItem(sellerSeat, buyerSeat, sellRecord) {
          const { market: marketFacet } = this.facets;

          const { want, give } = buyerSeat.getProposal();
          const { Item: wantedItemAmount } = want;

          const itemForSaleAmount = sellerSeat.getProposal().give.Item;
          const itemForSalePrice = sellerSeat.getProposal().want.Price;

          // Inspect Price keyword from buyer seat
          const { Price: providedMoneyAmount } = give;
          assert(
            AmountMath.isEqual(
              wantedItemAmount,
              itemForSaleAmount,
              itemBrand,
            ),
            X`${errors.sellerSeatMismatch}`,
          );

          assert(
            AmountMath.isGTE(
              providedMoneyAmount,
              AmountMath.add(
                AmountMath.add(sellRecord.askingPrice, sellRecord.royalty),
                sellRecord.platformFee,
              ),
              paymentBrand,
            ),
            X`${errors.insufficientFunds}`,
          );

          const { zcfSeat, userSeat } = zcf.makeEmptySeatKit();

          /** @type {TransferPart[]} */
          const transfers = [];
          // Transfer item: seller -> buyer
          transfers.push([
            sellerSeat,
            buyerSeat,
            { Item: itemForSaleAmount },
          ]);
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

          atomicRearrange(zcf, harden(transfers));

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
            assert(characterRecord, X`${errors.character404}`);

            // Find store record based on wanted character
            const sellRecord = market.characterEntries.get(character.name);

            assert(sellRecord, X`${errors.character404}`);
            const sellerSeat = sellRecord.seat;

            // Inspect Price keyword from buyer seat
            const { Price: providedMoneyAmount } = give;
            const { Character: characterForSaleAmount } =
              sellerSeat.getProposal().give;
            assert(
              AmountMath.isEqual(
                wantedCharacterAmount,
                characterForSaleAmount,
                characterBrand,
              ),
              X`${errors.sellerSeatMismatch}`,
            );

            const characterForSalePrice = sellRecord.askingPrice;
            assert(
              AmountMath.isGTE(
                providedMoneyAmount,
                AmountMath.add(
                  AmountMath.add(sellRecord.askingPrice, sellRecord.royalty),
                  sellRecord.platformFee,
                ),
                paymentBrand,
              ),
              X`${errors.insufficientFunds}`,
            );
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

            atomicRearrange(zcf, harden(transfers));

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
        publishKreadInfo(
          instanceBoardId,
          characterBrandBoardId,
          characterIssuerBoardId,
          itemBrandBoardId,
          itemIssuerBoardId,
          tokenBrandBoardId,
          tokenIssuerBoardId,
        ) {
          infoKit.recorder.write({
            instanceBoardId,
            characterBrandBoardId,
            characterIssuerBoardId,
            itemBrandBoardId,
            itemIssuerBoardId,
            tokenBrandBoardId,
            tokenIssuerBoardId,
          });
        },
        makeMintItemInvitation() {
          const { item } = this.facets;
          return item.mint();
        },
        initializeMetrics() {
          marketCharacterMetricsKit.recorder.write({
            collectionSize: this.state.characterCollectionSize,
            averageLevel: this.state.characterAverageLevel,
            marketplaceAverageLevel:
              this.state.characterMarketplaceAverageLevel,
            amountSold: this.state.characterAmountSold,
          });
          marketItemMetricsKit.recorder.write({
            collectionSize: this.state.itemCollectionSize,
            averageLevel: this.state.itemAverageLevel,
            marketplaceAverageLevel: this.state.itemMarketplaceAverageLevel,
            amountSold: this.state.itemAmountSold,
          });
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
      },
      // Public is currently a wrapper around the other created facets and fetches from the state
      // Still to be defined what exactly comes into this
      public: {
        getTokenInfo() {
          return harden({
            character: {
              issuer: characterIssuer,
              brand: characterBrand,
            },
            item: {
              issuer: itemIssuer,
              brand: itemBrand,
            },
          });
        },
        makeMintCharacterInvitation() {
          const { character } = this.facets;
          return character.mint();
        },
        makeMintItemInvitation() {
          const { item } = this.facets;
          return item.mint();
        },
        getCharacters() {
          const characters = Array.from(this.state.character.entries.values());
          return characters;
        },
        getCharacterInventory(name) {
          const character = this.state.character.entries.get(name);
          const { inventory } = character;
          const items = inventory.getAmountAllocated('Item', itemBrand).value
            .payload;
          // @ts-ignore
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
        makePublishItemCollectionInvitation() {
          const { market } = this.facets;
          return market.publishItemCollection();
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
          return {
            character: {
              collectionSize: this.state.characterCollectionSize,
              averageLevel: this.state.characterAverageLevel,
              marketplaceAverageLevel:
                this.state.characterMarketplaceAverageLevel,
              amountSold: this.state.characterAmountSold,
              latestSalePrice: this.state.characterLatestSalePrice,
            },
            item: {
              collectionSize: this.state.itemCollectionSize,
              averageLevel: this.state.itemAverageLevel,
              marketplaceAverageLevel: this.state.itemMarketplaceAverageLevel,
              amountSold: this.state.itemAmountSold,
              latestSalePrice: this.state.itemLatestSalePrice,
            },
          };
        },
        getCharacterLevel(name) {
          const { character } = this.facets;
          return character.calculateLevel(name);
        },
      },
    },
  );

  return harden(makeKreadKitInternal());
};

harden(prepareKreadKit);
