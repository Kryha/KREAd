import styled from "@emotion/styled";

import { color, margins } from "../../design";
import { Img } from "../atoms";
import { CharacterWrapper } from "../base-character/styles";

export const Line = styled.div`
  border: 0.5px solid ${color.darkGrey};
  transform: rotate(-90deg);
  width: 23px;
`;

export const Product = styled.div`
  width: 402px;
  min-width: 402px;
  background: ${color.white};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
  box-shadow: none;
  padding-top: ${margins.medium};
  align-items: center;
  min-height: 485px;
  cursor: pointer;
  :hover {
    border: 1px solid ${color.black};
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 354px;
  height: 320px;
  box-sizing: border-box;
  border-radius: ${margins.medium};
  margin-bottom: ${margins.medium};
  overflow: hidden;
  position: relative;
  ${CharacterWrapper} {
    left: 20%;
    right: 0;
  }
`;

export const Content = styled.div`
  padding: 0 ${margins.medium} ${margins.medium} ${margins.medium};
`;

export const TitleWrapper = styled.div`
  width: 354px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 54px;
`;

export const OwnedByContainer = styled.div`
  margin-top: ${margins.mini};
`;

export const Footer = styled.div`
  margin-top: ${margins.small};
  display: flex;
  align-items: space-between;
  justify-content: space-between;
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: ${margins.small};
  width: 235px;
  overflow-x: scroll;
`;

interface ImageProps {
  category?: string;
}

/* eslint-disable indent */
export const ItemImage = styled(Img) <ImageProps>`
  ${({ category }): string => {
    switch (category) {
      case "hair":
        return "width: 1000px; height: 400px; margin-top: 110px;";
      case "head piece":
        return "width: 1200px; height: 1200px; margin-left: -240px; margin-top: -70px;";
      case "clothing":
        return "width: 600px; height: 600px; margin-left: -25px; margin-top: -290px;";
      case "mask":
        return "width: 1200px; height: 1200px; margin-left: -256px; margin-top: -406px;";
      case "noseline":
        return "width: 1500px; height: 1500px; margin-left: -350px; margin-top: -310px;";
      case "air resevoir":
        return "width: 900px; height: 900px; margin-left: -140px; margin-top: -300px;";
      case "liquid":
        return "width: 1200px; height: 1200px; margin-left: -250px; margin-top: -400px;";
      case "front mask":
        return "width: 1400px; height: 1400px; margin-left: -320px; margin-top: -600px;";
      default:
        return "width: 354px; height: 320px;";
    }
  }};
`;

export const Element = styled.div`
  width: 345px;
  height: 320px;
  border: 1px solid ${color.grey};
  border-radius: ${margins.medium};
  overflow: hidden;
`;
