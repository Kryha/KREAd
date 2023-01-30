import styled from "@emotion/styled";

import { margins } from "../../design";
import { SecondaryButton, zoomClothing, zoomIn } from "../atoms";
import { zIndex as zIndexProps } from "../../design/spacing";
import { EXTRA_LARGE_SCREEN_SIZE, LARGE_SCREEN_SIZE, MEDIUM_SCREEN_SIZE, SMALL_SCREEN_SIZE } from "../../constants";
import { css } from "@emotion/react";

interface ImageProps {
  width: number;
  height: number;
  zIndex?: number;
  isZoomed?: boolean;
  size?: "mini" | "medium" | "half" | "normal" | "large" | "extraLarge";
  isClothing?: boolean;
}

interface ViewProps {
  width: number;
}

export const ExpandButton = styled(SecondaryButton)<ViewProps>`
  position: absolute;
  z-index: 300;
  ${({ width }): string => {
    if (width <= SMALL_SCREEN_SIZE) {
      return "left: 45%;";
    }
    if (width <= MEDIUM_SCREEN_SIZE && width >= SMALL_SCREEN_SIZE) {
      return "left: 48%;";
    }
    if (width <= LARGE_SCREEN_SIZE && width >= MEDIUM_SCREEN_SIZE) {
      return "left: 46%;";
    }
    if (width >= EXTRA_LARGE_SCREEN_SIZE && width >= LARGE_SCREEN_SIZE) {
      return "left: 47%;";
    } else {
      return "left: 48%;";
    }
  }};
  bottom: ${margins.big};
  padding: 8px 16px;
  > svg {
    margin-left: 0px;
  }
`;

export const CharacterIcon = styled.img<ImageProps>`
  position: relative;
  top: 0px;
  ${({ zIndex }): string => `z-index: ${zIndex || zIndexProps.character};`};
  ${({ height }): string => `height: ${height}px;`};
  ${({ width }): string => {
    if (width <= SMALL_SCREEN_SIZE) {
      return "width: 600px;";
    }
    if (width <= MEDIUM_SCREEN_SIZE && width >= SMALL_SCREEN_SIZE) {
      return "width: 742px; ";
    }
    if (width <= LARGE_SCREEN_SIZE && width >= MEDIUM_SCREEN_SIZE) {
      return "width: 764px; ";
    }
    if (width >= EXTRA_LARGE_SCREEN_SIZE && width >= LARGE_SCREEN_SIZE) {
      return "width: 1018px; ";
    } else {
      return "width: 742px; ";
    }
  }};
`;

export const CharacterWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 30.16%;
  margin: 0;
`;

export const CharacterContainer = styled.div<ImageProps>`
  ${({ size, width, height }): string => {
    if (size === "mini") {
      if (width <= SMALL_SCREEN_SIZE) {
        return `zoom: 0.1;
        -moz-transform: scale(0.1);
        -moz-transform-origin: 0 0;
        `;
      }
      if (width >= EXTRA_LARGE_SCREEN_SIZE && width >= LARGE_SCREEN_SIZE) {
        return `zoom: 0.055;
        -moz-transform: scale(0.055);
        -moz-transform-origin: 0 0;
        `;
      }
      return `zoom:0.075;
      -moz-transform: scale(0.1);
      -moz-transform-origin: 0 0;
      `;
    } else if (size === "medium") {
      if (width <= SMALL_SCREEN_SIZE) {
        return `zoom: 0.42;
        -moz-transform: scale(0.42);
        -moz-transform-origin: 0 0;
        `;
      }
      if (width <= MEDIUM_SCREEN_SIZE && width >= SMALL_SCREEN_SIZE) {
        return `zoom: 0.304;
        -moz-transform: scale(0.304);
        -moz-transform-origin: 0 0;
        `;
      }
      if (width <= LARGE_SCREEN_SIZE && width >= MEDIUM_SCREEN_SIZE) {
        return `zoom: 0.295;
        -moz-transform: scale(0.295);
        -moz-transform-origin: 0 0;
        `;
      }
      if (width >= EXTRA_LARGE_SCREEN_SIZE && width >= LARGE_SCREEN_SIZE) {
        return `zoom: 0.222;
        -moz-transform: scale(0.222);
        -moz-transform-origin: 0 0;
        `;
      } else {
        return `zoom: 0.304;
        -moz-transform: scale(0.304);
        -moz-transform-origin: 0 0;
        `;
      }
    } else if (size === "half") {
      return `zoom: 0.5;
      -moz-transform: scale(0.5);
      -moz-transform-origin: 0 0;
      `;
    } else if (size === "normal") {
      return `width: ${width * 0.4}px; height: ${height}px;`;
    } else if (size === "large") {
      return `zoom: 1.6;
      -moz-transform: scale(1.6);
      -moz-transform-origin: 0 0;
      `;
    } else if (size === "extraLarge") {
      return `
      zoom: 1.8;
      -moz-transform: scale(1.8);
      -moz-transform-origin: 0 0;
      `;
    } else {
      return `width: ${width * 0.4}px; height: ${height}px;`;
    }
  }};
  ${({ size, isClothing }) =>
    size === "extraLarge" && !isClothing
      ? css`
          animation: ${zoomIn} 5s ease-out 1 forwards;
        `
      : css``};
  ${({ size, isClothing }) =>
    size === "extraLarge" && isClothing
      ? css`
          animation: ${zoomClothing} 5s ease-out 1 forwards;
        `
      : css``};
`;

export const ItemIcon = styled.img<ImageProps>`
  position: absolute;
  top: 0;
  left: 0;
  ${({ zIndex }): string => `z-index: ${zIndex || zIndexProps.background};`};
  ${({ height }): string => `height: ${height}px;`};
  ${({ width }): string => {
    if (width <= SMALL_SCREEN_SIZE) {
      return "width: 600px;";
    }
    if (width <= MEDIUM_SCREEN_SIZE && width >= SMALL_SCREEN_SIZE) {
      return "width: 742px; ";
    }
    if (width <= LARGE_SCREEN_SIZE && width >= MEDIUM_SCREEN_SIZE) {
      return "width: 764px; ";
    }
    if (width >= EXTRA_LARGE_SCREEN_SIZE && width >= LARGE_SCREEN_SIZE) {
      return "width: 1018px; ";
    } else {
      return "width: 742px; ";
    }
  }};
`;
