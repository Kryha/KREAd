export interface Item {
  name: string;
  id: string;
  code: string;
  image: string;
  equipped: boolean;
  category: string;
  price: number;
  amount: number;
  description: string;
}

export interface CharacterItems {
  noseline: Item[];
  midBackground: Item[];
  mask: Item[];
  headPiece: Item[];
  hair: Item[];
  frontMask: Item[];
  liquid: Item[];
  background: Item[];
  airResevoir: Item[];
  clothing: Item[];
}
