export const margins = {
  nano: "4px",
  mini: "8px",
  small: "16px",
  medium: "24px",
  large: "30px",
  big: "40px",
  extraLarge: "70px",
  huge: "100px",
  gigantic: "120px",
} as const;

export interface zIndexProps {
  [key: string]: number;
}

export const zIndex: zIndexProps = {
  foreground: 10,
  mid: 20,
  inFront: 30,
  onTop: 101,
  overCharacter: 41,
  background: 0,
  patch: 1,
  character: 2,
  hair: 3,
  mask: 4,
  perk1: 5,
  filter1: 6,
  perk2: 7,
  filter2: 8,
  garment: 9,
  headPiece: 10,
} as const;
