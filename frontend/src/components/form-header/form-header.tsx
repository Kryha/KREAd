import { FC } from "react";
import {useNavigate,  } from "react-router-dom";
import { text } from "../../assets";
import { CONFIRMATION_STEP, INFORMATION_STEP, PAYMENT_STEP } from "../../constants";
import { routes } from "../../navigation";
import { MenuText } from "../atoms";
import { FormTab } from "../form-tab";
import {  ArrowContainer, Close, Divider, FormNavigation, HeaderContainer, NavigationTab } from "./styles";

interface NavigationTabProps {
  changeStep: (step: number) => void;
  currentStep: number;
}

export const FormHeader: FC<NavigationTabProps> = ({ currentStep, changeStep }) => {
  const navigate = useNavigate();

  return (
    <>
      <HeaderContainer>
        <MenuText>{text.mint.mintNewCharacter}</MenuText>
        <Divider />
        <ArrowContainer>
          <Close onClick={() => navigate(routes.root)} />
        </ArrowContainer>
      </HeaderContainer>
      <FormNavigation>
        <NavigationTab onClick={() => changeStep(INFORMATION_STEP)}>
          <FormTab active={currentStep === INFORMATION_STEP} title={text.mint.information} />
        </NavigationTab>
        <NavigationTab onClick={() => changeStep(PAYMENT_STEP)}>
          <FormTab active={currentStep === PAYMENT_STEP} title={text.mint.payment} />
        </NavigationTab>
        <NavigationTab onClick={() => changeStep(CONFIRMATION_STEP)}>
          <FormTab active={currentStep === CONFIRMATION_STEP} title={text.mint.confirmation} />
        </NavigationTab>
      </FormNavigation>
    </>
  );
};
