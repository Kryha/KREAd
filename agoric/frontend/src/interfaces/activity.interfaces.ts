import { ItemInMarket } from "./item.interfaces";

export interface ActivityEvent {
  name: string;
  type?: string;
  price?: number;
  from?: string;
  to: string;
  date: EpochTimeStamp;
}
export interface ItemActivityEventBackend {
  type: string;
  data: ItemInMarket;
  timestamp: EpochTimeStamp;
}
