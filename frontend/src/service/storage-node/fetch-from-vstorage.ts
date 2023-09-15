import { AGORIC_RPC } from "../../constants";

const VSTORAGE_PATH = "abci_query?path=%22/custom/vstorage";

export enum AgoricChainStoragePathKind {
  Children = "children",
  Data = "data",
}

/**
 * @template Slot
 * @callback FromCapData
 * @param {CapData<Slot>} data
 * @returns {Passable}
 */

/** @template Slot @typedef {import('./types.js').FromCapData<Slot>} FromCapData */

export const fetchFromVStorage = async (marshaller: any, path: string, blockHeight?: number) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const url = `${AGORIC_RPC}/${VSTORAGE_PATH}/`;

  const fullPath = blockHeight ? `${url}${path}%22&height=%22${blockHeight}%22` : `${url}${path}%22`;

  const response = await fetch(fullPath, requestOptions);

  const text = await response.text();
  const data = JSON.parse(window.atob(JSON.parse(text).result.response.value));

  const value = JSON.parse(data.value);
  const latestValueStr = Object.hasOwn(value, "values") ? value.values[value.values.length - 1] : value;
  const parsed = JSON.parse(latestValueStr);
  const unserialized = Object.hasOwn(parsed, "slots") ? marshaller.unserialize(parsed) : parsed;

  return unserialized;
};
