export interface SellText {
  sell: string;
  success: string;
  successLong: string;
  check: string;
}

export interface SellData {
  id: string;
  object: "character" | "item";
  price: number;
}

export type SellStep = 0 | 1 | 2;
