import styled from "styled-components";

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

// TODO: use square images for slot thumbnails
export const ItemImage = styled(Img)<ImageProps>`
  object-fit: cover;
  width: 100%;
  height: auto;
  ${({ category }): string => {
    switch (category) {
      case "hair":
        return "width: 50px;";
      case "head piece":
        return "width: 170px; margin-top: -20px;";
      case "clothing":
        return "width: 95px; margin-top: -100px;";
      case "mask":
        return "width: 224px; margin-top: -118px;";
      case "noseline":
        return "margin-top: -124px; width: 320px;";
      case "air resevoir":
        return "width: 132px; margin-top: -68px;";
      case "liquid":
        return "width: 240px; margin-top: -132px;";
      case "front mask":
        return "width: 270px; margin-top: -158px;";
      default:
        return "width: 80px; ";
    }
  }};
`;
