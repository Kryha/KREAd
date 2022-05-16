import styled from "styled-components";

import { color, margins } from "../../design";
import { Label, MenuItemName } from "../atoms";
import { CharacterWrapper } from "../base-character/styles";

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  width: 200px;
   margin-right: 60px;
  ${MenuItemName} {
    margin-bottom: ${margins.nano};
  }
`;

export const EquippedLabel = styled(Label)``;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 0px;
`;

export const InventoryItem = styled.img`
  position: absolute;
`;

export const FilledInventoryItem = styled.img`
  position: absolute;
`;

interface InfoProps {
  selected: boolean;
};

export const Info = styled.div<InfoProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  ${({ selected }): string => {
    return selected
      ? `
        ${FilledInventoryItem} {

        }
        `
      : `
       ${FilledInventoryItem} {
        display: none;
        }
      `;
  }};
  :not(:hover) {
    ${InventoryItem} {
      display: none;
    }
  }
  :hover {
    ${EquippedLabel} {
      display: none;
    }
    ${InfoContainer} {
      margin-right: 0px;
    }
    ${ButtonContainer} {
      margin-left: -20px;
    }
  }
  :not(:hover) {
    ${ButtonContainer} {
      display: none;
    }
  }
`;


export const CharacterItemWrapper = styled.div`
  cursor: pointer;
`;


export const ImageCard = styled.div`
  background: ${color.gradientLight};
  box-sizing: border-box;
  border-radius: ${margins.medium};
  position: relative;
  height: 96px;
  margin-left: 8px;
margin-top: 16px;
  ${CharacterWrapper}{
    left: 15px;
  }
`;


export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  margin: 0px 104px;
  z-index: 500;
`;

export const ElemantImage = styled.img`
  position: absolute;
`;

export const Divider = styled.div`
  width: 48px;
  border: 1px solid #D0D0D0;
  transform: rotate(90deg);
`;
