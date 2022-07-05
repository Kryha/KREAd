import styled from "@emotion/styled";
import { EXTRA_LARGE_SCREEN_SIZE, LARGE_SCREEN_SIZE } from "../../constants";

import { color, margins } from "../../design";
import { Img, PrimaryButton, TitleText } from "../atoms";
import { CharacterWrapper } from "../base-character/styles";

export const Line = styled.div`
  border: 0.5px solid ${color.darkGrey};
  transform: rotate(-90deg);
  width: 23px;
`;

interface ViewProps {
  width: number;
  height: number;
}

export const Product = styled.div<ViewProps>`
  min-width: 402px;
  background: ${color.white};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
  box-shadow: none;
  padding-top: ${margins.medium};
  align-items: center;
  min-height: 525px;
  cursor: pointer;
  :hover {
    border: 1px solid ${color.black};
  }
  flex: 1 0 500px;
  box-sizing: border-box;
  ${({ width }): string => {
    if (width <= 1300) {
      return "flex: 0 1 calc(49.6% - 1em);";
    }
    else if (width >= 1300 && width <= LARGE_SCREEN_SIZE) {
      return "flex: 0 1 calc(32.4% - 1em);";
    }
    else if (width >= LARGE_SCREEN_SIZE && width <= EXTRA_LARGE_SCREEN_SIZE) {
      return "flex: 0 1 calc(24.41% - 1em);";
    }
    else {
      return "flex: 1 0 500px;";
    }
  }
  }
  :not(:hover) {
    ${PrimaryButton} {
      display: none;
    }
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
  margin: 0 auto;
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
  margin-top: 24px;
  ${TitleText} {
    font-weight: 500;
  }
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
  height: 320px;
  border-radius: ${margins.medium};
  overflow: hidden;
`;
