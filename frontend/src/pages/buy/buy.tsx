import React, { FC, useState } from "react";

import { ErrorView, FadeInOut, FormHeader, NotificationDetail, Overlay } from "../../components";
import { BUY_FLOW_STEPS } from "../../constants";
import { FormCard } from "../create-character/styles";
import { BuyForm } from "./buy-form";
import { Confirmation } from "./confirmation";
import { BuyData, BuyStep, BuyText } from "./types";
import { useLocation } from "react-router-dom";
import { routes } from "../../navigation";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { text } from "../../assets";
import { useCharacterBuilder } from "../../context/character-builder-context";

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
  const { showToast, setShowToast } = useCharacterBuilder();
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
    <>
      <FormCard>
        <FormHeader currentStep={currentStep} stepAmount={BUY_FLOW_STEPS} title={pText.buy} link={previousPath} isPaymentFlow />
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
