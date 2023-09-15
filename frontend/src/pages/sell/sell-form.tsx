import { FC, useState } from "react";

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
  onSubmit: () => Promise<void>;

  isPlacedInShop: boolean;
}

export const SellForm: FC<SellFormProps> = ({ data, changeStep, onSubmit, isPlacedInShop }) => {
  const { width, height } = useViewport();

  const [isOnFirstStep, setIsOnFirstStep] = useState<boolean>(true);
  const isOfferPending = !isOnFirstStep && !isPlacedInShop;
  const [isDisabled, setIsDisabled] = useState(false);

  const onSendOfferClickHandler = async () => {
    setIsDisabled(true);
    await onSubmit();
    setIsOnFirstStep(false);
  };

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
            <PrimaryButton onClick={() => onSendOfferClickHandler()} disabled={isDisabled}>
              <ButtonText customColor={color.white}>{text.mint.sendOffer}</ButtonText>
            </PrimaryButton>
          )}
        </GeneralInfo>
        <Line />
        <Step active={isOnFirstStep}>
          <NumberContainer active={!isOnFirstStep}>
            {isPlacedInShop ? <Tick /> : <ButtonText>{text.mint.stepTwo}</ButtonText>}
          </NumberContainer>
          <StepText>{text.mint.acceptOfferIn}</StepText>
          {isOfferPending && (
            <Badge>
              <ButtonText customColor={color.darkGrey}>{text.mint.offerPending}</ButtonText>
            </Badge>
          )}
        </Step>
      </StepContainer>
      {isOnFirstStep && (
        <PreviousButtonContainer onClick={() => changeStep(INFORMATION_STEP)}>
          <SecondaryButton>
            <ButtonText>{text.mint.previous}</ButtonText>
          </SecondaryButton>
        </PreviousButtonContainer>
      )}
      <ButtonContainer>
        <PrimaryButton onClick={() => changeStep(CONFIRMATION_STEP)} disabled={!isPlacedInShop}>
          <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
          {isOfferPending ? <LoadingPage /> : <ArrowUp />}
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
