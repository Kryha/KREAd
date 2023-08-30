/* eslint-disable no-undef */
// @ts-check
import '@agoric/zoe/exported';

import { assert, details as X } from '@agoric/assert';
import { AmountMath, AmountShape, BrandShape } from '@agoric/ertp';
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
} from './type-guards.js';
/**
 * this provides the exoClassKit for our upgradable KREAd contract
 * Utilizes capabilities from the prepare function suchs as mints
 * timer service and values from the privateArgs
 *
 *
 * @param {import('@agoric/vat-data').Baggage} baggage
 * @param {ZCF} zcf
 * @param {{
 *   defaultCharacters: object[],
 *   defaultItems: object[],
 *   seed: number
 * }} privateArgs
 * @param {{
 *   characterIssuerRecord: IssuerRecord<"copyBag">
 *   characterMint: ZCFMint<"copyBag">
 *   itemIssuerRecord: IssuerRecord<"copyBag">
 *   itemMint: ZCFMint<"copyBag">
 *   paymentFTIssuerRecord: IssuerRecord<"nat">
 *   paymentFTMint: ZCFMint<"nat">
 *   chainTimerService: TimerService
 *   storageNode: StorageNode
 *   makeRecorderKit: import('@agoric/zoe/src/contractSupport/recorder.js').RecorderKit
 *   storageNodePaths: Object
 * }} powers
 * */
export const prepareKreadKit = async (
  baggage,
  zcf,
  { defaultCharacters, defaultItems, seed },
  {
    characterIssuerRecord,
    characterMint,
    itemIssuerRecord,
    itemMint,
    paymentFTIssuerRecord,
    paymentFTMint,
    chainTimerService,
    storageNode,
    makeRecorderKit,
    storageNodePaths,
  },
) => {
  const { issuer: characterIssuer, brand: characterBrand } =
    characterIssuerRecord;
  const { issuer: itemIssuer, brand: itemBrand } = itemIssuerRecord;
  const { issuer: paymentFTIssuer, brand: paymentFTBrand } =
    paymentFTIssuerRecord;

  const { infoKit, characterKit, itemKit, marketCharacterKit, marketItemKit } =
    await makeStorageNodeRecorderKits(
      storageNode,
      makeRecorderKit,
      storageNodePaths,
      {
        info: KreadInfoGuard,
        characterKit: CharacterRecorderGuard,
        itemKit: ItemRecorderGuard,
        marketCharacterKit: MarketRecorderGuard,
        marketItemKit: MarketRecorderGuard,
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
      return harden({
        character: {
          entries: makeScalarBigMapStore('characters', { durable: true }),
        },
        item: {
          entries: makeScalarBigMapStore('items', { durable: true }),
        },
        market: {
          characterEntries: makeScalarBigMapStore('characterMarket', {
            durable: true,
          }),
          itemEntries: makeScalarBigMapStore('itemMarket', { durable: true }),
        },
      });
    },
    {
      helper: {
        async getTimeStamp() {
          return E(chainTimerService).getCurrentTimestamp();
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
        getRandomBaseCharacter() {
          const { helper } = this.facets;
          const number = Math.floor(
            helper.randomNumber() * defaultCharacters.length,
          );
          return defaultCharacters[number];
        },
        async makeInventoryRecorderKit(path) {
          const node = await E(storageNode).makeChildNode(`inventory-${path}`);
          return makeRecorderKit(node, M.arrayOf([ItemGuard, M.nat()]));
        },
        mint() {
          const handler = async (seat) => {
            const { helper, character: characterFacet, item } = this.facets;
            const { character: characterState } = this.state;

            const { want } = seat.getProposal();

            const newCharacterName = want.Asset.value.payload[0][0].name;

            if (characterState.entries.has(newCharacterName)) {
              seat.clear();
              seat.fail();
              return harden({ message: errors.nameTaken(newCharacterName) });
            }

            const currentTime = await helper.getTimeStamp();
            const [newCharacterAmount1, newCharacterAmount2] =
              makeCharacterNftObjs(
                newCharacterName,
                characterFacet.getRandomBaseCharacter(),
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
              zcf.atomicRearrange(harden(transfers));
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
              zcf.atomicRearrange(harden(transfers));
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

            zcf.atomicRearrange(harden(transfers));

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

            zcf.atomicRearrange(harden(transfers));
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
        // Mints the default set of items to a seat that doesn't exit
        // FIXME: change how this works with copy bag
        // define a limit of items to be able to be minted so we can generat a supply
        async mintDefaultBatch(seat) {
          const { helper } = this.facets;
          const { item: itemState } = this.state;

          const allDefaultItems = Object.values(defaultItems);

          const currentTime = await helper.getTimeStamp();

          let id = itemState.entries.getSize();
          // @ts-ignore
          const items = allDefaultItems.map((item) => {
            id += 1;
            return { ...item, id, date: currentTime };
          });
          const newItemAmount = AmountMath.make(
            itemBrand,
            makeCopyBag(harden(items.map((item) => [item, 1n]))),
          );

          await itemMint.mintGains({ Item: newItemAmount }, seat);

          items.forEach((i) => {
            const item = {
              id: i.id,
              item: i,
              history: [
                {
                  type: 'mint',
                  data: i,
                  timestamp: currentTime,
                },
              ],
            };

            itemState.entries.addAll([[i.id, harden(item)]]);
            itemKit.recorder.write(item);
          });

          return text.mintItemReturn;
        },
        mint() {
          const handler = async (seat) => {
            const { helper } = this.facets;
            const { item: itemState } = this.state;

            const { want } = seat.getProposal();

            const currentTime = await helper.getTimeStamp();

            let id = itemState.entries.getSize();
            // @ts-ignore
            const items = want.Item.value.payload.map(([item, supply]) => {
              id += 1;
              return [{ ...item, id, date: currentTime }, supply];
            });
            const newItemAmount = AmountMath.make(
              itemBrand,
              makeCopyBag(harden(items)),
            );

            itemMint.mintGains({ Asset: newItemAmount }, seat);

            seat.exit();

            items.forEach((j) => {
              const i = j[0];
              const item = {
                id: i.id,
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

              itemState.entries.addAll([[i.id, harden(item)]]);
              itemKit.recorder.write(item);
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
        sellItem() {
          const handler = (seat) => {
            const { market } = this.state;

            // Inspect allocation of Character keyword in seller seat
            const objectInSellSeat = seat.getAmountAllocated('Item');
            const { want } = seat.getProposal();
            const askingPrice = {
              brand: want.Price.brand,
              value: want.Price.value,
            };
            const object = objectInSellSeat.value.payload[0][0];

            // Add to store array
            const newEntry = {
              seat,
              askingPrice,
              id: object.id,
              object,
            };

            market.itemEntries.addAll([[newEntry.id, harden(newEntry)]]);

            marketItemKit.recorder.write(
              Array.from(market.itemEntries.values()),
            );
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
        sellCharacter() {
          const handler = (seat) => {
            const { market } = this.state;

            // Inspect allocation of Character keyword in seller seat
            const objectInSellSeat = seat.getAmountAllocated('Character');
            const { want } = seat.getProposal();
            const askingPrice = {
              brand: want.Price.brand,
              value: want.Price.value,
            };
            const object = objectInSellSeat.value.payload[0][0];

            // Add to store array
            const newEntry = {
              seat,
              askingPrice,
              id: object.name,
              object,
            };

            market.characterEntries.addAll([[newEntry.id, harden(newEntry)]]);

            marketCharacterKit.recorder.write(
              Array.from(market.characterEntries.values()),
            );
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
          const handler = (buyerSeat) => {
            const { market } = this.state;

            // Inspect Character keyword in buyer seat
            const { want, give } = buyerSeat.getProposal();
            const { Item: wantedItemAmount } = want;
            const item = wantedItemAmount.value.payload[0][0];
            // Find store record based on wanted character
            const sellRecord = market.itemEntries.get(item.id);
            assert(sellRecord, X`${errors.itemNotFound(item.id)}`);
            const sellerSeat = sellRecord.seat;

            // Inspect Price keyword from buyer seat
            const { Price: providedMoneyAmount } = give;
            const { Item: itemForSaleAmount } = sellerSeat.getProposal().give;
            assert(
              AmountMath.isEqual(
                wantedItemAmount,
                itemForSaleAmount,
                itemBrand,
              ),
              X`${errors.sellerSeatMismatch}`,
            );

            const { Price: itemForSalePrice } = sellerSeat.getProposal().want;
            const paymentBrand = itemForSalePrice.brand;
            assert(
              AmountMath.isGTE(
                providedMoneyAmount,
                itemForSalePrice,
                paymentBrand,
              ),
              X`${errors.insufficientFunds}`,
            );

            /** @type {TransferPart[]} */
            const transfers = [];
            transfers.push([
              sellerSeat,
              buyerSeat,
              { Item: itemForSaleAmount },
            ]);
            transfers.push([
              buyerSeat,
              sellerSeat,
              { Price: providedMoneyAmount },
            ]);

            zcf.atomicRearrange(harden(transfers));

            buyerSeat.exit();
            sellerSeat.exit();
            market.itemEntries.delete(item.id);

            marketItemKit.recorder.write(
              Array.from(market.itemEntries.values()),
            );
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
        buyCharacter() {
          const handler = (buyerSeat) => {
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

            const { Price: characterForSalePrice } =
              sellerSeat.getProposal().want;
            const paymentBrand = characterForSalePrice.brand;
            assert(
              AmountMath.isGTE(
                providedMoneyAmount,
                characterForSalePrice,
                paymentBrand,
              ),
              X`${errors.insufficientFunds}`,
            );

            /** @type {TransferPart[]} */
            const transfers = [];
            transfers.push([
              sellerSeat,
              buyerSeat,
              { Character: characterForSaleAmount },
            ]);
            transfers.push([
              buyerSeat,
              sellerSeat,
              { Price: providedMoneyAmount },
            ]);

            zcf.atomicRearrange(harden(transfers));

            buyerSeat.exit();
            sellerSeat.exit();

            // Remove entry from store array
            market.characterEntries.delete(character.name);

            marketCharacterKit.recorder.write(
              Array.from(market.characterEntries.values()),
            );
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
        freeTokens() {
          const handler = (seat) => {
            const { want } = seat.getProposal();
            paymentFTMint.mintGains(want, seat);
            seat.exit();
            return text.tokenFacetReturn;
          };
          return zcf.makeInvitation(handler, 'get tokens');
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
          marketCharacterKit.recorder.write([]);
          marketItemKit.recorder.write([]);
        },
        makeMintItemInvitation() {
          const { item } = this.facets;
          return item.mint();
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
            payment: {
              issuer: paymentFTIssuer,
              brand: paymentFTBrand,
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
        makeBuyItemInvitation() {
          const { market } = this.facets;
          return market.buyItem();
        },
        getItemsForSale() {
          const items = Array.from(this.state.market.itemEntries.values());
          return items;
        },
        makeTokenFacetInvitation() {
          const { market } = this.facets;
          return market.freeTokens();
        },
      },
    },
  );

  return harden(makeKreadKitInternal());
};

harden(prepareKreadKit);
