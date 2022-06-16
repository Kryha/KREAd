import styled from "@emotion/styled";

import { color, margins } from "../../design";
import { BoldLabel, MenuItemName } from "../atoms";
import { CharacterWrapper } from "../base-character/styles";

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

export const EquippedLabel = styled(BoldLabel)`
  display: flex;
  justify-content: space-between;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 0px;
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
  padding: 8px 8px;
  cursor: pointer;
  border-radius: ${margins.medium};
  border: 1px solid transparent;
  margin-bottom: ${margins.small};
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
  width: 80px;
  height: 80px;
  min-width: 80px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${margins.small};
  ${CharacterWrapper} {
    left: 15px;
  }
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0px;
  z-index: 500;
`;

export const Divider = styled.div`
  width: 48px;
  border: 1px solid #d0d0d0;
  transform: rotate(90deg);
`;

export const Line = styled.div`
  width: ${margins.small};
  border: 0.5px solid ${color.darkGrey};
  height: 1px;
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
