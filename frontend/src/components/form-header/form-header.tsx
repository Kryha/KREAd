import { FC } from "react";

import { text } from "../../assets";
import { BUY_FLOW_STEPS, CONFIRMATION_STEP, PAYMENT_STEP, SELL_FLOW_STEPS } from "../../constants";
import { FormHeaderClose } from "../form-header-close";
import { FormTab } from "../form-tab";
import { FormNavigation, NavigationTab } from "./styles";

interface NavigationTabProps {
  currentStep: number;
  title: string;
  isBuyFlow?: boolean;
  link: string;
}

export const FormHeader: FC<NavigationTabProps> = ({ currentStep, title, isBuyFlow = false, link }) => {
  return (
    <>
      <FormHeaderClose title={title} link={link} />
      <FormNavigation>
        {!isBuyFlow && (
          <NavigationTab>
            <FormTab active={true} title={text.mint.information} amount={BUY_FLOW_STEPS} />
          </NavigationTab>
        )}
        <NavigationTab>
          <FormTab active={currentStep >= PAYMENT_STEP} title={text.mint.payment} amount={isBuyFlow ? SELL_FLOW_STEPS : BUY_FLOW_STEPS} />
        </NavigationTab>
        <NavigationTab>
          <FormTab
            active={currentStep >= CONFIRMATION_STEP}
            title={text.mint.confirmation}
            amount={isBuyFlow ? SELL_FLOW_STEPS : BUY_FLOW_STEPS}
          />
        </NavigationTab>
      </FormNavigation>
    </>
  );
};
