import { FC, useState } from "react";

import { ErrorView, FormHeader } from "../../components";
import { BUY_FLOW_STEPS } from "../../constants";
import { FormCard } from "../create-character/styles";
import { BuyForm } from "./buy-form";
import { Confirmation } from "./confirmation";
import { BuyData, BuyStep, BuyText } from "./types";
import { useLocation } from "react-router-dom";
import { routes } from "../../navigation";

interface Props {
  data?: BuyData;
  text: BuyText;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  isOfferAccepted: boolean;
}

export const Buy: FC<Props> = ({ data, text: pText, onSubmit, isLoading, isOfferAccepted }) => {
  const location = useLocation();
  const previousPath = location.state.pathname;
  const confirmationPath = previousPath === `${routes.shop}/items` ? `${routes.inventory}/items` : `${routes.inventory}/characters`;
  const [currentStep, setCurrentStep] = useState<BuyStep>(1);
  if (!data) return <ErrorView />;

  const onBuyFormSubmit = async () => await onSubmit();
  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      case 1:
        return (
          <BuyForm
            onSubmit={onBuyFormSubmit}
            data={data}
            changeStep={setCurrentStep}
            isLoading={isLoading}
            isOfferAccepted={isOfferAccepted}
          />
        );
      case 2:
        return <Confirmation text={pText} link={confirmationPath} data={data} />;
      default:
        return <ErrorView />;
    }
  };

  return (
    <FormCard>
      <FormHeader currentStep={currentStep} stepAmount={BUY_FLOW_STEPS} title={pText.buy} link={previousPath} isPaymentFlow />
      {perStepDisplay()}
    </FormCard>
  );
};
