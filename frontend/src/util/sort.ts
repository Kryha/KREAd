import { Item } from "../interfaces";

/* eslint-disable indent */
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
