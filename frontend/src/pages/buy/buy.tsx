import { FC, ReactNode, useState } from "react";

import { FormHeader } from "../../components";
import { PageContainer } from "../../components/page-container";
import { useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { FormCard } from "../create-character/styles";
import { BuyForm } from "./buy-form";
import { Confirmation } from "./confirmation";
import { ContentWrapper } from "./styles";
import { BuyData, BuyText } from "./types";

interface Props {
  children: ReactNode;
  data: BuyData;
  text: BuyText;
}

export const Buy: FC<Props> = ({ children, data, text: pText }) => {
  const { width, height } = useViewport();
  const [currentStep, setCurrentStep] = useState<number>(1);

  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      case 1:
        return <BuyForm data={data} changeStep={setCurrentStep} />;
      case 2:
        return <Confirmation text={pText} />;
      default:
        return <BuyForm data={data} changeStep={setCurrentStep} />;
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
