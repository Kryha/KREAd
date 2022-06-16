import styled from "@emotion/styled";
import { margins, color } from "../../design";
import { Label, MenuItemName } from "../atoms";
import { CharacterWrapper, ExpandButton } from "../base-character/styles";

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
  width: 100%;
`;

export const MenuItemWrapper = styled.div``;

export const Divider = styled.div`
  width: 23px;
  border: 0.5px solid #d0d0d0;
  transform: rotate(90deg);
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${margins.mini};
  padding: 0px;
  margin-right: ${margins.medium};
  ${MenuItemName} {
    margin-bottom: ${margins.nano};
  }
  width: 100%;
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
    ${Label} {
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
  ${ExpandButton} {
    display: none;
  }
`;

export const SubTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: ${margins.small};
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: ${margins.medium};
  justify-content: space-between;
  width: 100%;
`;

export const Dash = styled.div`
  height: 1px;
  border: 0.5px solid ${color.darkGrey};
  width: ${margins.small};
`;
