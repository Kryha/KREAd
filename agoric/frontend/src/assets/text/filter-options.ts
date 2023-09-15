import { Options } from "../../components";

const allSortingOptions: Options[] = [
  { label: "latest", value: "latest" },
  { label: "A to Z", value: "atoz" },
  { label: "lowest price", value: "lowestPrice" },
  { label: "highest price", value: "highestPrice" },
  { label: "rarity", value: "rarity" },
  { label: "level", value: "level" },
];

export const getSortingOptions = (valuesToInclude: string[] = []): Options[] => {
  return valuesToInclude.length === 0 ? allSortingOptions : allSortingOptions.filter((option) => valuesToInclude.includes(option.value));
};

// Items
const itemCategories = [
  { label: "head piece", value: "headPiece" },
  { label: "noseline", value: "noseline" },
  { label: "air reservoir", value: "airReservoir" },
  { label: "liquid", value: "liquid" },
  { label: "mask", value: "mask" },
  { label: "front mask", value: "frontMask" },
  { label: "clothing", value: "clothing" },
  { label: "hair", value: "hair" },
  { label: "background", value: "background" },
  { label: "mid background", value: "midBackground" },
];

export const itemShopCategories: Options[] = [{ label: "all categories", value: "allCategories" }, ...itemCategories];
export const itemInventoryCategories: Options[] = [
  { label: "all categories", value: "allCategories" },
  ...itemCategories,
  { label: "equipped", value: "equipped" },
  { label: "for sale", value: "forSale" },
];

export const sortItemsInShop: Options[] = getSortingOptions(); // All of them
export const sortItemsInInventory: Options[] = getSortingOptions(["latest", "atoz", "rarity", "level"]);

// Characters
const characterCategories = [
  { label: "elephia", value: "elephia" },
  { label: "arma", value: "arma" },
  { label: "west", value: "west" },
  { label: "farma", value: "farma" },
  { label: "mount", value: "mount" },
  { label: "tempet scavengers", value: "tempetScavenger" },
  { label: "mars", value: "mars" },
];
export const characterShopCategories: Options[] = [{ label: "all categories", value: "allCategories" }, ...characterCategories];
export const characterInventoryCategories: Options[] = [
  ...characterCategories,
  { label: "equipped", value: "equipped" },
  { label: "for sale", value: "forSale" },
];

export const sortCharactersInShop: Options[] = getSortingOptions(["latest", "atoz", "lowestPrice", "highestPrice", "level"]);
export const sortCharactersInInventory: Options[] = getSortingOptions(["latest", "atoz", "lowestPrice", "highestPrice", "level"]);
