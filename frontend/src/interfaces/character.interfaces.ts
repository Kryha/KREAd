import { ActivityEvent } from "./activity.interfaces";
import { Item } from "./item.interfaces";

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
  description: string;
  level: number;
  items: CharacterItems;
  detail: Detail;
  projectDescription: string;
  itemActivity: ActivityEvent[];
  price: number;
  date: number;
}

export interface CharacterCreation {
  name: string;
}
