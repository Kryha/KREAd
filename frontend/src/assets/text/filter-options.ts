import { Options } from "../../components";

export const itemCategories: Options[] = [
  { label: "head pieces", value: "headPiece" },
  { label: "noselines", value: "noseline" },
  { label: "filters I", value: "airReservoir" },
  { label: "filters II", value: "liquid" },
  { label: "masks", value: "mask" },
  { label: "front mask", value: "frontMask" },
  { label: "clothing", value: "clothing" },
  { label: "hair", value: "hair" },
  { label: "background I", value: "background" },
  { label: "background II", value: "midBackground" },
];

// TODO: add real categories
export const characterCategories: Options[] = [{ label: "Tempet Scavengers", value: "tempetScavenger" }];

export const sorting: Options[] = [
  { label: "A to Z", value: "atoz" },
  { label: "lowest price", value: "lowestPrice" },
  { label: "highest price", value: "highestPrice" },
  { label: "rarity", value: "rarity" },
];

export const sortingInventory: Options[] = [
  { label: "A to Z", value: "atoz" },
  { label: "rarity", value: "rarity" },
];
