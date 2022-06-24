import styled from "@emotion/styled";
import { margins, color } from "../../design";
import { BoldLabel, MenuItemName } from "../atoms";
import { CharacterWrapper, ExpandButton } from "../base-character/styles";

export const EquippedLabel = styled(BoldLabel)``;

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
  width: 100%;
`;

export const MenuItemWrapper = styled.div``;

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

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 80px;
  height: 80px;
  box-sizing: border-box;
  border-radius: ${margins.medium};
  margin-bottom: ${margins.medium};
  position: relative;
  ${CharacterWrapper} {
    left: 20%;
    right: 0;
  }
  ${ExpandButton} {
    display: none;
  }
`;

export const InlineDetails = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${margins.nano};
`;

export const Divider = styled.div`
  height: 0px;
  width: 24px;
  border: 0.5px solid #d0d0d0;
  transform: rotate(90deg);
`;
