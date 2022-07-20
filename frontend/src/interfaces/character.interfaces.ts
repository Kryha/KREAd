import { ActivityEvent } from "./activity.interfaces";
import { Item } from "./item.interfaces";

// TODO: Define proper type for Slots items;
export interface Slots {
  items: Item[];
}

export interface CharacterItems {
  styleline?: Item;
  background2?: Item;
  mask?: Item;
  headPiece?: Item;
  hair?: Item;
  filter1?: Item;
  filter2?: Item;
  background1?: Item;
  addOns?: Item;
  clothing?: Item;
}

export interface Detail {
  boardId: string;
  brand: string;
  artist: string;
  metadata: string;
}

export interface Character {
  title: string;
  name: string;
  type: string;
  characterId: string;
  description: string;
  level: number;
  items: CharacterItems;
  detail: Detail;
  projectDescription: string;
  itemActivity: ActivityEvent[];
  price: number;
  slots: Slots[];
}

export interface CharacterCreation {
  name: string;
}

export interface CharacterInMarket extends Character {
  sell: {
    publicFacet: any;
    price: bigint;
  };
}
