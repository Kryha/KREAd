import { assert, details as X } from '@agoric/assert';
import { E } from '@endo/eventual-send';
import { Far } from '@endo/marshal';
import { errors } from './errors';
import { getPage } from './utils';

/**
 * Put character up for sale
 *
 * @param {{
 *   tokenInfo: TokenInfo
 *   config: Config
 *   assetMints: AssetMints
 *   randomNumber: function
 *   notifiers: Notifiers
 * }} initialState
 * @returns {KreadState}
 */
export const kreadState = ({ tokenInfo, config, assetMints, randomNumber, notifiers }) => {
  /**
   * Contract STATE
   *
   * @type {State}
   */
  const state = {
    config, // Holds list of base characters and default items
    characters: [], // Holds each character's inventory + copy of its data
    items: [],
    market: {
      characters: [],
      items: [],
    },
    tokenInfo,
    assetMints,
    notifiers,
    randomNumber,
    ready: true,
    configReady: true,
  };

  /**
   * @returns {object}
   */
  const getRandomBaseCharacter = () => {
    const number = Math.floor(
      state.randomNumber() * state.config.tokenData.characters.length,
    );
    return state.config.tokenData.characters[number];
  };

  /**
   * @returns {object}
   */
  const getRandomItem = () => {
    const number = Math.floor(
      state.randomNumber() * state.config.tokenData.items.length,
    );
    return state.config.tokenData.items[number];
  };

  /**
   * Gets the inventory of a given character
   *
   * @param {string} name
   * @returns {{items: Item[]}}
   */
  const getCharacterInventory = (name) => {
    const characterRecord = state.characters.find(
      ({ character }) => character.name === name,
    );
    assert(characterRecord, X`${errors.character404}`);
    const { inventory } = characterRecord;
    const items = inventory.getAmountAllocated(
      'Item',
      state.tokenInfo.item.brand,
    ).value;
    // @ts-ignore
    return { items };
  };

  /**
   * Gets the characacter key of a given character
   *
   * @param {string} name
   * @returns {{ key: Amount}}
   */
  const getCharacterKey = (name) => {
    const characterRecord = state.characters.find(
      ({ character }) => character.name === name,
    );
    assert(characterRecord, X`${errors.character404}`);
    const { inventory } = characterRecord;
    const key = inventory.getAmountAllocated(
      'CharacterKey',
      state.tokenInfo.character.brand,
    );
    return { key };
  };

  /**
   * Gets the characacter record given character name
   *
   * @param {string} name
   * @returns {CharacterRecord}
   */
  const getCharacterRecord = (name) => {
    const characterRecord = state.characters.find(
      ({ character }) => character.name === name,
    );
    assert(characterRecord, X`${errors.character404}`);
    assert(characterRecord.inventory, X`${errors.inventory404}`);

    return characterRecord;
  };

  /**
   * Gets inventory updater given character name
   *
   * @param {string} name
   * @returns {Publisher<any>}
   */
  const getCharacterInventoryPublisher = (name) => {
    assert(state.ready, X`${errors.missingStorageNode}`);
    const characterRecord = state.characters.find(
      ({ character }) => character.name === name,
    );
    assert(characterRecord, X`${errors.character404}`);
    assert(characterRecord.publisher, X`${errors.notifier404}`);

    return characterRecord.publisher;
  };

  /**
   * Gets the current time (epoch)
   *
   * @returns {Promise<bigint>}
   */
  const getCurrentTime = async () =>
    E(state.config.timerService).getCurrentTimestamp();

  /**
   * @param {string} name
   * @returns {boolean}
   */
  const nameIsUnique = (name) => {
    const usedNames = state.characters.map((character) => character.name);
    return !usedNames.includes(name);
  };

  const validate = Far('kread state validate', {
    nameIsUnique,
  });

  /**
   *
   * @param {CharacterRecord[]} characters
   */
  const addCharacters = (characters) => {
    state.characters = [...state.characters, ...characters];
  };

  /**
   *
   * @param {ItemRecord[]} items
   */
  const addItems = (items) => {
    state.items = [...state.items, ...items];
  };

  /**
   *
   * @param {Config} newConfig
   */
  const updateConfig = (newConfig) => {
    state.config = newConfig;
  };

  /**
   *
   * @param {Powers} powers
   * @param {Notifiers} notifiers
  */
 const setPowers = (powers, notifiers) => {
   state.config.powers = powers;
   state.notifiers = notifiers;
   state.ready = true;
  };
  
  // Full access getters
  const get = Far('kread state get', {
    isReady: () => state.ready,
    isConfigReady: () => state.isConfigReady,
    inventory: getCharacterInventory,
    inventoryPublisher: getCharacterInventoryPublisher,
    characterKey: getCharacterKey,
    character: getCharacterRecord,
    time: getCurrentTime,
    marketPublisher: () => state.notifiers.market,
    randomBaseCharacter: getRandomBaseCharacter,
    assetInfo: () => state.tokenInfo,
    defaultItems: () => state.config.tokenData.items,
    powers: () => state.config.powers,
    config: () => state.config,
    randomItem: getRandomItem,
    characterCount: () => state.characters.length,
    itemCount: () => state.items.length,
  });

  // Adds content to specific entries of the
  // state by merging it with their current values
  const add = Far('kread state add', {
    characters: addCharacters,
    items: addItems,
    updateConfig,
  });
  
  // Replaces specific entries in the state
  const set = Far('kread state set', {
    powers: setPowers,
  });

  // Limited getters
  // Methods available in Kread's public facet
  const publicFacet = Far('kread state public facet', {
    isReady: () => state.ready,
    getCharacterInventory,
    inventoryPublisher: getCharacterInventoryPublisher,
    getCharacterKey,
    getCharacterRecord,
    getCharacters: () => state.characters,
    getCharactersRange: (range, page) => getPage(state.characters, range, page),
    getCharactersMarket: () => state.market.character,
    getItemsMaket: () => state.market.items,
    getCharactersMarketRange: () => state.market.character,
    getItemsMaketRange: () => getPage(state.market.items),
    getTime: getCurrentTime,
    getRandomBaseCharacter,
    getTokenInfo: () => state.tokenInfo,
    getDefaultItems: () => state.config.tokenData.items,
    getPowers: () => state.config.powers, // FIXME: restric or remove access
    getConfig: () => state.config, // FIXME: restric or remove access
    getRandomItem,
    isValidName: () => validate.nameIsUnique(),
    getCharacterCount: () => state.characters.length,
    getItemCount: () => state.items.length,
  });

  return { get, set, add, validate, public: publicFacet };
};
