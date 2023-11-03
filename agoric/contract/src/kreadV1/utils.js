// @ts-check
import { allValues, objectMap } from '@agoric/internal';
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
 * @param {import('@agoric/vat-data').Baggage} baggage
 * @param {ERef<StorageNode>} storageNode
 * @param {import('@agoric/zoe/src/contractSupport').MakeRecorderKit} makeRecorderKit
 * @param {{[key: string]: string}} paths
 * @param {{[key: string]: Pattern}} typeMatchers
 * @returns {Promise<{[key: string]: import('@agoric/zoe/src/contractSupport').RecorderKit<unknown>}>}
 */
export const provideRecorderKits = async (
  baggage,
  storageNode,
  makeRecorderKit,
  paths,
  typeMatchers,
) => {
  // console.log('provideRecorderKits', paths, typeMatchers);
  const keys = Object.keys(paths);
  // assume if any keys are defined they all are
  const inBaggage = baggage.has(keys[0]);
  if (inBaggage) {
    const obj = objectMap(
      paths,
      /** @type {(value: any, key: string) => any} */
      (_, k) => baggage.get(k),
    );
    return Promise.resolve(harden(obj));
  }

  const keyedPromises = objectMap(paths, async (_path, key) => {
    const node = await E(storageNode).makeChildNode(paths[key]);
    return makeRecorderKit(node, typeMatchers[key]);
  });

  return allValues(keyedPromises).then((keyedVals) => {
    for (const [k, v] of Object.entries(keyedVals)) {
      baggage.init(k, v);
    }
    return keyedVals;
  });
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
