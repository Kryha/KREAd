import { CharacterItems, ExtendedCharacter } from "../interfaces";
import { PINATA_GATEWAY } from "../constants";

export const replaceCharacterInUserStateArray = (arr: ExtendedCharacter[], name: string, newEntry: ExtendedCharacter) => {
  const newArr = [...arr];
  const index = newArr.findIndex((entry) => entry.nft.name === name);
  if (index > -1) {
    newArr.splice(index, 1, newEntry);
  }

  return newArr;
};

export const replaceCharacterInventoryInUserStateArray = (arr: ExtendedCharacter[], name: string, inventory: CharacterItems) => {
  const newArr = [...arr];
  const index = newArr.findIndex((entry) => entry.nft.name === name);
  const oldEntry = newArr.find((entry) => entry.nft.name === name);
  if (index > -1 && oldEntry) {
    const newEntry = { ...oldEntry, equippedItems: inventory };
    newArr.splice(index, 1, newEntry);
  }
  return newArr;
};

export const dedupArrById = (arr: any[]) => [...new Map(arr.map((v) => [v.id, v])).values()];

export const dedupArrByName = (arr: any[]) => [...new Map(arr.map((v) => [v.nft.name, v])).values()];

export const cidToUrl = (cid: string) => {
  if (cid.includes("/ipfs/")) {
    return cid;
  }
  return `${PINATA_GATEWAY}/ipfs/${cid}`;
};
export const urlToCid = (url: string) => {
  if (!url.includes("/ipfs/")) {
    return url;
  }
  return url.split("/ipfs/")[1];
};
