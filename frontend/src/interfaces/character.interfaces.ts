import { Item } from "./item.interfaces";

export interface Slots {
  // TODO: Figure out this type
};

export interface CharacterItems {
  noseline: Item | undefined;
  midBackground: Item | undefined;
  mask: Item | undefined;
  headPiece: Item | undefined;
  hair: Item | undefined;
  frontMask: Item | undefined;
  liquid: Item | undefined;
  background: Item | undefined;
  airResevoir: Item | undefined;
  clothing: Item | undefined;
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
