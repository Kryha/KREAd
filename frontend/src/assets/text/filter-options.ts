import { Category, Origin, Rarity } from "../../interfaces";
import { CATEGORY, ORIGIN, RARITY } from "../../constants";

export const sortItemsInventoryOptions = [
  { label: "A to Z", value: "A to Z" },
  { label: "level", value: "level_sort" },
  { label: "category", value: "category_sort" },
  { label: "origin", value: "origin_sort" },
  { label: "rarity", value: "rarity_sort" },
];

export const sortCharactersInventoryOptions = [
  { label: "A to Z", value: "A to Z" },
  { label: "level", value: "level_sort" },
  { label: "title", value: "title_sort" },
  { label: "origin", value: "origin_sort" },
];

export const sortCharactersMarketOptions = [
  { label: "A to Z", value: "A to Z" },
  { label: "level", value: "level_sort" },
  { label: "title", value: "title_sort" },
  { label: "origin", value: "origin_sort" },
  { label: "lowest price", value: "lowestPrice" },
  { label: "highest price", value: "highestPrice" },
];
export const sortItemsMarketOptions = [
  { label: "A to Z", value: "A to Z" },
  { label: "level", value: "level_sort" },
  { label: "category", value: "category_sort" },
  { label: "lowest price", value: "lowestPrice" },
  { label: "highest price", value: "highestPrice" },
];

export const categoryOptions = (Object.keys(CATEGORY) as Category[]).map((category) => ({
  label: category.toLowerCase(),
  value: category.toLowerCase(),
}));
export const originOptions = (Object.keys(ORIGIN) as Origin[]).map((origin) => ({
  label: origin.toLowerCase(),
  value: origin.toLowerCase(),
}));

export const titleOptions = [
  { label: "Bounty Hunter", value: "bountyHunter" },
  { label: "Citizen", value: "citizen" },
  { label: "Council Member", value: "councilMember" },
  { label: "Scavenger", value: "scavenger" },
  { label: "State Bounty Hunter", value: "stateBountyHunter" },
];
export const rarityOptions = (Object.keys(RARITY) as Rarity[]).map((rarity) => ({
  label: rarity.toLowerCase(),
  value: rarity.toLowerCase(),
}));
