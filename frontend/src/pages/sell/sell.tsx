import { FC, ReactNode, useState } from "react";

import { ErrorView, FormHeader } from "../../components";
import { useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { FormCard } from "../create-character/styles";
import { ContentWrapper, DetailContainer } from "./styles";
import { SellText, SellData, SellStep } from "./types";
import { SellForm } from "./sell-form";
import { Confirmation } from "./confirmation";
import { PageContainer } from "../../components/page-container";
import { CharacterInformation } from "./character-information";
import { WALLET_INTERACTION_STEP } from "../../constants";

interface Props {
  children: ReactNode;
  data: SellData;
  setData: (data: SellData) => void;
  text: SellText;

  sendOfferHandler: (data: SellData) => Promise<void>;

  isLoading: boolean;
  isPlacedInShop: boolean;
}

export const Sell: FC<Props> = ({ children, data, setData, text: pText, sendOfferHandler, isLoading, isPlacedInShop }) => {
  const { width, height } = useViewport();
  const [currentStep, setCurrentStep] = useState<SellStep>(0);

  const setInformationData = async (price: number) => {
    setData({ ...data, price });
    setCurrentStep(WALLET_INTERACTION_STEP);
  };

  if (!data) return <ErrorView />;

  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      default:
      case 0:
        return <CharacterInformation disabled={isLoading} setData={setInformationData} />;
      case 1:
        return (
          <SellForm
            onSubmit={() => sendOfferHandler(data)}
            data={data}
            changeStep={setCurrentStep}
            isLoading={isLoading}
            isPlacedInShop={isPlacedInShop}
          />
        );
      case 2:
        return <Confirmation data={data} text={pText} />;
    }
  };

  return (
    <ContentWrapper width={width} height={height}>
      <FormCard height={height} width={width}>
        <FormHeader currentStep={currentStep} title={pText.sell} link={routes.character} isSellFlow />
        {perStepDisplay()}
      </FormCard>
      <DetailContainer>{children}</DetailContainer>
    </ContentWrapper>
  );
};
