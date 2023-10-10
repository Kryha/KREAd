import React, { FC, useState } from "react";

import { ErrorView, FadeInOut, FormHeader, NotificationDetail, Overlay } from "../../components";
import { FormCard } from "../create-character/styles";
import { SellData, SellStep, SellText } from "./types";
import { SellForm } from "./sell-form";
import { Confirmation } from "./confirmation";
import { Information } from "./information";
import { SELL_FLOW_STEPS, WALLET_INTERACTION_STEP } from "../../constants";
import { useLocation } from "react-router-dom";
import { routes } from "../../navigation";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { text } from "../../assets";
import { useCharacterBuilder } from "../../context/character-builder-context";

interface Props {
  data: SellData;
  text: SellText;
  setData: (data: SellData) => void;
  sendOfferHandler: (data: SellData) => Promise<void>;
  isPlacedInShop: boolean;
}

export const Sell: FC<Props> = ({ data, setData, text: pText, sendOfferHandler, isPlacedInShop }) => {
  const location = useLocation();
  const previousPath = location.state.pathname;
  const [currentStep, setCurrentStep] = useState<SellStep>(0);
  const { showToast, setShowToast } = useCharacterBuilder();
  if (!data) return <ErrorView />;

  const setInformationData = async (price: number) => {
    setData({ ...data, price });
    setCurrentStep(WALLET_INTERACTION_STEP);
  };

  const onSellFormSubmit = async () => await sendOfferHandler(data);

  if (!data) return <ErrorView />;

  let confirmationPath: string = routes.character;
  if (previousPath.includes("item")) {
    if (previousPath.includes("sell")) confirmationPath = `${routes.shop}/items`;
    if (previousPath.includes("buy")) confirmationPath = `${routes.inventory}/items`;
  }
  if (previousPath.includes("character")) {
    if (previousPath.includes("sell")) confirmationPath = `${routes.shop}/characters`;
    if (previousPath.includes("buy")) confirmationPath = `${routes.inventory}/characters`;
  }

  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      case 0:
        return <Information setData={setInformationData} data={data} />;
      case 1:
        return <SellForm onSubmit={onSellFormSubmit} data={data} changeStep={setCurrentStep} isPlacedInShop={isPlacedInShop} />;
      case 2:
        return <Confirmation text={pText} confirmationPath={confirmationPath} data={data} />;
      default:
        return <ErrorView />;
    }
  };

  return (
    <>
      <FormCard>
        <FormHeader currentStep={currentStep} stepAmount={SELL_FLOW_STEPS} title={pText.sell} link={previousPath} />
        {perStepDisplay()}
      </FormCard>
      <FadeInOut show={showToast} exiting={!showToast}>
        {showToast && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showToast}>
          <NotificationDetail
            title={text.general.goToYourWallet}
            info={text.general.yourActionIsPending}
            closeToast={() => setShowToast(false)}
            isError
          />
        </NotificationWrapper>
      </FadeInOut>
    </>
  );
};
