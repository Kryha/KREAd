import styled from "styled-components";
import { ArrowUpRightIcon } from "../../../assets";

import { Img, MenuItemName, OutlinedButton } from "../../../components";
import { color, fontWeight, margins } from "../../../design";

export const ListContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  overflow-y: scroll;
  padding-top: ${margins.medium};
  gap: ${margins.small};
`;

export const IdLabel = styled.p`
  font-size: 12px;
  font-weight: ${fontWeight.medium};
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  margin: 0px 0px 0px ${margins.medium};
  width: 551px;
`;

export const MenuItemWrapper = styled.div``;

export const RedirectArrow = styled(ArrowUpRightIcon)``;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  margin-right: ${margins.medium};
  ${MenuItemName} {
    margin-bottom: ${margins.nano};
  }
`;

interface InfoProps {
  selected: boolean;
}

export const Info = styled.div<InfoProps>`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: ${margins.medium};
  border: 1px solid transparent;
  background-color: ${color.lightGrey};
  ${({ selected }) =>
    selected &&
    `
    border: 1px solid ${color.darkGrey};
    `};
  :hover {
    border: 1px solid ${color.darkGrey};
    background-color: ${color.white};
    ${IdLabel} {
      display: none;
    }
  }
  :not(:hover) {
    ${RedirectArrow} {
      display: none;
    }
  }
`;

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

export const InlineDetails = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${margins.nano};
`;

export const Divider = styled.div`
  height: 0px;
  width: 24px;
  border: 1px solid #d0d0d0;
  transform: rotate(90deg);
`;

export const LevelLabel = styled.p`
  font-size: 12px;
  font-weight: ${fontWeight.medium};
`;

export const CategoryButton = styled(OutlinedButton)`
  color: ${color.darkGrey};
  padding: 3px 8px;
  cursor: default;
`;
