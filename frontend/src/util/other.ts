import { CharacterItems, ExtendedCharacter } from "../interfaces";

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