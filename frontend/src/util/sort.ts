import { CharacterEquip, CharacterInMarket, ItemEquip, ItemInMarket } from "../interfaces";

export const sortItems = (sorting: string, items: ItemEquip[]): ItemEquip[] => {
  switch (sorting) {
    case "atoz":
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case "lowestPrice":
      return items.sort((a, b) => a.price - b.price);
    case "highestPrice":
      return items.sort((a, b) => b.price - a.price);
    case "rarity":
      return items.sort((a, b) => b.rarity - a.rarity);
    case "latest":
      return items;
    default:
      return items;
  }
};

export const sortItemsMarket = (sorting: string, items: ItemInMarket[]): ItemInMarket[] => {
  switch (sorting) {
    case "atoz":
      return items.sort((a, b) => a.item.name.localeCompare(b.item.name));
    case "lowestPrice":
      return items.sort((a, b) => a.item.price - b.item.price);
    case "highestPrice":
      return items.sort((a, b) => b.item.price - a.item.price);
    case "rarity":
      return items.sort((a, b) => b.item.rarity - a.item.rarity);
    case "latest":
      return items;
    default:
      return items;
  }
};

export const sortCharacters = (sorting: string, characters: CharacterEquip[]): CharacterEquip[] => {
  switch (sorting) {
    case "atoz":
      return characters.sort((a, b) => a.name.localeCompare(b.name));
    case "lowestPrice":
      return characters.sort((a, b) => a.price - b.price);
    case "highestPrice":
      return characters.sort((a, b) => b.price - a.price);
    case "rarity":
      return characters.sort((a, b) => b.level - a.level);
    case "latest":
      return characters;
    default:
      return characters;
  }
};

export const sortCharactersMarket = (sorting: string, characters: CharacterInMarket[]): CharacterInMarket[] => {
  switch (sorting) {
    case "atoz":
      return characters.sort((a, b) => a.character.name.localeCompare(b.character.name));
    case "lowestPrice":
      return characters.sort((a, b) => a.character.price - b.character.price);
    case "highestPrice":
      return characters.sort((a, b) => b.character.price - a.character.price);
    case "rarity":
      return characters.sort((a, b) => b.character.level - a.character.level);
    case "latest":
      return characters;
    default:
      return characters;
  }
};
