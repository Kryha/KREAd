import { ActivityEvent } from "./activity.interfaces";
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
  characterId: string;
  description: string;
  level: number;
  items: CharacterItems;
  detail: Detail;
  projectDescription: string;
  itemActivity: ActivityEvent[];
  price: number;
}

export interface CharacterCreation {
  name: string;
}
