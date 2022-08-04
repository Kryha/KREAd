import styled from "@emotion/styled";

import { ArrowUpRightIcon } from "../../../assets";
import { ButtonText, HeaderHorizontalDivider, MenuItemName, PrimaryButton } from "../../../components";
import { color, fontWeight, margins } from "../../../design";

export const EquippedLabel = styled(ButtonText)``;

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
  width: 100%;
`;

export const EmptyInfo = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 15px;
  border-radius: ${margins.medium};
  border: 1px solid transparent;
  background-color: ${color.lightGrey};
`;

interface InfoProps {
  selected?: boolean;
}

export const Info = styled(EmptyInfo) <InfoProps>`
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
    ${EquippedLabel} {
      display: none;
    }
  }
  :not(:hover) {
    ${RedirectArrow} {
      display: none;
    }
    ${PrimaryButton} {
      display: none;
    }
  }
`;

export const InlineDetails = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${margins.nano};
`;

export const Divider = styled(HeaderHorizontalDivider)`
  width: ${margins.small};
  margin: 0px 12px;
`;

export const LevelLabel = styled.p`
  font-size: 12px;
  font-weight: ${fontWeight.medium};
`;

export const InfoTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
