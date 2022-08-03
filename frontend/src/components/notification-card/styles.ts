import styled from "@emotion/styled";
import { TickIcon } from "../../assets";

import { color, margins } from "../../design";
import { fadeUp, SecondaryButton } from "../atoms";
import { HeaderHorizontalDivider } from "../atoms/lines";

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
   animation: ${fadeUp} 1.2s ease-out 0s forwards;
   opacity: 0;
   transform: translate3d(0, 1rem, 0);
`;

export const NotificationHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  gap: ${margins.medium};
  width: 100%;
  margin-bottom: 16px;
`;

export const NotificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: ${margins.medium};
  margin: 0px ${margins.big} ${margins.big} ${margins.big};
`;

export const InfoWrapper = styled.div`
  width: 100%;
  min-height: 70px;
  max-height: 70px;
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
  padding: ${margins.big} ${margins.big} ${margins.big} ${margins.big};
  position: sticky;
  top: 0;
  background-color: ${color.white};
`;

export const NotificationItemContainer = styled.div`
  width: 100%;
  border-bottom: 1px solid ${color.grey};
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
