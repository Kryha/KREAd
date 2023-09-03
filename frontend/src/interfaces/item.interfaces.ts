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
  isEquipped?: boolean;
  forSale?: boolean;
}

export interface KreadItemInMarket {
  sellerSeat: any;
  id: string;
  askingPrice: {
    value: bigint;
    brand: any;
  };
  object: ItemBackend;
}

export interface ItemInMarket {
  id: string;
  item: Item;
  sell: {
    publicFacet?: any;
    price: bigint;
  };
}

// TODO: revisit interfaces
export interface ItemInMarketBackend {
  id: bigint;
  item: ItemBackend;
  sell: {
    publicFacet?: any;
    price: bigint;
  };
}

export interface ItemBackend extends Omit<Item, "id"> {
  id: bigint;
}

export interface ItemEquip extends Item {
  isEquipped: boolean;
  isForSale?: boolean;
}
