import { ExtendedCharacter, Item } from "../interfaces";

export const calculateCharacterLevels = (character: ExtendedCharacter) => {
  const totalItemLevel = Object.values(character.equippedItems)
    .filter((item: Item) => item !== undefined)
    .map((item: Item) => item.level)
    .reduce((total: number, level: number) => total + level, 0);

  const characterLevel = character.nft.level;
  const totalLevel = characterLevel + totalItemLevel;

  return { totalItemLevel, characterLevel, totalLevel };
};
