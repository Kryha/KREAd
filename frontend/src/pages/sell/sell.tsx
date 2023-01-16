import { FC, ReactNode, useState } from "react";

import { ErrorView, FormHeader } from "../../components";
import { useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { FormCard } from "../create-character/styles";
import { ContentWrapper, DetailContainer } from "./styles";
import { SellText, SellData, SellStep } from "./types";
import { SellForm } from "./sell-form";
import { Confirmation } from "./confirmation";
import { Information } from "./information";
import { WALLET_INTERACTION_STEP } from "../../constants";

interface Props {
  children: ReactNode;
  data: SellData;
  text: SellText;

  setData: (data: SellData) => void;
  sendOfferHandler: (data: SellData) => Promise<void>;

  isPlacedInShop: boolean;
}

export const Sell: FC<Props> = ({ children, data, setData, text: pText, sendOfferHandler, isPlacedInShop }) => {
  const { width, height } = useViewport();
  const [currentStep, setCurrentStep] = useState<SellStep>(0);

  const setInformationData = async (price: number) => {
    setData({ ...data, price });
    setCurrentStep(WALLET_INTERACTION_STEP);
  };

  const onSellFormSubmit = async () => await sendOfferHandler(data);

  if (!data) return <ErrorView />;

  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      default:
      case 0:
        return <Information setData={setInformationData} />;
      case 1:
        return <SellForm onSubmit={onSellFormSubmit} data={data} changeStep={setCurrentStep} isPlacedInShop={isPlacedInShop} />;
      case 2:
        return <Confirmation text={pText} />;
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
