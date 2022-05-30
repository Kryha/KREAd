import { Detail, Slots } from "./character.interfaces";
export interface Item {
  name: string;
  category: string;
  id: string;
  description: string;
  image: string;
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

export interface ActivityEvent {
  type: string;
  price?: number;
  from?: string;
  to: string;
  date: EpochTimeStamp;
}
