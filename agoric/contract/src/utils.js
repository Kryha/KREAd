// @ts-check
import { E } from '@endo/eventual-send';
import { M, matches, getCopyMapEntries } from '@endo/patterns';

const { Fail } = assert;

/**
 * @param {string} name
 * @param {object} randomCharacterBase
 * @param {number} newCharacterId
 * @param {object} currentTime
 * @returns {object[]}
 */
export const makeCharacterNftObjs = (
  name,
  randomCharacterBase,
  newCharacterId,
  currentTime,
) => {
  // Merge random base character with name input, id, and keyId
  const newCharacter1 = {
    ...randomCharacterBase,
    date: currentTime,
    id: newCharacterId,
    name,
    keyId: 1,
  };
  const newCharacter2 = {
    ...newCharacter1,
    keyId: 2,
  };
  return [newCharacter1, newCharacter2];
};

/**
 * @template T
 * @typedef {object} RecorderKit<T>
 * @property {Publisher<T>} publisher
 * @property {StoredSubscriber<T>} subscriber
 */

/**
 * @template T
 * @param {ERef<StorageNode>} storageNode
 * @param {import('@agoric/zoe/src/contractSupport').MakeRecorderKit} makeRecorderKit
 * @param {string} path
 * @param {Pattern} typeMatcher
 * @returns {Promise<import('@agoric/zoe/src/contractSupport').RecorderKit<T>>}
 */
export const makeStorageNodeRecorderKit = async (
  storageNode,
  makeRecorderKit,
  path,
  typeMatcher,
) => {
  const node = await E(storageNode).makeChildNode(path);
  return makeRecorderKit(node, typeMatcher);
};

/**
 * @param {ERef<StorageNode>} storageNode
 * @param {import('@agoric/zoe/src/contractSupport').MakeRecorderKit} makeRecorderKit
 * @param {{[key: string]: string}} paths
 * @param {{[key: string]: Pattern}} typeMatchers
 * @returns {Promise<{[key: string]: import('@agoric/zoe/src/contractSupport').RecorderKit<T>}>}
 */
export const makeStorageNodeRecorderKits = async (
  storageNode,
  makeRecorderKit,
  paths,
  typeMatchers,
) => {
  const recorderMap = {};
  await Promise.all(
    Object.keys(paths).map(async (key) => {
      const recorderKit = await makeStorageNodeRecorderKit(
        storageNode,
        makeRecorderKit,
        paths[key],
        typeMatchers[key],
      );
      recorderMap[key] = recorderKit;
    }),
  );

  return recorderMap;
};

/**
 * @param {Brand} brand must be a 'nat' brand, not checked
 * @param {NatValue} [min]
 */
export const makeNatAmountShape = (brand, min) =>
  harden({ brand, value: min ? M.gte(min) : M.nat() });

/**
 * @param {Brand} brand must be a 'nat' brand, not checked
 * @param {Pattern} shape
 */
export const makeCopyBagAmountShape = (brand, shape) =>
  harden({ brand, value: shape });

// Added in https://github.com/Agoric/agoric-sdk/issues/7632 but not yet available on Mainnet
// Adapted from https://github.com/Agoric/agoric-sdk/blob/3ff341c28af26f7879a02b4a7a228b545d552e4a/packages/swingset-liveslots/src/collectionManager.js#L645
const isCopyMap = (m) => matches(m, M.map());
export const addAllToMap = (map, mapEntries) => {
  if (typeof mapEntries[Symbol.iterator] !== 'function') {
    if (Object.isFrozen(mapEntries) && isCopyMap(mapEntries)) {
      mapEntries = getCopyMapEntries(mapEntries);
    } else {
      Fail`provided data source is not iterable: ${mapEntries}`;
    }
  }
  for (const [key, value] of mapEntries) {
    if (map.has(key)) {
      map.set(key, value);
    } else {
      map.init(key, value, true);
    }
  }
};
