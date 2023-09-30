import { ActivityEvent } from "./activity.interfaces";
import { Origin } from "./character.interfaces";
import { CATEGORY, RARITY } from "../constants";

export type Category = (typeof CATEGORY)[keyof typeof CATEGORY];
export type Rarity = (typeof RARITY)[keyof typeof RARITY];
export interface Stats {
  filtering: number;
  weight: number;
  sense: number;
  reserves: number;
  durability: number;
}

export interface Item {
  name: string;
  category: Category;
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

export interface MarketMetrics {
  amountSold: number;
  averageLevel: number;
  collectionSize: number;
  latestSalePrice: bigint;
  marketplaceAverageLevel: number;
  putForSaleCount: number;
}
