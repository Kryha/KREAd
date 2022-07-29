import styled from "@emotion/styled";

import { margins } from "../../design";
import { disappear, fadeIn, SecondaryButton } from "../atoms";
import { zIndex as zIndexProps } from "../../design/spacing";
import { EXTRA_LARGE_SCREEN_SIZE, LARGE_SCREEN_SIZE, MEDIUM_SCREEN_SIZE, SMALL_SCREEN_SIZE } from "../../constants";

interface ImageProps {
  width: number;
  height: number;
  zIndex?: number;
}

interface ViewProps {
  width: number;
}

export const ExpandButton = styled(SecondaryButton) <ViewProps>`
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
  position: absolute;
  top: 0;
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
    }
    else {
      return "width: 742px; ";
    }
  }};
`;

export const CharacterWrapper = styled.div`
  position: absolute;
  right: 15%;
  top: 0;
  margin: 0;
  pointer-events: none;
`;

export const CharacterContainer = styled.div<ImageProps>`
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
    }
    else {
      return "width: 742px;";
    }
  }};
`;

export const FirstIcon = styled.img<ImageProps>`
  position: absolute;
  top: 0;
  left: 0;
  ${({ zIndex }): string => `z-index: ${zIndex || zIndexProps.mid};`};
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
    }
    else {
      return "width: 742px; ";
    }
  }};
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.3s, 0.2s;
  animation-delay: 0s, 0.3s;
`;

export const SecondIcon = styled(FirstIcon)`
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.6s, 0.2s;
  animation-delay: 0s, 0.6s;
`;

export const ThirdIcon = styled(FirstIcon)`
  animation: ${disappear}, ${fadeIn};
  animation-duration: 1.1s, 0.2s;
  animation-delay: 0s, 1.1s;
`;

export const FourthIcon = styled(FirstIcon)`
  animation: ${disappear}, ${fadeIn};
  animation-duration: 1.4s, 0.2s;
  animation-delay: 0s, 1.4s;
`;

export const FifthIcon = styled(FirstIcon)`
  animation: ${disappear}, ${fadeIn};
  animation-duration: 1.7s, 0.2s;
  animation-delay: 0s, 1.7s;
`;
