import { Item } from "./item.interfaces";

export interface Slots {
  // TODO: Figure out this type
};

export interface CharacterItems {
  noseline: Item | null;
  midBackground: Item | null;
  mask: Item | null;
  headPiece: Item | null;
  hair: Item | null;
  frontMask: Item | null;
  liquid: Item | null;
  background: Item | null;
  airResevoir: Item | null;
  clothing: Item | null;
};

export interface Detail {
  boardAddress: string;
  contractAddresss: string;
  standard: string;
  artist: string;
  metadata: any;
};

export interface Activity {
  event: string;
  price: number;
  to: string;
  from: string;
  date: string;
};
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
};
