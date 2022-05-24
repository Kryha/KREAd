import { Item } from "./item.interfaces";

// TODO: Define proper type for Slots items;
export interface Slots {
  items: Item[];
}

export interface CharacterItems {
  noseline?: Item;
  midBackground?: Item;
  mask?: Item;
  headPiece?: Item;
  hair?: Item;
  frontMask?: Item;
  liquid?: Item;
  background?: Item;
  airResevoir?: Item;
  clothing?: Item;
}

export interface Detail {
  boardId: string;
  contractAddresss: string;
  standard: string;
  artist: string;
  metadata: string;
}

export interface Activity {
  event: string;
  price: number;
  to: string;
  from: string;
  date: string;
}
export interface Character {
  name: string;
  type: string;
  characterId: string;
  description: string;
  level: number;
  items: CharacterItems;
  detail: Detail;
  projectDescription: string;
  itemActivity: Activity;
  price: number;
  slots: Slots[];
}
