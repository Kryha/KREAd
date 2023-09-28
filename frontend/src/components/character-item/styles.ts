import styled from "@emotion/styled";

import { color, margins } from "../../design";
import { BoldLabel, MenuItemName } from "../atoms";
import { CharacterWrapper } from "../base-character/styles";

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${margins.mini};
  padding: 0;
  margin-right: ${margins.medium};
  ${MenuItemName} {
    margin-bottom: ${margins.nano};
  }
  width: 100%;
`;

export const EquippedLabel = styled(BoldLabel)``;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${margins.small} 0px;
  margin-right: ${margins.mini};
`;

export const Line = styled.div`
  width: ${margins.small};
  border: 0.5px solid ${color.darkGrey};
  height: 1px;
  margin-left: 4px;
  margin-right: 4px;
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
  }
  :not(:hover) {
    ${ButtonContainer} {
      display: none;
    }
  }
`;

export const ImageCard = styled.div`
  position: relative;
  box-sizing: border-box;
  border-radius: ${margins.medium};
  border: 1px solid ${color.grey};
  width: 120px;
  height: 120px;
  min-width: 120px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${margins.small};
  ${CharacterWrapper} {
    //left: 15px;
  }
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  width: 100%;
  z-index: 500;
`;

export const Divider = styled.div`
  height: 0;
  width: 24px;
  border: 0.5px solid #d0d0d0;
  transform: rotate(90deg);
`;

export const SelectedContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${Line} {
    margin-right: ${margins.mini};
    margin-left: ${margins.mini};
  }
`;

export const SubTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${margins.nano};
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0;
  gap: ${margins.medium};
  justify-content: space-between;
  width: 100%;
`;

export const Dash = styled.div`
  height: 1px;
  border: 0.5px solid ${color.darkGrey};
  width: ${margins.small};
`;
