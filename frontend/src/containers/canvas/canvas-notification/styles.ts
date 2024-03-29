import styled from "@emotion/styled";
import { HeaderHorizontalDivider, NavigationTitle } from "../../../components";
import { color, margins } from "../../../design";
import { CloseIcon, TickIcon } from "../../../assets";

export const ToastContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${margins.medium};
  width: 100%;
`;

export const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${margins.medium};
`;
export const ToastContainer = styled.div`
  display: flex;
  flex-direction: column;
  top: 50%;
  z-index: 10000;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  height: fit-content;
  padding: ${margins.medium} ${margins.medium} ${margins.medium} 32px;
  gap: ${margins.medium};
  background: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
`;

export const ToastHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${margins.medium};
`;

export const ToastActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const Tick = styled(TickIcon)`
  margin: 0;
  width: 9px;
  height: 6px;
`;

export const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  border: 1px solid ${color.black};
`;

export const ToastTitle = styled(NavigationTitle)``;

export const Divider = styled(HeaderHorizontalDivider)`
  transform: rotate(90deg);
  width: ${margins.big};
`;

export const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  border-radius: ${margins.medium};
  margin-left: 46px;
  margin-right: 14px;
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
