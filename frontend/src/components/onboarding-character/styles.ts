import styled from "@emotion/styled";

import { breakpoints, margins } from "../../design";
import { CharacterImgs, SecondaryButton, sequentialFadeIn, zoomClothing, zoomIn } from "../atoms";
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
    margin-left: 0;
  }
`;

export const CharacterIcon = styled(CharacterImgs)`
  position: absolute;
  top: 0;
  ${({ zIndex }): string => `z-index: ${zIndex || zIndexProps.character};`};
`;

export const CharacterWrapper = styled.div<ImageProps>`
  position: absolute;
  right: 0;
  top: 0;
  margin: 0;
  pointer-events: none;
  ${({ isZoomed }) =>
    isZoomed
      ? css`
          right: -45%;
        `
      : css`
          right: 0;
        `};
`;

export const CharacterContainer = styled.div<ImageProps>`
  ${({ size, width, height }): string => {
    if (size === "mini") {
      if (width <= SMALL_SCREEN_SIZE) {
        return `zoom: 0.18;
        -moz-transform: scale(0.18);
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
        return `zoom: 0.36;
        -moz-transform: scale(0.36);
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
      return `zoom: 2.5;
      -moz-transform: scale(2.5);
      -moz-transform-origin: 0 0;
       transform: translateY(-40vh);

      `;
    } else if (size === "extraLarge") {
      return `
      zoom: 2.5;
      -moz-transform: scale(2.5);
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

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: 100%;
  }
`;

export const CharacterSwitchIcon = styled(CharacterImgs)`
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 1.5s;
`;
export const FirstIcon = styled(CharacterImgs)`
  position: absolute;
  top: 0;
  left: 0;
  ${({ zIndex }): string => `z-index: ${zIndex || zIndexProps.mid};`};
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 500ms;
`;

export const SecondIcon = styled(FirstIcon)`
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 1s;
`;

export const ThirdIcon = styled(FirstIcon)`
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 1.5s;
`;

export const FourthIcon = styled(FirstIcon)`
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 2s;
`;

export const FifthIcon = styled(FirstIcon)`
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 2.5s;
`;