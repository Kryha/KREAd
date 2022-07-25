import { ActivityEvent } from "./activity.interfaces";
import { Detail } from "./character.interfaces";

export interface Item {
  name: string;
  category: string;
  id: string;
  description: string;
  image: string;
  thumbnail: string;
  level: number;
  rarity: number;
  effectiveness?: number;
  layerComplexity?: number;
  forged: string;
  baseMaterial: string;
  colors: string[];
  projectDescription: string;
  price: number;
  details: Detail;
  date: string;
  activity: ActivityEvent[];
}

export interface ItemInMarket {
  id: string;
  item: Item;
  sell: {
    publicFacet: any;
    price: bigint;
  };
}

export interface ItemInMarketBackend {
  id: bigint;
  item: ItemBackend;
  sell: {
    publicFacet: any;
    price: bigint;
  };
}

export interface ItemBackend extends Omit<Item, "id"> {
  id: bigint;
}

export interface ItemEquip extends Item {
  isEquipped: boolean;
}
