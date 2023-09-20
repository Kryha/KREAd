import styled from "@emotion/styled";
import { EXTRA_LARGE_SCREEN_SIZE, LARGE_SCREEN_SIZE, MEDIUM_SCREEN_SIZE, SMALL_SCREEN_SIZE } from "../../constants";

import { imageSize } from "../../design";

export interface ImageProps {
  src?: string;
  width?: string;
  height?: string;
  marginTop?: string | undefined;
  marginLeft?: string | undefined;
  marginRight?: string | undefined;
  marginBottom?: string | undefined;
}

export const Img = styled.img<ImageProps>`
  width: ${(props): string => props.width || imageSize.extraSmall};
  height: ${(props): string => props.height || imageSize.extraSmall};
  margin-top: ${(props): string => props.marginTop || "0px"};
  margin-bottom: ${(props): string => props.marginBottom || "0px"};
  margin-right: ${(props): string => props.marginRight || "0px"};
  margin-left: ${(props): string => props.marginLeft || "0px"};
  object-fit: contain;
`;

export interface CharacterImageProps {
  width: number;
  height: number;
  zIndex?: number;
  src?: string;
}

export const CharacterImgs = styled.img<CharacterImageProps>`
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
