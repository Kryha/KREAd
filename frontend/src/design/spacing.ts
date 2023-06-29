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
};

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
  midBackground: 1,
  character: 2,
  hair: 3,
  mask: 4,
  noseline: 5,
  liquid: 6,
  frontMask: 7,
  airReservoir: 8,
  clothing: 9,
  headPiece: 10,
};
