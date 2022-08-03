// @ts-check
import '@agoric/zoe/exported';
import { E } from '@endo/eventual-send';
import { AssetKind, AmountMath } from '@agoric/ertp';
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js';
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';

import { errors } from './errors';
import { mulberry32 } from './prng';
import { messages } from './messages';
import * as state from './get';
import { makeCharacterNftObjs } from './utils';

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

  /**
   * Private STATE
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
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      want: { Item: null },
    });
    const { want } = seat.getProposal();

    // @ts-ignore
    const currentTime = await E(
      state.config.chainTimerService,
    ).getCurrentTimestamp();

    // @ts-ignore
    const items = want.Item.value.map((item) => {
      const id = STATE.itemCount;
      STATE.itemCount = 1n + STATE.itemCount;

      return { ...item, id, date: Number(currentTime) };
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
  const mintCharacterNFT = async (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    // TODO add Give statement with Money
    assertProposalShape(seat, {
      want: {
        Asset: null,
      },
    });
    const { want } = seat.getProposal();
    const newCharacterName = want.Asset.value[0].name;
    assert(state.nameIsUnique(newCharacterName, STATE), X`${errors.nameTaken}`);

    state.characterCount = 1n + state.characterCount;
    const newCharacterId = state.characterCount;
    const randomCharacterBase = getRandomBaseCharacter();

    // @ts-ignore
    const currentTime = await E(
      state.config.chainTimerService,
    ).getCurrentTimestamp();
    // Merge random base character with name input, id, and keyId
    const newCharacter1 = {
      ...randomCharacterBase,
      date: Number(currentTime),
      id: newCharacterId,
      name: newCharacterName,
      keyId: 1,
    };
    const newCharacter2 = {
      ...randomCharacterBase,
      date: Number(currentTime),
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
    const allDefaultItems = Object.values(state.config.defaultItems);
    const uniqueItems = allDefaultItems.map((item) => {
      const newItemWithId = {
        ...item,
        date: Number(currentTime),
        id: state.itemCount,
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

    // TODO: make private STATE useful
    // Add to private STATE
    privateState = [
      ...privateState,
      {
        name: character.name,
        history: [
          {
            id: STATE.characterCount,
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
    STATE.itemsMarket = [...STATE.itemsMarket, itemInMarket];

    return itemInMarket;
  };

  /**
   * This function has to be called after completing the buy offer
   *
   * @param {bigint} itemId
   */
  const removeItemFromMarket = (itemId) => {
    // TODO: eventually use a more efficient data structure
    const newMarket = STATE.itemsMarket.reduce((market, item) => {
      if (itemId !== item.id) return [...market, item];
      return market;
    }, []);
    STATE.itemsMarket = newMarket;
  };

  /**
   * This function has to be called after completing the sell offer
   *
   * @param {CharacterInMarket} characterInMarket
   * @returns {CharacterInMarket}
   */
  const storeCharacterInMarket = (characterInMarket) => {
    STATE.charactersMarket = [...STATE.charactersMarket, characterInMarket];

    return characterInMarket;
  };

  /**
   * This function has to be called after completing the buy offer
   *
   * @param {bigint} characterId
   */
  const removeCharacterFromMarket = (characterId) => {
    // TODO: eventually use a more efficient data structure
    const newMarket = STATE.charactersMarket.reduce((market, character) => {
      if (characterId !== character.id) return [...market, character];
      return market;
    }, []);
    STATE.charactersMarket = newMarket;
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
    const characterRecord = STATE.characters.find(
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

    const { value: currentInventoryItems } =
      inventorySeat.getAmountAllocated('Item');
    validateInventoryState([
      // @ts-ignore
      ...currentInventoryItems,
      ...providedItemAmount.value,
    ]);

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

    // Add to private STATE
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

    // Retrieve Character key from user seat and find matching inventory record
    const providedCharacterKeyAmount = seat.getAmountAllocated('CharacterKey1');
    const providedCharacterKey = providedCharacterKeyAmount.value[0];
    const characterName = providedCharacterKey.name;
    const characterRecord = STATE.characters.find(
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

    // Add to private STATE
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

    // Find characterRecord entry based on provided key
    const characterRecord = STATE.characters.find(
      (c) => c.name === characterName,
    );
    assert(characterRecord, X`${errors.inventory404}`);
    const inventorySeat = characterRecord.inventory;
    assert(inventorySeat, X`${errors.inventory404}`);

    const { want } = seat.getProposal();
    const { CharacterKey2: wantedCharacterAmount, Item2: wantedItemsAmount } =
      want;

    // Get current Character Key from inventorySeat
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

    // Add to private STATE
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
    const characterRecord = STATE.characters.find(
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
    getCharactersMarket,
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

    // private STATE
    getPrivateState: () => privateState, // TODO: do we really want to expose the privateState?
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
