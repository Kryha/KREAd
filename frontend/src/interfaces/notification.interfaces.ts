export enum Status {
  Sold = "sold",
  Purchased = "purchased",
}

export interface Notification {
  itemName: string;
  status: string;
  price?: number;
}
