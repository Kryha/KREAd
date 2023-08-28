import { ITEM_CATEGORIES, CHARACTER_CATEGORIES } from "../constants";
import { ActivityEvent } from "./activity.interfaces";
import { Item } from "./item.interfaces";

export const isItemCategory = (category: unknown): category is keyof CharacterItems => {
  if (typeof category !== "string") return false;
  return ITEM_CATEGORIES.all.includes(category);
};

export const isCharacterCategory = (category: unknown): category is keyof CharacterCategories => {
  if (typeof category !== "string") return false;
  return CHARACTER_CATEGORIES.includes(category);
};

// TODO: decide if this is the best solution or if it's better if already in a readable format
export interface CharacterCategories {
  tempetScavenger: string;
}

export interface CharacterItems {
  noseline?: Item;
  midBackground?: Item;
  mask?: Item;
  headPiece?: Item;
  hair?: Item;
  airReservoir?: Item;
  liquid?: Item;
  background?: Item;
  frontMask?: Item;
  clothing?: Item;
}

export interface Details {
  boardId: string;
  brand: string;
  artist: string;
  metadata: string;
}

export interface Character {
  id: any;
  keyId: number;
  title: string;
  name: string;
  type: string;
  description: string;
  image: string;
  level: number;
  details: Details;
  projectDescription: string;
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
    publicFacet?: any;
    price: bigint;
  };
}

export interface KreadCharacterInMarket {
  sellerSeat: any;
  name: string;
  askingPrice: {
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
  isEquipped: boolean;
  isForSale?: boolean;
}

export interface CharacterCreation {
  name: string;
}
