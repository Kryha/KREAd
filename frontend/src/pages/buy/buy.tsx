import { FC, ReactNode, useState } from "react";

import { ErrorView, FormHeader } from "../../components";
import { PageContainer } from "../../components/page-container";
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
      case 1:
        return (
          <BuyForm onSubmit={() => {
            onSubmit();
          }} data={data} changeStep={setCurrentStep} isLoading={isLoading} isOfferAccepted={isOfferAccepted} />
        );
      case 2:
        return <Confirmation text={pText} />;
      default:
        return (
          <BuyForm onSubmit={() => {
            onSubmit();
          }} data={data} changeStep={setCurrentStep} isLoading={isLoading} isOfferAccepted={isOfferAccepted} />
        );
    }
  };

  return (
    <ContentWrapper>
      <PageContainer sidebarContent={children}>
        <FormCard height={height} width={width}>
          <FormHeader currentStep={currentStep} title={pText.buy} link={routes.shop} isBuyFlow />
          {perStepDisplay()}
        </FormCard>
      </PageContainer>
    </ContentWrapper>
  );
};
