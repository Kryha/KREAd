export type Status = "sold" | "purchased";

export interface Notification {
  itemName: string;
  status: string;
  price?: number;
}
