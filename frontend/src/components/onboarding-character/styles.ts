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
    }
    else {
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
  ${({ zIndex }): string => `z-index: ${zIndex || zIndexProps.forground};`};
  ${({ height }): string => `height: ${height}px;`};
  ${({ width }): string => {
    if (width <= SMALL_SCREEN_SIZE) {
      return "width: 542.82px;";
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
  right: 358px;
  top: 0;
  margin: 0;
`;

export const CharacterContainer = styled.div<ImageProps>`
  ${({ width, height }): string => {
    return `width: ${width * 0.4}px; height: ${height}px;`;
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
      return "width: 542.82px;";
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
  animation-duration: 1.0s, 0.6s;
  animation-delay: 0s, 1.0s;
`;

export const SecondIcon = styled(FirstIcon)`
  animation: ${disappear}, ${fadeIn};
  animation-duration: 2.5s, 0.6s;
  animation-delay: 0s, 2.5s;
`;

export const ThirdIcon = styled(FirstIcon)`
  animation: ${disappear}, ${fadeIn};
  animation-duration: 4.5s, 0.6s;
  animation-delay: 0s, 4.5s;
`;

export const FourthIcon = styled(FirstIcon)`
  animation: ${disappear}, ${fadeIn};
  animation-duration: 6.5s, 0.6s;
  animation-delay: 0s, 6.5s;
`;

export const FifthIcon = styled(FirstIcon)`
  animation: ${disappear}, ${fadeIn};
  animation-duration: 8.5s, 0.6s;
  animation-delay: 0s, 8.5s;
`;
