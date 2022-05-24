import styled from "styled-components";

import { margins } from "../../design";
import { SecondaryButton } from "../atoms";
import { zIndex as zIndexProps } from "../../design/spacing";

interface ImageProps {
  width: number;
  height: number;
  zIndex?: number;
  isZoomed?: boolean;
  size?: "mini" | "medium" | "normal" | "large" | "extraLarge";
}

export const ExpandButton = styled(SecondaryButton)`;
  position: absolute;
  z-index: 300;
  left: 38%;
  bottom: ${margins.big};
  padding: 2px 16px;
`;

export const CharacterIcon = styled.img<ImageProps>`
  position: relative;
  top: 0px;
  ${({ zIndex }): string => `z-index: ${zIndex || zIndexProps.forground};`};
  ${({ width, height }): string => `min-width: ${width * 0.4}px; max-width: ${width * 0.4}px; width: ${width * 0.4}px; height: ${height}px;`};
`;


export const CharacterWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 30.16%;
  margin: 0;
`;
/* eslint-disable indent */
export const CharacterContainer = styled.div<ImageProps>`
  ${({ size, width, height }): string => {
    switch (size) {
      case "mini":
        return "zoom:0.075; ";
      case "medium":
        return "zoom: 0.3079;";
      case "normal":
        return `width: ${width * 0.4}px; height: ${height}px;`;
      case "large":
        return "zoom: 1.6;";
      case "extraLarge":
        return "zoom: 1.8;";
      default:
        return `width: ${width * 0.4}px; height: ${height}px;`;
    }
  }};
`;

export const ItemIcon = styled.img<ImageProps>`
  position: absolute;
  top: 0;
  left: 0;
  ${({ zIndex }): string => `z-index: ${zIndex || zIndexProps.mid};`};
  ${({ width, height }): string => `width: ${width * 0.4}px; height: ${height}px;`};
`;
