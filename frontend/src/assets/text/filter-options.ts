import { Options } from "../../components";

export const itemCategories: Options[] = [
  { label: "head pieces", value: "headpiece" },
  { label: "noselines", value: "noseline" },
  { label: "filters I", value: "airReservoir" },
  { label: "filters II", value: "liquid" },
  { label: "masks", value: "mask" },
  { label: "front mask", value: "frontMask" },
  { label: "clothing", value: "clothing" },
  { label: "hair", value: "hair" },
  { label: "background I", value: "background" },
  { label: "background II", value: "background2" },
];

// TODO: add real categories
export const characterCategories: Options[] = [{ label: "Tempet Scavengers", value: "Tempet Scavenger" }];

export const sorting: Options[] = [
  { label: "A to Z", value: "atoz" },
  { label: "lowest price", value: "lowestPrice" },
  { label: "highest price", value: "highestPrice" },
  { label: "rarity", value: "rarity" },
];
