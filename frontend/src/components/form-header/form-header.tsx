import { FC } from "react";
import {useNavigate,  } from "react-router-dom";
import { text } from "../../assets";
import { CONFIRMATION_STEP, INFORMATION_STEP, PAYMENT_STEP } from "../../constants";
import { routes } from "../../navigation";
import { MenuText } from "../atoms";
import { FormTab } from "../form-tab";
import {  ArrowContainer, Close, Divider, FormNavigation, HeaderContainer, NavigationTab, ReturnContainer } from "./styles";

interface NavigationTabProps {
  currentStep: number;
  title: string;
  isBuyFlow?: boolean;
  link: string;
}

export const FormHeader: FC<NavigationTabProps> = ({ currentStep, title, isBuyFlow = false, link }) => {
  const navigate = useNavigate();

  return (
    <>
      <HeaderContainer>
        <MenuText>{title}</MenuText>
        <ReturnContainer>
          <Divider />
          <ArrowContainer>
            <Close onClick={() => navigate(link)} />
          </ArrowContainer>
        </ReturnContainer>
      </HeaderContainer>
      <FormNavigation>
        {Boolean(!isBuyFlow) && (
          <NavigationTab>
            <FormTab active={currentStep === INFORMATION_STEP} title={text.mint.information} />
          </NavigationTab>
        )}
        <NavigationTab>
          <FormTab active={currentStep === PAYMENT_STEP} title={text.mint.payment} />
        </NavigationTab>
        <NavigationTab>
          <FormTab active={currentStep === CONFIRMATION_STEP} title={text.mint.confirmation} />
        </NavigationTab>
      </FormNavigation>
    </>
  );
};
