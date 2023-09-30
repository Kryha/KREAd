import { ExtendedCharacter, Item } from "../interfaces";

export const calculateCharacterLevels = (character: ExtendedCharacter) => {
  const totalItemLevel = Object.values(character.equippedItems)
    .filter((item): item is Item => item !== undefined)
    .map((item) => item.level)
    .reduce<number>((total, level) => total + level, 0);

  const characterLevel = character.nft.level;
  const totalLevel = characterLevel + totalItemLevel;

  return { totalItemLevel, characterLevel, totalLevel };
};
