import { FC, useState } from "react";
import {
  ArrowUp,
  ButtonContainer,
  ButtonWrapper,
  ContentWrapper,
  Line,
  NumberContainer,
  PreviousButtonContainer,
  PriceWrapper,
  PricingContainer,
  Step,
  StepContainer,
  StepText,
  StepWrapper,
  Tick,
} from "./styles";
import { Badge, ButtonText, FormText, LoadingPage, PriceInIst, PrimaryButton, SecondaryButton } from "../../components";
import { text } from "../../assets";
import { CONFIRMATION_STEP, INFORMATION_STEP, MINTING_COST } from "../../constants";
import { color } from "../../design";
import { ArrowBack } from "../../components/error-view/styles";

interface PaymentProps {
  submit: (step: number) => void;
  sendOfferHandler: () => Promise<void>;
  isOfferAccepted: boolean;
  isLoading: boolean;
}

export const Payment: FC<PaymentProps> = ({ submit, sendOfferHandler, isOfferAccepted, isLoading }) => {
  const [sendOffer, setSendOffer] = useState(false);
  const [disable, setDisable] = useState(false);
  const sendOfferToWallet = async () => {
    setDisable(true);
    console.info("SENDING OFFER TO WALLET");
    await sendOfferHandler();
    setSendOffer(true);
  };

  return (
    <ContentWrapper>
      <FormText>{text.mint.theCostsOfMinting}</FormText>
      <StepContainer>
        <StepWrapper active={sendOffer}>
          <PricingContainer>
            <Step>
              <NumberContainer active={true}>{sendOffer ? <Tick /> : <ButtonText>{text.mint.stepOne}</ButtonText>}</NumberContainer>
              <StepText>{text.mint.sendOfferToWallet}</StepText>
            </Step>
            {!sendOffer && (
              <PriceWrapper>
                <PriceInIst price={MINTING_COST} />
                <PrimaryButton onClick={sendOfferToWallet} disabled={disable}>
                  <ButtonText customColor={color.white}>{text.mint.sendOffer}</ButtonText>
                </PrimaryButton>
              </PriceWrapper>
            )}
          </PricingContainer>
        </StepWrapper>
        <Line />
        <StepWrapper active={!sendOffer}>
          <Step>
            <NumberContainer active={sendOffer}>
              {isOfferAccepted ? <Tick /> : <ButtonText>{text.mint.stepTwo}</ButtonText>}
            </NumberContainer>
            <StepText>{text.mint.acceptOfferIn}</StepText>
          </Step>
          {!isOfferAccepted && sendOffer && (
            <Badge>
              <ButtonText customColor={color.darkGrey}>{text.mint.offerPending}</ButtonText>
            </Badge>
          )}
        </StepWrapper>
      </StepContainer>
      <ButtonWrapper>
        {!sendOffer && (
          <PreviousButtonContainer onClick={() => submit(INFORMATION_STEP)}>
            <ArrowBack />
            <SecondaryButton>
              <ButtonText>{text.mint.previous}</ButtonText>
            </SecondaryButton>
          </PreviousButtonContainer>
        )}
        <ButtonContainer>
          <PrimaryButton onClick={() => submit(CONFIRMATION_STEP)} disabled={!isOfferAccepted}>
            <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
            {isLoading ? <LoadingPage /> : <ArrowUp />}
          </PrimaryButton>
        </ButtonContainer>
      </ButtonWrapper>
    </ContentWrapper>
  );
};
