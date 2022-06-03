import { Item } from "../interfaces";

/* eslint-disable indent */
export const sortItems = (sorting: string, data: Item[]): Item[] => {
  switch (sorting) {
    case "atoz":
      return data.sort((a, b) => a.name.localeCompare(b.name));
    case "lowestPrice":
      return data.sort((a, b) => a.price - b.price);
    case "highestPrice":
      return data.sort((a, b) => b.price - a.price);
    case "rarity":
      return data.sort((a, b) => b.rarity - a.rarity);
    case "latest":
      return data;
    default:
      return [];
  }
};
