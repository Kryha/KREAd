import styled from "@emotion/styled";
import { CloseIcon, ExclamationIcon, TickIcon } from "../../assets";
import { breakpoints, color, margins } from "../../design";
import { HeaderHorizontalDivider, NavigationTitle } from "../atoms";

export const ToastContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: ${margins.medium};
  gap: ${margins.medium};
  background: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
  bottom: ${margins.big};
  z-index: 10000;
  width: 100%;
  position: absolute;
  left: 40px;
  height: fit-content;
  @media screen and (max-width: ${breakpoints.tablet}) {
    padding: ${margins.small};
    margin-left: ${margins.mini};
    margin-right: ${margins.mini};
    gap: ${margins.small};
    top: 50%;
    left: 50%;
  }
`;

export const Tick = styled(TickIcon)`
  margin: 0;
  width: 9px;
  height: 6px;
`;

export const Exclamation = styled(ExclamationIcon)`
  width: 2px;
  height: 8px;
  margin: 0;
`;

export const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${margins.nano};
  border-radius: 50%;
  width: 18px;
  height: 18px;
  border: 1px solid ${color.black};
  min-width: 18px;
`;

export const ToastTitle = styled(NavigationTitle)``;

export const Divider = styled(HeaderHorizontalDivider)`
  transform: rotate(90deg);
  width: ${margins.medium};
`;

export const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-radius: ${margins.medium};
`;

export const NotificationItemCardContainer = styled.div`
  display: flex;
  transition: transform 0.3s ease; /* Add CSS transition for smooth animation */
  border-radius: ${margins.medium};
  border: 1px solid ${color.grey};
  width: 100%;
`;

export const Close = styled(CloseIcon)`
  width: ${margins.small};
  height: ${margins.small};
  cursor: pointer;
`;
export const ReturnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 4px;
`;

export const DividerContainer = styled.div``;

interface NotificationProps {
  showNotification: boolean;
}

export const NotificationWrapper = styled.div<NotificationProps>`
  ${ToastContainer} {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    z-index: 1002;
    bottom: 40px;
  }
  ${({ showNotification }): string => {
    return showNotification
      ? ""
      : `
        display: none;
      `;
  }};
`;
