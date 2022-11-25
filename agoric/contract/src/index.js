/* eslint-disable no-undef */
// @ts-check
import '@agoric/zoe/exported';
import { AssetKind, AmountMath } from '@agoric/ertp';
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js';
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';

import { errors } from './errors';
import { mulberry32 } from './prng';
import { messages } from './messages';
import * as state from './get';
import { getPage, makeCharacterNftObjs } from './utils';

/**
 * This contract handles the mint of KREAd characters,
 * along with its corresponding item inventories and keys.
 * It also allows for equiping and unequiping items to
 * and from the inventory, using a token as access
 *
 * @type {ContractStartFn}
 */
const start = async (zcf) => {
  // Define Assets
  const assetMints = await Promise.all([
    zcf.makeZCFMint('KREA', AssetKind.SET),
    zcf.makeZCFMint('KREAITEM', AssetKind.SET),
  ]);

  const [
    { issuer: characterIssuer, brand: characterBrand },
    { issuer: itemIssuer, brand: itemBrand },
  ] = assetMints.map((mint) => mint.getIssuerRecord());

  const [characterMint, itemMint] = assetMints;

  let PRNG; // Pseudo random number generator (mulberry32)

  /**
   * Contract STATE
   *
   * @type {State}
   */
  const STATE = {
    config: undefined, // Holds list of base characters and default items
    characters: [], // Holds each character's inventory + copy of its data
    charactersMarket: [],
    items: [],
    itemsMarket: [],
    itemCount: 0n,
    characterCount: 0n,
    token: {
      character: {
        brand: characterBrand,
        issuer: characterIssuer,
      },
      item: {
        brand: itemBrand,
        issuer: itemIssuer,
      },
    },
  };

  const characterHistory = {};
  const itemHistory = {};

  /**
   * Set contract configuration, required for most contract features,
   * base characters will be picked at random on new mint
   * default items will be minted along each character
   * seed is used to init the PRNG
   *
   * @param {{
   *   baseCharacters: any[],
   *   defaultItems: any[],
   *   seed: number
   *   moneyIssuer: Issuer
   *   moneyBrand: Brand
   *   sellAssetsInstallation: Installation
   *   chainTimerService: TimerService
   * }} config
   * @returns {string}
   */
  const initConfig = ({
    baseCharacters,
    defaultItems,
    seed,
    moneyIssuer,
    moneyBrand,
    sellAssetsInstallation,
    chainTimerService,
  }) => {
    STATE.config = {
      baseCharacters,
      defaultItems,
      completed: true,
      moneyIssuer,
      moneyBrand,
      sellAssetsInstallation,
      chainTimerService,
    };
    assert(!Number.isNaN(seed), X`${errors.seedInvalid}`);
    PRNG = mulberry32(seed);
    STATE.randomNumber = PRNG;
    return 'Setup completed';
  };

  /**
   * Mints Item NFTs via mintGains
   *
   * @param {ZCFSeat} seat
   */
  const mintItemNFT = async (seat) => {
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      want: { Item: null },
    });
    const { want } = seat.getProposal();

    // @ts-ignore
    const currentTime = await state.getCurrentTime(STATE);

    // @ts-ignore
    const items = want.Item.value.map((item) => {
      const id = STATE.itemCount;
      STATE.itemCount = 1n + STATE.itemCount;
      return { ...item, id, date: currentTime };
    });

    const newItemAmount = AmountMath.make(itemBrand, harden(items));
    itemMint.mintGains({ Asset: newItemAmount }, seat);

    seat.exit();

    // Add to history

    items.forEach((item) => {
      itemHistory[item.id.toString()] = [
        {
          type: 'mint',
          data: item,
          timestamp: currentTime,
        },
      ];
    });

    return messages.mintItemReturn;
  };

  /**
   * Mints a new character
   *
   * @param {ZCFSeat} seat
   */
  const mintCharacterNFT = async (seat) => {
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    // TODO add Give statement with Money
    assertProposalShape(seat, {
      want: {
        Asset: null,
      },
    });
    const { want } = seat.getProposal();
    const newCharacterName = want.Asset.value[0].name;
    assert(state.nameIsUnique(newCharacterName, STATE), X`${errors.nameTaken}`);

    const currentTime = await state.getCurrentTime(STATE);
    STATE.characterCount = 1n + STATE.characterCount;
    const [newCharacterAmount1, newCharacterAmount2] = makeCharacterNftObjs(
      newCharacterName,
      state.getRandomBaseCharacter(STATE),
      STATE.characterCount,
      currentTime,
    ).map((character) => AmountMath.make(characterBrand, harden([character])));

    const { zcfSeat: inventorySeat } = zcf.makeEmptySeatKit();

    // Mint character to user seat & inventorySeat
    characterMint.mintGains({ Asset: newCharacterAmount1 }, seat);
    characterMint.mintGains(
      { CharacterKey: newCharacterAmount2 },
      inventorySeat,
    );

    // Mint items to inventory seat
    // TODO: Replace Date by a valid time generator now it returns NaN
    const allDefaultItems = Object.values(STATE.config.defaultItems);
    const uniqueItems = allDefaultItems.map((item) => {
      const newItemWithId = {
        ...item,
        id: STATE.itemCount,
      };

      STATE.itemCount = 1n + STATE.itemCount;

      return newItemWithId;
    });

    const itemsAmount = AmountMath.make(itemBrand, harden(uniqueItems));
    itemMint.mintGains({ Item: itemsAmount }, inventorySeat);

    // Add to public STATE
    /**
     * @type {CharacterRecord}
     */
    const character = {
      name: newCharacterName,
      character: newCharacterAmount1.value[0],
      inventory: inventorySeat,
    };
    STATE.characters = [...STATE.characters, character];

    // Add to history
    characterHistory[character.name] = [
      {
        type: 'mint',
        data: character,
        timestamp: currentTime,
      },
    ];
    uniqueItems.forEach((item) => {
      itemHistory[item.id.toString()] = [
        {
          type: 'mint',
          data: item,
          timestamp: currentTime,
        },
      ];
    });

    seat.exit();

    return messages.mintCharacterReturn;
  };

  /**
   * This function has to be called after creating the sell offer
   *
   * @param {ItemInMarket} itemInMarket
   * @returns {Promise<ItemInMarket>}
   */
  const storeItemInMarket = async (itemInMarket) => {
    assert(itemInMarket, X`${errors.invalidArg}`);
    STATE.itemsMarket = [...STATE.itemsMarket, itemInMarket];

    // Add to history
    const currentHistory = itemHistory[itemInMarket.id];
    assert(currentHistory, X`No history found`);
    itemHistory[itemInMarket.id] = [
      ...currentHistory,
      {
        type: 'addToMarket',
        data: itemInMarket,
        timestamp: await state.getCurrentTime(STATE),
      },
    ];
    return itemInMarket;
  };

  /**
   * This function has to be called after completing the buy offer
   *
   * @param {bigint} itemId
   */
  const removeItemFromMarket = async (itemId) => {
    const itemRecord = STATE.itemsMarket.find((i) => i.id === itemId);
    assert(itemRecord, X`${errors.itemNotInMarket}`);
    // TODO: eventually use a more efficient data structure
    const newMarket = STATE.itemsMarket.reduce((market, item) => {
      if (itemId !== item.id) return [...market, item];
      return market;
    }, []);
    STATE.itemsMarket = newMarket;

    // Add to history
    const currentHistory = itemHistory[itemRecord.id];
    itemHistory[itemRecord.id] = [
      ...currentHistory,
      {
        type: 'removeFromMarket',
        data: itemRecord,
        timestamp: await state.getCurrentTime(STATE),
      },
    ];
  };

  /**
   * This function has to be called after completing the sell offer
   *
   * @param {CharacterInMarket} characterInMarket
   * @returns {Promise<CharacterInMarket>}
   */
  const storeCharacterInMarket = async (characterInMarket) => {
    assert(characterInMarket, X`${errors.invalidArg}`);

    STATE.charactersMarket = [...STATE.charactersMarket, characterInMarket];

    // Add to history
    const currentHistory = characterHistory[characterInMarket.character.name];
    characterHistory[characterInMarket.character.name] = [
      ...currentHistory,
      {
        type: 'addToMarket',
        data: characterInMarket,
        timestamp: await state.getCurrentTime(STATE),
      },
    ];
    return characterInMarket;
  };

  /**
   * This function has to be called after completing the buy offer
   *
   * @param {bigint} characterId
   */
  const removeCharacterFromMarket = async (characterId) => {
    const characterInMarket = STATE.charactersMarket.find(
      (c) => c.id === characterId,
    );
    assert(characterInMarket, X`${errors.characterNotInMarket}`);
    // TODO: eventually use a more efficient data structure
    const newMarket = STATE.charactersMarket.reduce((market, character) => {
      if (characterId !== character.id) return [...market, character];
      return market;
    }, []);
    STATE.charactersMarket = newMarket;

    // Add to history
    const currentHistory = characterHistory[characterInMarket.character.name];
    characterHistory[characterInMarket.character.name] = [
      ...currentHistory,
      {
        type: 'removeFromMarket',
        data: characterInMarket,
        timestamp: await state.getCurrentTime(STATE),
      },
    ];
  };

  /**
   * This function validates an inventory update
   *
   * @param {Item[]} inventory
   */
  const validateInventoryState = (inventory) => {
    const itemTypes = inventory.map((item) => item.category);
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
    // @ts-ignore
    validateInventoryState(inventorySeat.getStagedAllocation().Item.value);

    zcf.reallocate(seat, inventorySeat);

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

    zcf.reallocate(seat, inventorySeat);

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
    // @ts-ignore
    validateInventoryState(inventorySeat.getStagedAllocation().Item.value);

    zcf.reallocate(seat, inventorySeat);

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

  // Opportunity for more complex queries
  const getCharacters = () => {
    return harden({
      characters: STATE.characters,
    });
  };

  const getCharactersMarket = () => {
    return harden({
      characters: STATE.charactersMarket,
    });
  };

  const getItems = () => {
    return harden({
      items: STATE.items,
    });
  };

  const getItemsMarket = () => {
    return harden({
      items: STATE.itemsMarket,
    });
  };

  const creatorFacet = Far('Character store creator', {
    initConfig,
    getCharacterIssuer: () => characterIssuer,
    getItemIssuer: () => itemIssuer,
    getItemBrand: () => itemBrand,
    getCharacters,
    getConfig: () => STATE.config,
  });

  const publicFacet = Far('Chracter store public', {
    // config
    getConfig: () => STATE.config,
    // characters
    getCharacterBase: () => STATE.config?.baseCharacters[0],
    getCharacters,
    getCharactersRange: (range, page) => getPage(STATE.characters, range, page),
    getCharactersMarket,
    getCharactersMarketRange: (range, page) =>
      getPage(STATE.charactersMarket, range, page),
    getCharacterInventory: (name) => state.getCharacterInventory(name, STATE),
    getCharacterKey: (name) => state.getCharacterKey(name, STATE),
    getCharacterCount: () => STATE.characters.length,
    getCharacterIssuer: () => characterIssuer,
    getCharacterBrand: () => characterBrand,
    randomBaseCharacter: () => state.getRandomBaseCharacter(STATE),
    // TODO: improve name validation
    isValidName: state.nameIsUnique,
    // items
    getItems,
    getItemsMarket,
    getItemsMarketRange: (range, page) =>
      getPage(STATE.itemsMarket, range, page),
    getItemIssuer: () => itemIssuer,
    getItemBrand: () => itemBrand,
    randomItem: () => state.getRandomItem(STATE),

    // equip/unequip
    makeEquipInvitation: () => zcf.makeInvitation(equip, 'addToInventory'),
    makeUnequipInvitation: () =>
      zcf.makeInvitation(unequip, 'removeFromInventory'),
    makeUnequipAllInvitation: () =>
      zcf.makeInvitation(unequipAll, 'removeAllItemsFromInventory'),
    makeItemSwapInvitation: () =>
      zcf.makeInvitation(swapItems, 'itemInventorySwap'),

    // market
    storeItemInMarket,
    removeItemFromMarket,
    storeCharacterInMarket,
    removeCharacterFromMarket,

    // mint
    makeMintCharacterInvitation: () =>
      zcf.makeInvitation(mintCharacterNFT, 'mintCharacterNfts'),
    makeMintItemInvitation: () =>
      zcf.makeInvitation(mintItemNFT, 'mintItemNfts'),

    // activity
    getCharacterHistory: (characterId) => characterHistory[characterId],
    getItemHistory: (id) => itemHistory[id],
    getAllCharacterHistory: () => characterHistory.entries(),
    getAllItemHistory: () => itemHistory.entries(),
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
