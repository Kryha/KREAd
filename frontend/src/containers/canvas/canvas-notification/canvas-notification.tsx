import { FC } from "react";
import { ButtonText } from "../../../components";

import {
  ArrowContainer,
  Close,
  Divider,
  DividerContainer,
  Exclamation,
  IconContainer,
  InfoContainer,
  ReturnContainer,
  Tick,
  ToastContainer,
  ToastContent,
  ToastHeader,
  ToastTitle,
} from "./styles";

interface NotificationDetailProps {
  isError?: boolean;
  title: string;
  info: string;
  closeToast: () => void;
  buttonTitle?: string;
  children?: React.ReactNode;
}

export const CanvasNotification: FC<NotificationDetailProps> = ({ isError, title, info, closeToast, children }) => {
  return (
    <ToastContainer>
      <ToastHeader>
        <IconContainer>{isError ? <Exclamation /> : <Tick />}</IconContainer>
        <InfoContainer>
          <ToastTitle>{title}</ToastTitle>
          <ButtonText>{info}</ButtonText>
        </InfoContainer>
        <DividerContainer>
          <ReturnContainer>
            <Divider />
            <ArrowContainer>
              <Close onClick={() => closeToast()} />
            </ArrowContainer>
          </ReturnContainer>
        </DividerContainer>
      </ToastHeader>
      <ToastContent>{children}</ToastContent>
    </ToastContainer>
  );
};
