import styled from "styled-components";
import { margins, color } from "../../design";
import { Img, Label, MenuItemName } from "../atoms";

export const EquippedLabel = styled(Label)``;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 0px;
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

// export const InventoryItem = styled.img`
//   position: absolute;
// `;

// export const FilledInventoryItem = styled.img`
//   position: absolute;
// `;
export const MenuItemWrapper = styled.div``;

export const Divider = styled.div`
  width: 48px;
  border: 1px solid #d0d0d0;
  transform: rotate(90deg);
`;

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
  ${({ selected }) =>
    selected &&
    `
    background-color: ${color.lightGrey};
    border: 1px solid ${color.darkGrey};
    `};
  :hover {
    border: 1px solid ${color.darkGrey};
    ${EquippedLabel} {
      display: none;
    }
    ${InfoContainer} {
      margin-right: 0px;
    }
    ${ButtonContainer} {
      margin-left: -30px;
    }
  }
  :not(:hover) {
    ${ButtonContainer} {
      display: none;
    }
  }
`;

export const ImageCard = styled.div`
  box-sizing: border-box;
  border-radius: ${margins.medium};
  width: 80px;
  height: 80px;
`;

interface ImageProps {
  category?: string;
}

// TODO: use square images for slot thumbnails
/* eslint-disable indent */
export const ItemImage = styled(Img)<ImageProps>`
  ${({ category }): string => {
    switch (category) {
      case "hair":
        return "width: 80px; height: 110px; margin-left: 10px;";
      case "head piece":
        return "width: 130px; height: 130px; margin-left: -20px; margin-top: -30px;";
      case "clothing":
        return "width: 80px; height: 140px; margin-left: 10px; margin-top: -80px;";
      case "mask":
        return "width: 190px; height: 190px; margin-left: -40px; margin-top: -100px;";
      case "noseline":
        return "width: 350px; height: 250px; margin-left: -120px; margin-top: -150px;";
      case "air resevoir":
        return "width: 130px; height: 130px; margin-left: -10px; margin-top: -60px;";
      case "liquid":
        return "width: 250px; height: 250px; margin-left: -70px; margin-top: -155px;";
      case "front mask":
        return "width: 270px; height: 270px; margin-left: -80px; margin-top: -175px;";
      default:
        return "width: 80px; height: 80px;";
    }
  }};
`;
