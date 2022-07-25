import styled from "@emotion/styled";

import { margins } from "../../design";
import { Img } from "../atoms";

export const ImageCard = styled.div`
  position: relative;
  box-sizing: border-box;
  border-radius: ${margins.medium};
  width: 80px;
  height: 80px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface ImageProps {
  category?: string;
}

export const ItemImage = styled(Img) <ImageProps>`
  object-fit: cover;
  width: 100%;
  height: auto;
  width: 80px;
`;
