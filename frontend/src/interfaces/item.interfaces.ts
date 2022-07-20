import { ActivityEvent } from "./activity.interfaces";
import { Detail, Slots } from "./character.interfaces";

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
  slots: Slots[];
  activity: ActivityEvent[];
}

export interface ItemInMarket extends Item {
  sell: {
    publicFacet: any;
    price: bigint;
  };
}
