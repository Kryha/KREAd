export interface BuyText {
  buy: string;
  success: string;
  successLong: string;
  check: string;
}

export interface BuyData {
  price: number;
  name?: string;
  type?: string;
  image?: string;
}

export type BuyStep = 1 | 2;
