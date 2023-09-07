import { ActivityEvent } from "./activity.interfaces";
import { Details } from "./character.interfaces";

export type ItemCategory =
  | "noseline"
  | "midBackground"
  | "mask"
  | "headPiece"
  | "hair"
  | "frontMask"
  | "liquid"
  | "background"
  | "airReservoir"
  | "clothing"
  | "forSale"
  | "equipped";

export interface Item {
  name: string;
  category: ItemCategory;
  description: string;
  image: string;
  thumbnail: string;
  level: number;
  rarity: number;
  effectiveness: number;
  layerComplexity: number;
  forged: string;
  baseMaterial: string;
  colors: string[];
  projectDescription: string;
  details: Details;
  activity?: ActivityEvent[];
  equippedTo?: string;
  forSale?: boolean;
}

export interface ItemInMarket {
  id: string;
  item: Item;
  sell: {
    publicFacet?: any;
    price: bigint;
  };
}



