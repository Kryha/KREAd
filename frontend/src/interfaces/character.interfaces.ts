import { CATEGORY, ORIGIN, TITLE } from "../constants";
import { ActivityEvent } from "./activity.interfaces";
import { Item } from "./item.interfaces";

export type Origin = (typeof ORIGIN)[keyof typeof ORIGIN];
export type Title = (typeof TITLE)[keyof typeof TITLE];

export const isItemCategory = (category: unknown): category is keyof CharacterItems => {
  if (typeof category !== "string") return false;
  return Object.prototype.hasOwnProperty.call(CATEGORY, category);
};

export const isCharacterCategory = (title: unknown): title is Title => {
  if (typeof title !== "string") return false;
  return (title as Title) in TITLE;
};

export interface CharacterItems {
  [key: string]: Item | undefined;
  background?: Item;
  patch?: Item;
  hair?: Item;
  headPiece?: Item;
  mask?: Item;
  perk1?: Item;
  perk2?: Item;
  filter1?: Item;
  filter2?: Item;
  garment?: Item;
}

export interface Details {
  boardId: string;
  brand: string;
  artist: string;
  metadata: string;
}

export interface Character {
  id: number;
  title: Title;
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
  id: number;
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
  asset: Character;
}

export interface CharacterInMarketBackend {
  id: bigint;
  character: Character;
  sell: {
    publicFacet?: any;
    price: bigint;
  };
}

export interface CharacterCreation {
  name: string;
  setError?: (error: string) => void
}
