import { assert, details as X } from '@agoric/assert';
import { E } from '@endo/eventual-send';
import { errors } from './errors';

/**
 * @param {Function} contractConfigured
 * @param {State} state
 * @returns {object}
 */
export const getRandomBaseCharacter = (state) => {
  assert(state.config?.completed, X`${errors.noConfig}`);
  const number = Math.floor(
    state.randomNumber() * state.config.baseCharacters.length,
  );
  return state.config.baseCharacters[number];
};

/**
 * @param {Function} contractConfigured
 * @param {State} state
 * @returns {object}
 */
export const getRandomItem = (state) => {
  assert(state.config?.completed, X`${errors.noConfig}`);
  const number = Math.floor(
    state.randomNumber() * state.config.defaultItems.length,
  );
  return state.config.defaultItems[number];
};

/**
 * @param {string} name
 * @param {State} state
 * @returns {boolean}
 */
export const nameIsUnique = (name, state) => {
  const usedNames = state.characters.map((character) => character.name);
  return !usedNames.includes(name);
};

/**
 * Gets the inventory of a given character
 *
 * @param {string} characterName
 * @param {State} state
 * @returns {{items: Item[]}}
 */
export const getCharacterInventory = (characterName, state) => {
  const characterRecord = state.characters.find(
    ({ character }) => character.name === characterName,
  );
  assert(characterRecord, X`${errors.character404}`);
  const { inventory } = characterRecord;
  const items = inventory.getAmountAllocated(
    'Item',
    state.assets.item.brand,
  ).value;
  // @ts-ignore
  return { items };
};

/**
 * Gets the characacter key of a given character
 *
 * @param {string} characterName
 * @param {State} state
 * @returns {{ key: Amount}}
 */
export const getCharacterKey = (characterName, state) => {
  const characterRecord = state.characters.find(
    ({ character }) => character.name === characterName,
  );
  assert(characterRecord, X`${errors.character404}`);
  const { inventory } = characterRecord;
  const key = inventory.getAmountAllocated(
    'CharacterKey',
    state.assets.character.brand,
  );
  return { key };
};

/**
 * Gets the characacter record given character name
 *
 * @param {string} characterName
 * @param {State} state
 * @returns {CharacterRecord}
 */
export const getCharacterRecord = (characterName, state) => {
  const characterRecord = state.characters.find(
    ({ character }) => character.name === characterName,
  );
  assert(characterRecord, X`${errors.character404}`);
  assert(characterRecord.inventory, X`${errors.inventory404}`);

  return characterRecord;
};

/**
 * Gets inventory notifier given character name
 *
 * @param {string} characterName
 * @param {State} state
 * @returns {Notifier}
 */
export const getCharacterInventoryNotifier = (characterName, state) => {
  const characterRecord = state.characters.find(
    ({ character }) => character.name === characterName,
  );
  assert(characterRecord, X`${errors.character404}`);
  assert(characterRecord.inventory, X`${errors.inventory404}`);

  return characterRecord.notifier;
};

/**
 * Gets the current time (epoch)
 *
 * @param {State} state
 * @returns {Promise<bigint>}
 */
export const getCurrentTime = async (state) =>
  E(state.config.chainTimerService).getCurrentTimestamp();
