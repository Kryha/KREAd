// @ts-check
import '@agoric/zoe/exported';
import { AssetKind, AmountMath } from '@agoric/ertp';
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js';
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';

import { errors } from './errors';
import { mulberry32 } from './prng';
import { messages } from './messages';

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
   * Contract state
   *
   * @type {State}
   */
  const state = {
    config: undefined, // Holds list of base characters and default items
    characterNames: [], // Holds a list of minted character names, used to check for uniqueness
    characters: [], // Holds each character's inventory + copy of its data
    charactersMarket: [],
    items: [],
    itemsMarket: [],
    itemCount: 0n,
    characterCount: 0n,
    chainTimerService: undefined,
  };

  /**
   * Private state
   *
   * @type {InventoryKeyStorage}
   */
  let privateState = [];

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
    state.config = {
      baseCharacters,
      defaultItems,
      completed: true,
      moneyIssuer,
      moneyBrand,
      sellAssetsInstallation,
      chainTimerService,
    };
    assert(!Number.isNaN(seed), X`Seed must be a number`);
    PRNG = mulberry32(seed);
    return 'Setup completed';
  };

  /**
   * TODO: establish a rarity system set by the creator of the character set
   * TODO: add character type in return
   */
  const getRandomBaseCharacter = () => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    const number = Math.floor(PRNG() * state.config.baseCharacters.length);
    return state.config.baseCharacters[number];
  };
  /**
   * TODO: establish a rarity system set by the creator of the character set
   */
  const getRandomItem = () => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    const number = Math.floor(PRNG() * state.config.defaultItems.length);
    return state.config.defaultItems[number];
  };

  /**
   * @param {string} name
   * @returns {boolean}
   */
  const nameIsUnique = (name) => {
    return !state.characterNames.includes(name);
  };

  /**
   * Gets the inventory of a given character
   *
   * @param {string} characterName
   * @returns {{items: Item[]}}
   */
  const getCharacterInventory = (characterName) => {
    const characterRecord = state.characters.find(
      ({ character }) => character.name === characterName,
    );
    assert(characterRecord, X`${errors.character404}`);
    const { inventory } = characterRecord;
    const items = inventory.getAmountAllocated('Item', itemBrand).value;
    // @ts-ignore
    return { items };
  };

  /**
   * Gets the characacter key of a given character
   *
   * @param {string} characterName
   * @returns {{ key: Amount}}
   */
  const getCharacterKey = (characterName) => {
    const characterRecord = state.characters.find(
      ({ character }) => character.name === characterName,
    );
    assert(characterRecord, X`${errors.character404}`);
    const { inventory } = characterRecord;
    const key = inventory.getAmountAllocated('CharacterKey', characterBrand);
    return { key };
  };

  /**
   * Mints Item NFTs via mintGains
   *
   * @param {ZCFSeat} seat
   */
  const mintItemNFT = (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      want: { Item: null },
    });
    const { want } = seat.getProposal();

    // @ts-ignore
    const items = want.Item.value.map((item) => {
      const id = state.itemCount;
      state.itemCount = 1n + state.itemCount;

      return { ...item, id };
    });

    const newItemAmount = AmountMath.make(itemBrand, harden(items));

    itemMint.mintGains({ Asset: newItemAmount }, seat);
    seat.exit();
    return messages.mintItemReturn;
  };

  /**
   * Mints a new character
   *
   * @param {ZCFSeat} seat
   */
  const mintCharacterNFT = (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    // TODO add Give statement with Money
    assertProposalShape(seat, {
      want: {
        Asset: null,
      },
    });
    const { want } = seat.getProposal();
    const newCharacterName = want.Asset.value[0].name;
    assert(nameIsUnique(newCharacterName), X`${errors.nameTaken}`);

    state.characterCount = 1n + state.characterCount;
    const newCharacterId = state.characterCount;
    const randomCharacterBase = getRandomBaseCharacter();

    // Merge random base character with name input, id, and keyId
    // TODO: Replace Date by a valid time generator now it returns NaN
    const newCharacter1 = {
      ...randomCharacterBase,
      date: state.config.chainTimerService?.getCurrentTimestamp(),
      id: newCharacterId,
      name: newCharacterName,
      keyId: 1,
    };
    const newCharacter2 = {
      ...randomCharacterBase,
      date: state.config.chainTimerService?.getCurrentTimestamp(),
      id: newCharacterId,
      name: newCharacterName,
      keyId: 2,
    };

    const newCharacterAmount1 = AmountMath.make(
      characterBrand,
      harden([newCharacter1]),
    );
    const newCharacterAmount2 = AmountMath.make(
      characterBrand,
      harden([newCharacter2]),
    );

    const { zcfSeat: inventorySeat } = zcf.makeEmptySeatKit();

    // Mint character to user seat & inventorySeat
    characterMint.mintGains({ Asset: newCharacterAmount1 }, seat);
    characterMint.mintGains(
      { CharacterKey: newCharacterAmount2 },
      inventorySeat,
    );

    // Mint items to inventory seat
    // TODO: Replace Date by a valid time generator now it returns NaN
    const allDefaultItems = Object.values(state.config.defaultItems);
    const uniqueItems = allDefaultItems.map((item) => {
      const newItemWithId = {
        ...item,
        id: state.itemCount,
      };

      state.itemCount = 1n + state.itemCount;

      return newItemWithId;
    });

    const itemsAmount = AmountMath.make(itemBrand, harden(uniqueItems));
    itemMint.mintGains({ Item: itemsAmount }, inventorySeat);

    // Add to public state
    /**
     * @type {CharacterRecord}
     */
    const character = {
      name: newCharacter1.name,
      character: newCharacter1,
      inventory: inventorySeat,
    };
    state.characters = [...state.characters, character];
    state.characterNames = [...state.characterNames, character.name];

    // TODO: make private state useful
    // Add to private state
    privateState = [
      ...privateState,
      {
        name: character.name,
        history: [
          {
            id: state.characterCount,
            add: uniqueItems.map((i) => i.title),
          },
        ],
      },
    ];

    seat.exit();

    return messages.mintCharacterReturn;
  };

  /**
   * This function has to be called after creating the sell offer
   *
   * @param {ItemInMarket} itemInMarket
   * @returns {ItemInMarket}
   */
  const storeItemInMarket = (itemInMarket) => {
    state.itemsMarket = [...state.itemsMarket, itemInMarket];

    return itemInMarket;
  };

  /**
   * This function has to be called after completing the buy offer
   *
   * @param {bigint} itemId
   */
  const removeItemFromMarket = (itemId) => {
    // TODO: eventually use a more efficient data structure
    const newMarket = state.itemsMarket.reduce((market, item) => {
      if (itemId !== item.id) return [...market, item];
      return market;
    }, []);
    state.itemsMarket = newMarket;
  };

  /**
   * This function has to be called after completing the sell offer
   *
   * @param {CharacterInMarket} characterInMarket
   * @returns {CharacterInMarket}
   */
  const storeCharacterInMarket = (characterInMarket) => {
    state.charactersMarket = [...state.charactersMarket, characterInMarket];

    return characterInMarket;
  };

  /**
   * This function has to be called after completing the buy offer
   *
   * @param {bigint} characterId
   */
  const removeCharacterFromMarket = (characterId) => {
    // TODO: eventually use a more efficient data structure
    const newMarket = state.charactersMarket.reduce((market, character) => {
      if (characterId !== character.id) return [...market, character];
      return market;
    }, []);
    state.charactersMarket = newMarket;
  };

  /**
   * Adds item to inventory
   *
   * @param {ZCFSeat} seat
   */
  const equip = async (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      give: {
        Item: null,
        CharacterKey1: null,
      },
      want: {
        CharacterKey2: null,
      },
    });

    /**
     * TODO:
     * Verify that the item slot is empty before equipping.
     * If not empty unequip present item
     * Or construct the proposal so that we "want" the currently equipped item back
     */

    // Retrieve Items and Inventory key from user seat
    const providedItemAmount = seat.getAmountAllocated('Item');
    const providedCharacterKeyAmount = seat.getAmountAllocated('CharacterKey1');
    const providedCharacterKey = providedCharacterKeyAmount.value[0];
    const characterName = providedCharacterKey.name;

    // TODO: Validate Issuer
    // Make sure that a token with a correct key value  but minted from a different issuer is not allowed

    // Find characterRecord entry based on provided key
    const characterRecord = state.characters.find(
      (c) => c.name === characterName,
    );
    assert(characterRecord, X`${errors.inventory404}`);
    const inventorySeat = characterRecord.inventory;
    assert(inventorySeat, X`${errors.inventory404}`);

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
    seat.decrementBy(harden({ Item: providedItemAmount }));
    seat.decrementBy(harden({ CharacterKey1: providedCharacterKeyAmount }));

    // Deposit Item and Key to inventory seat
    inventorySeat.incrementBy(harden({ Item: providedItemAmount }));
    inventorySeat.incrementBy(
      harden({ CharacterKey: providedCharacterKeyAmount }),
    );

    // Widthdraw Key from character seat and Deposit into user seat
    inventorySeat.decrementBy(harden({ CharacterKey: inventoryCharacterKey }));
    seat.incrementBy(harden({ CharacterKey2: inventoryCharacterKey }));

    zcf.reallocate(seat, inventorySeat);

    // Add to private state
    const characterIndex = privateState.findIndex(
      (c) => c.name === characterName,
    );
    assert(characterIndex >= 0, X`${errors.privateState404}`);

    privateState[characterIndex] = {
      name: characterRecord.name,
      history: [
        {
          id: BigInt(privateState[characterIndex].history.length + 1),
          // @ts-ignore
          add: [providedItemAmount.value.map((i) => i.name)],
        },
      ],
    };

    seat.exit();
  };

  /**
   * Remove items from inventory
   *
   * @param {ZCFSeat} seat
   */
  const unequip = async (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      give: {
        CharacterKey1: null,
      },
      want: {
        Item: null,
        CharacterKey2: null,
      },
    });

    // Retrieve Character key from user seat and find matching inventory record
    const providedCharacterKeyAmount = seat.getAmountAllocated('CharacterKey1');
    const providedCharacterKey = providedCharacterKeyAmount.value[0];
    const characterName = providedCharacterKey.name;
    const characterRecord = state.characters.find(
      (c) => c.name === characterName,
    );
    assert(characterRecord, X`${errors.inventory404}`);
    const inventorySeat = characterRecord.inventory;
    assert(inventorySeat, X`${errors.inventory404}`);
    assert(providedCharacterKey, X`${errors.invalidCharacterKey}`);

    // Get reference to the wanted items and key
    const { want } = seat.getProposal();
    const { Item: requestedItems, CharacterKey2: wantedCharacter } = want;
    assert(requestedItems, X`${errors.noItemsRequested}`);

    // Get reference to the Character Key in inventorySeat
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

    // Widthdraw Key from user seat
    seat.decrementBy({ CharacterKey1: providedCharacterKeyAmount });
    // Widthdraw Character Key from inventory seat
    inventorySeat.decrementBy({ CharacterKey: wantedCharacter });
    // Deposit Character Key in user seat
    seat.incrementBy({ CharacterKey2: wantedCharacter });
    // Deposit Character key in inventory seat
    inventorySeat.incrementBy({ CharacterKey: providedCharacterKeyAmount });

    // Move item from inventory to user seat
    seat.incrementBy(inventorySeat.decrementBy({ Item: requestedItems }));

    zcf.reallocate(seat, inventorySeat);

    // Add to private state
    const characterIndex = privateState.findIndex(
      (c) => c.name === characterName,
    );
    assert(characterIndex >= 0, X`${errors.privateState404}`);
    privateState[characterIndex] = {
      name: characterRecord.name,
      history: [
        {
          id: BigInt(privateState[characterIndex].history.length + 1),
          // @ts-ignore
          remove: [requestedItems],
        },
      ],
    };
    seat.exit();
  };

  /**
   * Remove items from inventory
   *
   * @param {ZCFSeat} seat
   */
  const unequipAll = async (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
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
    const characterRecord = state.characters.find(
      (c) => c.name === characterName,
    );

    assert(characterRecord, X`${errors.inventory404}`);
    const inventorySeat = characterRecord.inventory;
    assert(inventorySeat, X`${errors.inventory404}`);
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

    // Widthdraw Key from user seat
    seat.decrementBy({ CharacterKey1: providedCharacterKeyAmount });
    // Widthdraw Character Key from inventory seat
    inventorySeat.decrementBy({ CharacterKey: wantedCharacter });
    // Deposit Character Key in user seat
    seat.incrementBy({ CharacterKey2: wantedCharacter });
    // Deposit Character key in inventory seat
    inventorySeat.incrementBy({ CharacterKey: providedCharacterKeyAmount });

    // Move items from inventory to user set
    seat.incrementBy(inventorySeat.decrementBy({ Item: items }));

    zcf.reallocate(seat, inventorySeat);
    seat.exit();
  };

  // Opportunity for more complex queries
  const getCharacters = () => {
    return harden({
      characters: state.characters,
    });
  };

  const getCharactersMarket = () => {
    return harden({
      characters: state.charactersMarket,
    });
  };

  const getItems = () => {
    return harden({
      items: state.items,
    });
  };

  const getItemsMarket = () => {
    return harden({
      items: state.itemsMarket,
    });
  };

  const creatorFacet = Far('Character store creator', {
    initConfig,
    getCharacterIssuer: () => characterIssuer,
    getItemIssuer: () => itemIssuer,
    getItemBrand: () => itemBrand,
    getCharacters,
    getConfig: () => state.config,
  });

  const publicFacet = Far('Chracter store public', {
    // config
    getConfig: () => state.config,

    // characters
    getCharacterBase: () => state.config?.baseCharacters[0],
    getCharacters,
    getCharactersMarket,
    getCharacterInventory,
    getCharacterKey,
    getCharacterCount: () => state.characterNames.length,
    getCharacterIssuer: () => characterIssuer,
    getCharacterBrand: () => characterBrand,

    // items
    getItems,
    getItemsMarket,
    getItemIssuer: () => itemIssuer,
    getItemBrand: () => itemBrand,

    // random
    getRandomBaseCharacter,
    getRandomItem,

    // equip/unequip
    makeEquipInvitation: () => zcf.makeInvitation(equip, 'addToInventory'),
    makeUnequipInvitation: () =>
      zcf.makeInvitation(unequip, 'removeFromInventory'),
    makeUnequipAllInvitation: () =>
      zcf.makeInvitation(unequipAll, 'removeAllItemsFromInventory'),

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

    // private state
    getPrivateState: () => privateState, // TODO: do we really want to expose the privateState?
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
