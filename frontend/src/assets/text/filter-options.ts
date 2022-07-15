import { Options } from "../../components";


export const itemCategories: Options[] = [
  { label: "head pieces", value: "headpiece" },
  { label: "stylelines", value: "styleline" },
  { label: "filters I", value: "filter1" },
  { label: "filters II", value: "filter2" },
  { label: "masks", value: "mask" },
  { label: "add-ons", value: "add-ons" },
  { label: "clothing", value: "clothing" },
  { label: "hair", value: "hair" },
  { label: "background I", value: "background1" },
  { label: "background II", value: "background2" },
];

// TODO: add real categories
export const characterCategories: Options[] = [
  { label: "Tempet Scavengers", value: "Tempet Scavenger" },
];

export const sorting: Options[] = [
  { label: "A to Z", value: "atoz" },
  { label: "lowest price", value: "lowestPrice" },
  { label: "highest price", value: "highestPrice" },
  { label: "rarity", value: "rarity" },
];
