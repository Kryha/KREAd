import styled from "styled-components";
import { margins } from "../../design";
import { Label, MenuItemName } from "../atoms";

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


export const InventoryItem = styled.img`
  position: absolute;
`;

export const FilledInventoryItem = styled.img`
  position: absolute;
`;
export const MenuItemWrapper = styled.div``;

export const Divider = styled.div`
  width: 48px;
  border: 1px solid #D0D0D0;
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
};

export const Info = styled.div<InfoProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  margin: 24px 0px;
  cursor: pointer;
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
      margin-left: -30px;
    }
    ${InfoWrapper} {
      width: 320px;
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
