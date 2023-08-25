/* eslint-disable no-undef */
// @ts-check
import { assert, details as X } from '@agoric/assert';
import { AmountMath } from '@agoric/ertp';
import { errors } from './errors.js';
import { text } from './text.js';

/**
 * Inventory methods
 *
 * @param {ZCF} zcf
 * @param {()=>KreadState} getState
 */
export const inventory = (zcf, getState) => {
  const state = getState();

  /**
   * This function validates an inventory update
   *
   * @param {Item[]} inventoryState
   */
  const validateInventoryState = (inventoryState) => {
    const itemTypes = inventoryState.map((item) => item.category);
    assert(
      itemTypes.length === new Set(itemTypes).size,
      X`${errors.duplicateCategoryInInventory}`,
    );
  };

  /**
   * Adds item to inventory
   *
   * @param {ZCFSeat} seat
   */
  const equip = async (seat) => {
    assert(state.get.isReady(), X`${errors.noConfig}`);
    const {
      character: { brand: characterBrand },
    } = state.get.assetInfo();

    // Retrieve Items and Inventory key from user seat
    const providedItemAmount = seat.getAmountAllocated('Item');
    const providedCharacterKeyAmount = seat.getAmountAllocated('CharacterKey1');
    const providedCharacterKey = providedCharacterKeyAmount.value.payload[0][0];
    const characterName = providedCharacterKey.name;

    // Find characterRecord entry based on provided key
    const characterRecord = state.get.character(characterName);
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
      inventory = [...inventory, providedItemAmount.value.payload[0][0]];

    try {
      // @ts-ignore
      validateInventoryState(inventory);
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

    characterRecord.publisher.publish(
      inventorySeat.getAmountAllocated('Item').value.payload,
    );

    seat.exit();

    return text.equipReturn;
  };

  /**
   * Remove items from inventory
   *
   * @param {ZCFSeat} seat
   */
  const unequip = async (seat) => {
    assert(state.get.isReady(), X`${errors.noConfig}`);
    const {
      character: { brand: characterBrand },
    } = state.get.assetInfo();

    // Retrieve Character key from user seat
    const providedCharacterKeyAmount = seat.getAmountAllocated('CharacterKey1');
    const providedCharacterKey = providedCharacterKeyAmount.value.payload[0][0];
    const characterName = providedCharacterKey.name;

    // Find character record entry based on provided key
    const characterRecord = state.get.character(characterName);
    const inventorySeat = characterRecord.inventory;
    assert(providedCharacterKey, X`${errors.invalidCharacterKey}`);

    // Get reference to the wanted items and key
    const { want } = seat.getProposal();
    const { Item: requestedItems, CharacterKey2: wantedCharacter } = want;

    assert(requestedItems, X`${errors.noItemsRequested}`);
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

    characterRecord.publisher.publish(
      inventorySeat.getAmountAllocated('Item').value.payload,
    );

    seat.exit();
    return text.unequipReturn;
  };

  /**
   * Swap items from inventory,
   * will replace current items if category already equipped
   * no items will be returned if categoy was empty
   *
   * @param {ZCFSeat} seat
   */
  const swapItems = async (seat) => {
    assert(state.get.isReady(), X`${errors.noConfig}`);
    const {
      character: { brand: characterBrand },
    } = state.get.assetInfo();

    // Retrieve Items and Inventory key from user seat
    const providedItemAmount = seat.getAmountAllocated('Item1');
    const providedCharacterKeyAmount = seat.getAmountAllocated('CharacterKey1');
    const providedCharacterKey = providedCharacterKeyAmount.value.payload[0][0];
    // const providedItems = providedItemAmount.value;
    const characterName = providedCharacterKey.name;

    // Find character record entry based on provided key
    const characterRecord = state.get.character(characterName);
    const inventorySeat = characterRecord.inventory;
    assert(providedCharacterKey, X`${errors.invalidCharacterKey}`);

    const { want } = seat.getProposal();
    const { CharacterKey2: wantedCharacterAmount, Item2: wantedItemsAmount } =
      want;

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
          item.category !== wantedItemsAmount.value.payload[0][0].category,
      );
    if (providedItemAmount.value.payload[0])
      inventory = [...inventory, providedItemAmount.value.payload[0][0]];

    try {
      // @ts-ignore
      validateInventoryState(inventory);
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

    characterRecord.publisher.publish(
      inventorySeat.getAmountAllocated('Item').value.payload,
    );

    seat.exit();
  };

  /**
   * Remove all items from inventory
   *
   * @param {ZCFSeat} seat
   */
  const unequipAll = async (seat) => {
    assert(state.get.isReady(), X`${errors.noConfig}`);
    const {
      character: { brand: characterBrand },
      item: { brand: itemBrand },
    } = state.get.assetInfo();

    // Retrieve Character key from user seat
    const providedCharacterKeyAmount = seat.getAmountAllocated('CharacterKey1');
    const providedCharacterKey = providedCharacterKeyAmount.value.payload[0][0];
    const characterName = providedCharacterKey.name;

    // Find character record entry based on provided key
    const characterRecord = state.get.character(characterName);
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

    characterRecord.publisher.publish(
      inventorySeat.getAmountAllocated('Item').value.payload,
    );

    seat.exit();
  };

  return {
    makeEquipInvitation: () => zcf.makeInvitation(equip, 'addToInventory'),
    makeUnequipInvitation: () =>
      zcf.makeInvitation(unequip, 'removeFromInventory'),
    makeUnequipAllInvitation: () =>
      zcf.makeInvitation(unequipAll, 'removeAllItemsFromInventory'),
    makeItemSwapInvitation: () =>
      zcf.makeInvitation(swapItems, 'itemInventorySwap'),
  };
};
