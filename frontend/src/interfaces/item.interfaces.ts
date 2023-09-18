import { ActivityEvent } from "./activity.interfaces";
import { Origin } from "./character.interfaces";

export type ItemCategory = "perk1" | "patch" | "mask" | "headPiece" | "hair" | "perk2" | "filter1" | "background" | "filter2" | "clothing";

export type Rarity = "common" | "uncommon" | "rare" | "exotic" | "legendary";
export interface Stats {
  filtering: number;
  weight: number;
  sense: number;
  reserves: number;
  durability: number;
}

export interface Item {
  name: string;
  category: ItemCategory;
  origin: Origin;
  functional: boolean;
  description: string;
  image: string;
  thumbnail: string;
  rarity: number;
  level: number;
  filtering: number;
  weight: number;
  sense: number;
  reserves: number;
  durability: number;
  colors: string[];
  artistMetadata?: string;
  activity?: ActivityEvent[];
  equippedTo?: string;
  forSale?: boolean;
}

export interface ItemInMarket {
  id: string;
  item: Item;
  sell: {
    price: bigint;
    platformFee: bigint;
    royalty: bigint;
  };
}
