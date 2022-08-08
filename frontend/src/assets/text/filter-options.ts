import { Options } from "../../components";

export const itemCategories: Options[] = [
  { label: "head pieces", value: "headPiece" },
  { label: "noselines", value: "noseline" },
  { label: "air Reservoir", value: "airReservoir" },
  { label: "liquid", value: "liquid" },
  { label: "masks", value: "mask" },
  { label: "front mask", value: "frontMask" },
  { label: "clothing", value: "clothing" },
  { label: "hair", value: "hair" },
  { label: "background", value: "background" },
  { label: "mid background", value: "midBackground" },
  { label: "for sale", value: "forSale" },
  { label: "equipped", value: "equipped" },
];

// TODO: add real categories
export const characterCategories: Options[] = [
  { label: "Tempet Scavengers", value: "tempetScavenger" },
  { label: "for sale", value: "forSale" },
  { label: "equipped", value: "equipped" },
];

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
