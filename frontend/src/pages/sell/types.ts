export interface SellText {
  sell: string;
  success: string;
  successLong: string;
  check: string;
}

export interface SellData {
  price: number;
  name?: string;
  type?: string;
  image?: string;
}

export type SellStep = 0 | 1 | 2;
