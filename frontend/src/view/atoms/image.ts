import styled from "styled-components";

import { imageSize } from "../../design/image";

interface ImageProps {
  width?: string;
  height?: string;
}

export const Img = styled.img<ImageProps>`
  width: ${(props): string => props.width || imageSize.extraSmall};
  height: ${(props): string => props.height || imageSize.extraSmall};
  object-fit: cover;
`;
