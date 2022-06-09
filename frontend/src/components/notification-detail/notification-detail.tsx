import { FC } from "react";
import { ButtonText } from "../atoms";

import {
  ArrowContainer,
  Close,
  Divider,
  Exclamation,
  IconContainer,
  ReturnContainer,
  Tick,
  ToastContainer,
  ToastTitle
} from "./styles";

interface NotificationDetailProps {
  error?: boolean;
  title: string;
  info: string;
  closeToast: () => void;
}

export const NotificationDetail: FC<NotificationDetailProps> = ({ error, title, info, closeToast }) => {
  return(
    <ToastContainer>
      <IconContainer>
        {error ? <Exclamation /> : <Tick />}
      </IconContainer>
      <ToastTitle>{title}</ToastTitle>
      <ButtonText>{info}</ButtonText>
      <ReturnContainer>
        <Divider />
        <ArrowContainer>
          <Close onClick={() => closeToast()} />
        </ArrowContainer>
      </ReturnContainer>
    </ToastContainer>
  );
};
