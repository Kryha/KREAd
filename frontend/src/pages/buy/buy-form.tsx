import React, { FC, useMemo, useState } from "react";

import { text } from "../../assets";
import { Badge, ButtonText, FormText, LoadingPage, PriceInIst, PrimaryButton } from "../../components";
import { CONFIRMATION_STEP } from "../../constants";
import { color } from "../../design";
import {
  ArrowUp,
  ButtonContainer,
  ErrorContainerMarginTop,
  BuyFormContainer,
  GeneralInfo,
  Line,
  NumberContainer,
  PricingContainer,
  Step,
  StepContainer,
  StepText,
  Tick,
} from "./styles";
import { BuyData, BuyStep } from "./types";
import { Warning } from "../create-character/styles";
import { useCharacterBuilder } from "../../context/character-builder-context";

interface BuyFormProps {
  data: BuyData;

  changeStep: (step: BuyStep) => void;
  onSubmit: () => Promise<void>;

  isLoading: boolean;
  isOfferAccepted: boolean;

  notEnoughIST?: boolean;
  ist: bigint;
}

export const BuyForm: FC<BuyFormProps> = ({ data, changeStep, isLoading, onSubmit, isOfferAccepted, notEnoughIST, ist }) => {
  const [isOnFirstStep, setIsOnFirstStep] = useState<boolean>(true);
  const isOfferPending = !isOnFirstStep && !isOfferAccepted;
  const [isDisabled, setIsDisabled] = useState(false);
  const { showToast, setShowToast } = useCharacterBuilder();
  const onSendOfferClickHandler = async () => {
    setIsDisabled(true);
    setShowToast(!showToast);
    await onSubmit();
    setIsOnFirstStep(false);
  };

  const changeStepDisabled = useMemo(
    () => ({
      step1: true,
      step2: !isOfferAccepted,
      step3: !isOfferAccepted,
    }),
    [isOfferAccepted],
  );

  return (
    <BuyFormContainer>
      <FormText>{text.mint.theCostsOfMinting}</FormText>
      <StepContainer>
        <GeneralInfo active={!isOnFirstStep}>
          <PricingContainer>
            <NumberContainer active>{!isOnFirstStep ? <Tick /> : <ButtonText>{text.mint.stepOne}</ButtonText>}</NumberContainer>
            <StepText>{text.mint.sendOfferToWallet}</StepText>
            {isOnFirstStep && <PriceInIst price={data.price} />}
          </PricingContainer>
          {isOnFirstStep && (
            <PrimaryButton onClick={() => onSendOfferClickHandler()} disabled={isDisabled || notEnoughIST}>
              <ButtonText customColor={color.white}>{text.mint.sendOffer}</ButtonText>
            </PrimaryButton>
          )}
        </GeneralInfo>
        <Line />
        <Step active={isOnFirstStep}>
          <NumberContainer active={!isOnFirstStep}>
            {isOfferAccepted ? <Tick /> : <ButtonText>{text.mint.stepTwo}</ButtonText>}
          </NumberContainer>
          <StepText>{text.mint.acceptOfferIn}</StepText>
          {isOfferPending && (
            <Badge>
              <ButtonText customColor={color.darkGrey}>{text.mint.offerPending}</ButtonText>
            </Badge>
          )}
        </Step>
      </StepContainer>
      <ButtonContainer>
        {isOnFirstStep ? (
          <PrimaryButton onClick={() => onSendOfferClickHandler()} disabled={isDisabled || notEnoughIST}>
            <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => changeStep(CONFIRMATION_STEP)} disabled={changeStepDisabled.step2}>
            <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
            {isLoading ? <LoadingPage /> : <ArrowUp />}
          </PrimaryButton>
        )}
      </ButtonContainer>
      {notEnoughIST && (
        <ErrorContainerMarginTop>
          <Warning />
          <ButtonText customColor={color.red}>{text.error.mint.insufficientFunds(ist)}</ButtonText>
        </ErrorContainerMarginTop>
      )}
    </BuyFormContainer>
  );
};
