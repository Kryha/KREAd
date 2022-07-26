import { FC } from "react";

import { text } from "../../assets";
import { Badge, ButtonText, FormText, PriceInIst, PrimaryButton } from "../../components";
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

interface BuyFormProps {
  data: BuyData;

  changeStep: (step: BuyStep) => void;
  onSubmit: () => void;

  isLoading: boolean;
  isOfferAccepted: boolean;
}

export const BuyForm: FC<BuyFormProps> = ({ data, changeStep, isLoading, onSubmit, isOfferAccepted }) => {
  return (
    <ContentWrapper>
      <FormText>{text.mint.theCostsOfMinting}</FormText>
      <StepContainer>
        <GeneralInfo active={isLoading}>
          <PricingContainer>
            <NumberContainer active>{isLoading ? <Tick /> : <ButtonText>{text.mint.stepOne}</ButtonText>}</NumberContainer>
            <StepText>{text.mint.sendOfferToWallet}</StepText>
            {!isLoading && <PriceInIst price={data.price} />}
          </PricingContainer>
          {!isLoading && (
            <PrimaryButton onClick={() => onSubmit()}>
              <ButtonText customColor={color.white}>{text.mint.sendOffer}</ButtonText>
            </PrimaryButton>
          )}
        </GeneralInfo>
        <Line />
        <Step active={!isLoading}>
          <NumberContainer active={!!isLoading}>
            {isOfferAccepted ? <Tick /> : <ButtonText>{text.mint.stepTwo}</ButtonText>}
          </NumberContainer>
          <StepText>{text.mint.acceptOfferIn}</StepText>
          {!isOfferAccepted && !!isLoading && (
            <Badge>
              <ButtonText customColor={color.darkGrey}>{text.mint.offerPending}</ButtonText>
            </Badge>
          )}
        </Step>
      </StepContainer>
      <ButtonContainer>
        <PrimaryButton onClick={() => changeStep(CONFIRMATION_STEP)} disabled={!isOfferAccepted}>
          <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
