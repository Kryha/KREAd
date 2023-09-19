import { CHARACTER_TITLES, ITEM_CATEGORIES } from "../constants";
import { ActivityEvent } from "./activity.interfaces";
import { Item } from "./item.interfaces";

export type CharacterTitle = "Citizen" | "Scavenger" | "Bounty Hunter" | "State Bounty Hunter" | "Council Member";

export type Origin = "Elphia" | "Farma" | "Mount" | "Arm" | "West" | "Sage" | "Mars" | "Tempet";

export const isItemCategory = (category: unknown): category is keyof CharacterItems => {
  if (typeof category !== "string") return false;
  return ITEM_CATEGORIES.all.includes(category);
};

export const isCharacterCategory = (title: unknown): title is CharacterTitle => {
  if (typeof title !== "string") return false;
  return (title as CharacterTitle) in CHARACTER_TITLES;
};

export interface CharacterItems {
  perk1?: Item;
  patch?: Item;
  mask?: Item;
  headPiece?: Item;
  hair?: Item;
  filter2?: Item;
  filter1?: Item;
  background?: Item;
  perk2?: Item;
  clothing?: Item;
}

export interface Details {
  boardId: string;
  brand: string;
  artist: string;
  metadata: string;
}

export interface Character {
  id: number;
  title: CharacterTitle;
  image: string;
  keyId: number;
  name: string;
  origin: Origin;
  description: string;
  level: number;
  artistMetadata: string;
  characterTraits: string;
  date: number;
  itemActivity: ActivityEvent[];
}

export interface ExtendedCharacter {
  nft: Character;
  equippedItems: CharacterItems;
  activity?: ActivityEvent[];
  notifier?: any;
}

export interface CharacterInMarket {
  id: string;
  character: Character;
  equippedItems: CharacterItems;
  sell: {
    price: bigint;
    platformFee: bigint;
    royalty: bigint;
  };
}

export interface KreadCharacterInMarket {
  sellerSeat: any;
  name: string;
  askingPrice: {
    value: bigint;
    brand: any;
  };
  platformFee: {
    value: bigint;
    brand: any;
  };
  royalty: {
    value: bigint;
    brand: any;
  };
  object: CharacterBackend;
}

export interface CharacterInMarketBackend {
  id: bigint;
  character: CharacterBackend;
  sell: {
    publicFacet?: any;
    price: bigint;
  };
}

export interface CharacterBackend extends Omit<Character, "id"> {
  id: bigint;
}

export interface ExtendedCharacterBackend extends Omit<ExtendedCharacter, "nft"> {
  nft: CharacterBackend;
}

export interface CharacterEquip extends ExtendedCharacter {
  equippedTo: boolean;
  isForSale?: boolean;
}

export interface CharacterCreation {
  name: string;
}
