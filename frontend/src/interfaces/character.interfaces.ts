import { ITEM_CATEGORIES, CHARACTER_CATEGORIES } from "../constants";
import { ActivityEvent } from "./activity.interfaces";
import { Item } from "./item.interfaces";

export const isItemCategory = (category: unknown): category is keyof CharacterItems => {
  if (typeof category !== "string") return false;
  return ITEM_CATEGORIES.includes(category);
};

export const isCharacterCategory = (category: unknown): category is keyof CharacterCategories => {
  if (typeof category !== "string") return false;
  return CHARACTER_CATEGORIES.includes(category);
};

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

export interface Detail {
  boardId: string;
  brand: string;
  artist: string;
  metadata: string;
}

export interface Character {
  id: string;
  keyId: number;
  title: string;
  name: string;
  type: string;
  description: string;
  level: number;
  items: CharacterItems;
  detail: Detail;
  projectDescription: string;
  itemActivity: ActivityEvent[];
  price: number;
  date: number;
}

export interface CharacterBackend extends Omit<Character, "id"> {
  id: bigint;
}

export interface CharacterEquip extends Character {
  isEquipped: boolean;
}

export interface CharacterCreation {
  name: string;
}
