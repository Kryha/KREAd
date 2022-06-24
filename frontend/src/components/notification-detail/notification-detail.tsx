import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { ButtonText, SecondaryButton } from "../atoms";

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
  ToastTitle
} from "./styles";

interface NotificationDetailProps {
  isError?: boolean;
  title: string;
  info: string;
  closeToast: () => void;
  buttonTitle?: string;
}

export const NotificationDetail: FC<NotificationDetailProps> = ({ isError, title, info, closeToast, buttonTitle }) => {
  const navigate = useNavigate();

  return(
    <ToastContainer>
      <IconContainer>
        {isError ? <Exclamation /> : <Tick />}
      </IconContainer>
      <InfoContainer>
        <ToastTitle>{title}</ToastTitle>
        <ButtonText>{info}</ButtonText>
      </InfoContainer>
      {buttonTitle && (
        <SecondaryButton onClick={() => navigate(routes.shop)}>{buttonTitle}</SecondaryButton>
      )}
      <DividerContainer>
        <ReturnContainer>
          <Divider />
          <ArrowContainer>
            <Close onClick={() => closeToast()} />
          </ArrowContainer>
        </ReturnContainer>
      </DividerContainer>
    </ToastContainer>
  );
};
