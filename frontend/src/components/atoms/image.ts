import styled from "styled-components";

import { imageSize } from "../../design/image";

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
  object-fit: cover;
`;
