import { FC } from "react";

import { text } from "../../assets";
import {
  BUY_FLOW_STEPS,
  CONFIRMATION_STEP,
  PAYMENT_STEP,
  SELL_FLOW_STEPS,
} from "../../constants";
import { FormHeaderClose } from "../form-header-close";
import { FormTab } from "../form-tab";
import { FormNavigation, NavigationTab } from "./styles";

interface NavigationTabProps {
  currentStep: number;
  stepAmount: number;
  title: string;
  isPaymentFlow?: boolean;
  link: string;
}

export const FormHeader: FC<NavigationTabProps> = ({
  currentStep,
  title,
  isBuyFlow = false,
  link,
}) => {
  return (
    <>
      <FormHeaderClose title={title} link={link} />
      <FormNavigation>
        {stepAmount == INFORMATION_STEP_INCLUDED && (
          <NavigationTab>
            <FormTab active title={text.mint.information} amount={stepAmount} />
          </NavigationTab>
        )}
        <NavigationTab>
          <FormTab
            active={currentStep >= WALLET_INTERACTION_STEP}
            title={isPaymentFlow ? text.mint.payment : text.store.placeInShop}
            amount={stepAmount}
          />
        </NavigationTab>
        <NavigationTab>
          <FormTab active={currentStep >= CONFIRMATION_STEP} title={text.mint.confirmation} amount={stepAmount} />
        </NavigationTab>
      </FormNavigation>
    </>
  );
};
