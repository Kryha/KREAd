/* eslint-disable no-undef */
// @ts-check
import { assert, details as X } from '@agoric/assert';
import { AmountMath } from '@agoric/ertp';
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js';
import { errors } from './errors';
import * as state from './get';

/**
 * Inventory methods
 *
 * @param {ZCF} zcf
 * @param {State} STATE
 */
export const inventory = (zcf, STATE) => {
  const {
    assets: {
      character: { brand: characterBrand },
      item: { brand: itemBrand },
    },
  } = STATE;

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
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      give: {
        Item: null,
        CharacterKey1: null,
      },
      want: {
        CharacterKey2: null,
      },
    });

    // Retrieve Items and Inventory key from user seat
    const providedItemAmount = seat.getAmountAllocated('Item');
    const providedCharacterKeyAmount = seat.getAmountAllocated('CharacterKey1');
    const providedCharacterKey = providedCharacterKeyAmount.value[0];
    const characterName = providedCharacterKey.name;

    // Find characterRecord entry based on provided key
    const characterRecord = state.getCharacterRecord(characterName, STATE);
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

    // Widthdraw Item and Key from user seat
    seat.decrementBy({ Item: providedItemAmount });
    seat.decrementBy({ CharacterKey1: providedCharacterKeyAmount });

    // Deposit Item and Key to inventory seat
    inventorySeat.incrementBy({ Item: providedItemAmount });
    inventorySeat.incrementBy({ CharacterKey: providedCharacterKeyAmount });

    // Widthdraw Key from character seat and Deposit into user seat
    inventorySeat.decrementBy({ CharacterKey: inventoryCharacterKey });
    seat.incrementBy({ CharacterKey2: inventoryCharacterKey });

    // Ensure staged inventory STATE is valid before reallocation
    const updatedInventory = inventorySeat.getStagedAllocation().Item.value;
    // @ts-ignore
    validateInventoryState(updatedInventory);

    zcf.reallocate(seat, inventorySeat);

    const updater = state.getCharacterInventoryNotifier(characterName, STATE);
    updater.updateState(updatedInventory);

    seat.exit();
  };

  /**
   * Remove items from inventory
   *
   * @param {ZCFSeat} seat
   */
  const unequip = async (seat) => {
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      give: {
        CharacterKey1: null,
      },
      want: {
        Item: null,
        CharacterKey2: null,
      },
    });

    // Retrieve Character key from user seat
    const providedCharacterKeyAmount = seat.getAmountAllocated('CharacterKey1');
    const providedCharacterKey = providedCharacterKeyAmount.value[0];
    const characterName = providedCharacterKey.name;

    // Find character record entry based on provided key
    const characterRecord = state.getCharacterRecord(characterName, STATE);
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

    // Inventory Key Swap
    seat.decrementBy({ CharacterKey1: providedCharacterKeyAmount });
    seat.incrementBy({ CharacterKey2: wantedCharacter });
    inventorySeat.decrementBy({ CharacterKey: wantedCharacter });
    inventorySeat.incrementBy({ CharacterKey: providedCharacterKeyAmount });

    // Deposit item from inventory to user seat
    seat.incrementBy(inventorySeat.decrementBy({ Item: requestedItems }));

    // Ensure staged inventory STATE is valid before reallocation
    const updatedInventory = inventorySeat.getStagedAllocation().Item.value;
    // @ts-ignore
    validateInventoryState(updatedInventory);
    zcf.reallocate(seat, inventorySeat);

    const updater = state.getCharacterInventoryNotifier(characterName, STATE);
    updater.updateState(updatedInventory);

    seat.exit();
  };

  /**
   * Swap items from inventory,
   * will replace current items if category already equipped
   * no items will be returned if categoy was empty
   *
   * @param {ZCFSeat} seat
   */
  const swapItems = async (seat) => {
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      give: {
        Item1: null,
        CharacterKey1: null,
      },
      want: {
        Item2: null,
        CharacterKey2: null,
      },
    });

    // Retrieve Items and Inventory key from user seat
    const providedItemAmount = seat.getAmountAllocated('Item1');
    const providedCharacterKeyAmount = seat.getAmountAllocated('CharacterKey1');
    const providedCharacterKey = providedCharacterKeyAmount.value[0];
    // const providedItems = providedItemAmount.value;
    const characterName = providedCharacterKey.name;

    // Find character record entry based on provided key
    const characterRecord = state.getCharacterRecord(characterName, STATE);
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

    // Decrement amounts
    seat.decrementBy({ Item1: providedItemAmount });
    seat.decrementBy({ CharacterKey1: providedCharacterKeyAmount });
    inventorySeat.decrementBy({ Item: wantedItemsAmount });
    inventorySeat.decrementBy({ CharacterKey: wantedCharacterAmount });

    // Increment amounts
    seat.incrementBy({ CharacterKey2: wantedCharacterAmount });
    seat.incrementBy({ Item2: wantedItemsAmount });
    inventorySeat.incrementBy({ Item: providedItemAmount });
    inventorySeat.incrementBy({ CharacterKey: providedCharacterKeyAmount });

    // Ensure staged inventory STATE is valid before reallocation
    const updatedInventory = inventorySeat.getStagedAllocation().Item.value;

    // @ts-ignore
    validateInventoryState(updatedInventory);

    zcf.reallocate(seat, inventorySeat);

    const updater = state.getCharacterInventoryNotifier(characterName, STATE);
    updater.updateState(updatedInventory);

    seat.exit();
  };

  /**
   * Remove all items from inventory
   *
   * @param {ZCFSeat} seat
   */
  const unequipAll = async (seat) => {
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      give: {
        CharacterKey1: null,
      },
      want: {
        Item: null,
        CharacterKey2: null,
      },
    });

    // Retrieve Character key from user seat
    const providedCharacterKeyAmount = seat.getAmountAllocated('CharacterKey1');
    const providedCharacterKey = providedCharacterKeyAmount.value[0];
    const characterName = providedCharacterKey.name;

    // Find character record entry based on provided key
    const characterRecord = state.getCharacterRecord(characterName, STATE);
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

    // Swap Inventory Keys
    seat.decrementBy({ CharacterKey1: providedCharacterKeyAmount });
    seat.incrementBy({ CharacterKey2: wantedCharacter });
    inventorySeat.decrementBy({ CharacterKey: wantedCharacter });
    inventorySeat.incrementBy({ CharacterKey: providedCharacterKeyAmount });

    // Move items from inventory to user set
    seat.incrementBy(inventorySeat.decrementBy({ Item: items }));
    zcf.reallocate(seat, inventorySeat);
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
