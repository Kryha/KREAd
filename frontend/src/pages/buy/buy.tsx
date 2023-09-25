import { FC, useState } from "react";

import { ErrorView, FormHeader } from "../../components";
import { BUY_FLOW_STEPS } from "../../constants";
import { useViewport } from "../../hooks";
import { FormCard } from "../create-character/styles";
import { BuyForm } from "./buy-form";
import { Confirmation } from "./confirmation";
import { ContentWrapper } from "./styles";
import { BuyData, BuyStep, BuyText } from "./types";
import { useLocation } from "react-router-dom";

interface Props {
  data?: BuyData;
  text: BuyText;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  isOfferAccepted: boolean;
  children?: React.ReactNode;
}

export const Buy: FC<Props> = ({ data, text: pText, onSubmit, isLoading, isOfferAccepted, children }) => {
  const { width, height } = useViewport();
  const location = useLocation();
  const previousPath = location.state.pathname;
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
        return <Confirmation text={pText} />;
      default:
        return <ErrorView />;
    }
  };

  return (
    <>
      <ContentWrapper width={width} height={height}>
        <FormCard height={height} width={width}>
          <FormHeader currentStep={currentStep} stepAmount={BUY_FLOW_STEPS} title={pText.buy} link={previousPath} isPaymentFlow />
          {perStepDisplay()}
        </FormCard>
      </ContentWrapper>
      {children}
    </>
  );
};
