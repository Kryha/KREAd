import { FC, useState } from "react";
import { text } from "../../assets";

import { Badge, ButtonText, FormText, PriceInIst, PrimaryButton, SecondaryButton } from "../../components";
import { CONFIRMATION_STEP, MINTING_COST, INFORMATION_STEP } from "../../constants";
import { color } from "../../design";
import {
  ArrowUp,
  GeneralInfo,
  PricingContainer,
  ButtonContainer,
  ContentWrapper,
  Line,
  NumberContainer,
  PreviousButtonContainer,
  Step,
  StepContainer,
  StepText,
  Tick,
} from "./styles";

interface PaymentProps {
  submit: (step: number) => void;
  sendOfferHandler: () => Promise<void>;
  isOfferAccepted: boolean;
}

export const Payment: FC<PaymentProps> = ({ submit, sendOfferHandler, isOfferAccepted }) => {
  const [sendOffer, setSendOffer] = useState(false);

  const sendOfferToWallet = async () => {
    console.info("SENDING OFFER TO WALLET");
    await sendOfferHandler();
    setSendOffer(true);
  };

  return (
    <ContentWrapper>
      <FormText>{text.mint.theCostsOfMinting}</FormText>
      <StepContainer>
        <GeneralInfo active={sendOffer}>
          <PricingContainer>
            <NumberContainer active={true}>{sendOffer ? <Tick /> : <ButtonText>{text.mint.stepOne}</ButtonText>}</NumberContainer>
            <StepText>{text.mint.sendOfferToWallet}</StepText>
            {!sendOffer && (
              <>
                <PriceInIst price={MINTING_COST} />
                <PrimaryButton onClick={sendOfferToWallet}>
                  <ButtonText customColor={color.white}>{text.mint.sendOffer}</ButtonText>
                </PrimaryButton>
              </>
            )}
          </PricingContainer>
        </GeneralInfo>
        <Line />
        <Step active={!sendOffer}>
          <NumberContainer active={sendOffer}>{isOfferAccepted ? <Tick /> : <ButtonText>{text.mint.stepTwo}</ButtonText>}</NumberContainer>
          <StepText>{text.mint.acceptOfferIn}</StepText>
          {!isOfferAccepted && sendOffer && (
            <Badge>
              <ButtonText customColor={color.darkGrey}>{text.mint.offerPending}</ButtonText>
            </Badge>
          )}
        </Step>
      </StepContainer>
      {!sendOffer && (
        <PreviousButtonContainer onClick={() => submit(INFORMATION_STEP)}>
          <SecondaryButton>
            <ButtonText>{text.mint.previous}</ButtonText>
          </SecondaryButton>
        </PreviousButtonContainer>
      )}
      <ButtonContainer>
        <PrimaryButton onClick={() => submit(CONFIRMATION_STEP)} disabled={!isOfferAccepted}>
          <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
