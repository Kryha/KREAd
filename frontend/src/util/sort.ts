import { Character, Item } from "../interfaces";


export const sortItems = (sorting: string, items: Item[]): Item[] => {
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

export const sortCharacters = (sorting: string, items: Character[]): Character[] => {
  switch (sorting) {
    case "atoz":
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case "lowestPrice":
      return items.sort((a, b) => a.price - b.price);
    case "highestPrice":
      return items.sort((a, b) => b.price - a.price);
    case "rarity":
      return items.sort((a, b) => b.level - a.level);
    case "latest":
      return items;
    default:
      return items;
  }
};
