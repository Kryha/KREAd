import styled from "@emotion/styled";
import { TickIcon } from "../../assets";

import { color, fontWeight, margins } from "../../design";
import { NavigationTitle, SecondaryButton } from "../atoms";
import { HeaderHorizontalDivider, HorizontalDivider } from "../atoms/lines";

export const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${margins.mini};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
`;

interface NotificationProps {
  width: number;
  height: number;
}

export const NotificationWrapper = styled.div<NotificationProps>`
  background: ${color.white};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
  box-shadow: none;
  right: ${margins.big};
  top: 101px;
  position: absolute;
  z-index: 10000;
  ${({ height }): string =>
    `
      width: 45%;
      max-height: ${height - 140}px;
   `};
   overflow-y: scroll;
`;

export const NotificationHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  gap: ${margins.medium};
  width: 100%;
`;

export const NotificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: ${margins.medium};
  margin: ${margins.big};
`;

export const InfoWrapper = styled.div`
  width: 100%;
  :not(:hover) {
    ${SecondaryButton} {
      display: none;
    }
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: ${margins.medium};
`;

export const Divider = styled(HeaderHorizontalDivider)`
  transform: rotate(90deg);
  width: ${margins.big};
`;

export const NotificationContent = styled.div`
  padding: ${margins.big} ${margins.big} 0px ${margins.big};
`;

export const NotificationItemContainer = styled.div`
  width: 100%;
`;

export const CardActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  margin-right: 30px;
  margin-bottom: 30px;
  box-shadow: none;
`;

export const Tick = styled(TickIcon)`
  margin: 0px;
  width: 9px;
  height: 6px;
`;

export const TickContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${margins.nano};
  border-radius: 50%;
  width: 18px;
  height: 18px;
  border: 1px solid ${color.black};
  margin-bottom: ${margins.small};
`;

export const BodyMessage = styled(NavigationTitle)`
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.light};
  text-transform: capitalize;
`;

export const BoldText = styled(NavigationTitle)`
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.medium};
`;
export const BodyText = styled(NavigationTitle)`
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.light};
`;

export const Content = styled.div`
  width: 100%;
  ${BodyText} {
    display: inline;
    margin: 0px 3px;
  }
  ${BoldText} {
    display: inline;
  }
  ${BodyMessage} {
    display: inline;
    margin: 0px 3px 0px 0px;
  }
  ${HorizontalDivider} {
    margin-top: ${margins.medium};
  }
  ${SecondaryButton} {
    min-width: 95px;
  }
`;

export const MessageContainer = styled.div``;
