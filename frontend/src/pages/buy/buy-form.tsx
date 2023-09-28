import { FC, useMemo, useState } from "react";

import { text } from "../../assets";
import { Badge, ButtonText, FormText, LoadingPage, PriceInIst, PrimaryButton } from "../../components";
import { CONFIRMATION_STEP } from "../../constants";
import { color } from "../../design";
import {
  ArrowUp,
  ButtonContainer,
  ContentWrapper,
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
import { useViewport } from "../../hooks";

interface BuyFormProps {
  data: BuyData;

  changeStep: (step: BuyStep) => void;
  onSubmit: () => Promise<void>;

  isLoading: boolean;
  isOfferAccepted: boolean;
}

export const BuyForm: FC<BuyFormProps> = ({ data, changeStep, isLoading, onSubmit, isOfferAccepted }) => {
  const [isOnFirstStep, setIsOnFirstStep] = useState<boolean>(true);
  const isOfferPending = !isOnFirstStep && !isOfferAccepted;
  const [isDisabled, setIsDisabled] = useState(false);
  const { width, height } = useViewport();
  const onSendOfferClickHandler = async () => {
    setIsDisabled(true);
    await onSubmit();
    setIsOnFirstStep(false);
  };

  const changeStepDisabled = useMemo(()=>({
    step1: true,
    step2: !isOfferAccepted,
    step3: !isOfferAccepted,
  }), [isOfferAccepted]);

  return (
    <ContentWrapper width={width} height={height}>
      <FormText>{text.mint.theCostsOfMinting}</FormText>
      <StepContainer>
        <GeneralInfo active={!isOnFirstStep}>
          <PricingContainer>
            <NumberContainer active>{!isOnFirstStep ? <Tick /> : <ButtonText>{text.mint.stepOne}</ButtonText>}</NumberContainer>
            <StepText>{text.mint.sendOfferToWallet}</StepText>
            {isOnFirstStep && <PriceInIst price={data.price} />}
          </PricingContainer>
          {isOnFirstStep && (
            <PrimaryButton onClick={() => onSendOfferClickHandler()} disabled={isDisabled}>
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
            <PrimaryButton onClick={() => onSendOfferClickHandler()} disabled={isDisabled}>
              <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
            </PrimaryButton>
          ):(
            <PrimaryButton onClick={() => changeStep(CONFIRMATION_STEP)} disabled={changeStepDisabled.step2}>
              <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
              {isLoading ? <LoadingPage /> : <ArrowUp />}
            </PrimaryButton>
          )}
      </ButtonContainer>
    </ContentWrapper>
  );
};
