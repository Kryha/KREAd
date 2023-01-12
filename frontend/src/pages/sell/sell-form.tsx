import { FC } from "react";

import { text } from "../../assets";
import { Badge, ButtonText, FormText, LoadingPage, PriceInIst, PrimaryButton, SecondaryButton } from "../../components";
import { CONFIRMATION_STEP, INFORMATION_STEP } from "../../constants";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import {
  ArrowUp,
  ButtonContainer,
  ContentWrapper,
  GeneralInfo,
  Line,
  NumberContainer,
  PreviousButtonContainer,
  PricingContainer,
  Step,
  StepContainer,
  StepText,
  Tick,
} from "./styles";
import { SellData, SellStep } from "./types";

interface SellFormProps {
  data: SellData;

  changeStep: (step: SellStep) => void;
  onSubmit: () => void;

  isLoading: boolean;
  isOfferAccepted: boolean;
}

export const SellForm: FC<SellFormProps> = ({ data, changeStep, isLoading, onSubmit, isOfferAccepted }) => {
  const { width, height } = useViewport();

  const isOnFirstStep = !isLoading;
  const isOnSecondStep = isLoading && !isOfferAccepted;

  console.log({ isOnFirstStep, isOnSecondStep });

  return (
    <ContentWrapper width={width} height={height}>
      <FormText>{text.store.sellDescription}</FormText>
      <StepContainer>
        <GeneralInfo active={!isOnFirstStep}>
          <PricingContainer>
            <NumberContainer active>{!isOnFirstStep ? <Tick /> : <ButtonText>{text.mint.stepOne}</ButtonText>}</NumberContainer>
            <StepText>{text.mint.sendOfferToWallet}</StepText>
            {isOnFirstStep && <PriceInIst price={data.price} />}
          </PricingContainer>
          {isOnFirstStep && (
            <PrimaryButton onClick={() => onSubmit()}>
              <ButtonText customColor={color.white}>{text.mint.sendOffer}</ButtonText>
            </PrimaryButton>
          )}
        </GeneralInfo>
        <Line />
        <Step active={!isOnSecondStep}>
          <NumberContainer active={isOnSecondStep}>
            {isOfferAccepted ? <Tick /> : <ButtonText>{text.mint.stepTwo}</ButtonText>}
          </NumberContainer>
          <StepText>{text.mint.acceptOfferIn}</StepText>
          {isOnSecondStep && (
            <Badge>
              <ButtonText customColor={color.darkGrey}>{text.mint.offerPending}</ButtonText>
            </Badge>
          )}
        </Step>
      </StepContainer>
      {!isOnSecondStep && (
        <PreviousButtonContainer onClick={() => changeStep(INFORMATION_STEP)}>
          <SecondaryButton>
            <ButtonText>{text.mint.previous}</ButtonText>
          </SecondaryButton>
        </PreviousButtonContainer>
      )}
      <ButtonContainer>
        <PrimaryButton onClick={() => changeStep(CONFIRMATION_STEP)} disabled={!isOfferAccepted}>
          <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
          {isLoading ? <LoadingPage /> : <ArrowUp />}
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
