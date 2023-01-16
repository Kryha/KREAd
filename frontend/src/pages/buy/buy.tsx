import { FC, ReactNode, useState } from "react";

import { ErrorView, FormHeader } from "../../components";
import { PageContainer } from "../../components/page-container";
import { BUY_FLOW_STEPS } from "../../constants";
import { useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { FormCard } from "../create-character/styles";
import { BuyForm } from "./buy-form";
import { Confirmation } from "./confirmation";
import { ContentWrapper } from "./styles";
import { BuyData, BuyStep, BuyText } from "./types";

interface Props {
  children: ReactNode;
  data?: BuyData;
  text: BuyText;

  onSubmit: () => void;

  isLoading: boolean;
  isOfferAccepted: boolean;
}

export const Buy: FC<Props> = ({ children, data, text: pText, onSubmit, isLoading, isOfferAccepted }) => {
  const { width, height } = useViewport();
  const [currentStep, setCurrentStep] = useState<BuyStep>(1);
  if (!data) return <ErrorView />;

  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      default:
      case 1:
        return (
          <BuyForm
            onSubmit={() => onSubmit()}
            data={data}
            changeStep={setCurrentStep}
            isLoading={isLoading}
            isOfferAccepted={isOfferAccepted}
          />
        );
      case 2:
        return <Confirmation text={pText} />;
    }
  };

  return (
    <ContentWrapper>
      <PageContainer sidebarContent={children}>
        <FormCard height={height} width={width}>
          <FormHeader currentStep={currentStep} stepAmount={BUY_FLOW_STEPS} title={pText.buy} link={routes.shop} isPaymentFlow />
          {perStepDisplay()}
        </FormCard>
      </PageContainer>
    </ContentWrapper>
  );
};
