import styled from "@emotion/styled";

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
  width: ${(props): string => props.width || "100%"};
  height: ${(props): string => props.height || "100%"};
  margin-top: ${(props): string => props.marginTop || "0px"};
  margin-bottom: ${(props): string => props.marginBottom || "0px"};
  margin-right: ${(props): string => props.marginRight || "0px"};
  margin-left: ${(props): string => props.marginLeft || "0px"};
  object-fit: contain;
`;

export interface CharacterImageProps {
  zIndex?: number;
  src?: string;
}

export const CharacterImgs = styled.img<CharacterImageProps>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: contain;
`;