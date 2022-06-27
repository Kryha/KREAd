import { FC, useState } from "react";
import { text } from "../../assets";

import {  Badge, ButtonText, FormText, PriceInRun, PrimaryButton, SecondaryButton } from "../../components";
import { CONFIRMATION_STEP, MINTING_COST, INFORMATION_STEP } from "../../constants";
import { color } from "../../design";
import { ArrowUp, GeneralInfo, PricingContainer, ButtonContainer, ContentWrapper, Line, NumberContainer, PreviousButtonContainer, Step, StepContainer, StepText, Tick, } from "./styles";

interface PaymentProps {
  submit: (step: number) => void;
  sendOfferHandler: ()=> Promise<void>;
}

export const Payment: FC<PaymentProps> = ({ submit, sendOfferHandler }) => {
  const [sendOffer, setSendOffer] = useState(false);
  const [acceptOffer, setAcceptOffer] = useState(false);

  const sendOfferToWallet = async () => {
    console.info("SENDING OFFER TO WALLET");
    await sendOfferHandler();
    setSendOffer(true);
  };

  const acceptOfferInWallet = () => {
    // TODO: send accept
    setAcceptOffer(true);
  };

  return (
    <ContentWrapper>
      <FormText>{text.mint.theCostsOfMinting}</FormText>
      <StepContainer>
        <GeneralInfo active={sendOffer}>
          <PricingContainer>
            <NumberContainer active={true}>
              {sendOffer ?
                <Tick />:
                <ButtonText>{text.mint.stepOne}</ButtonText>
              }
            </NumberContainer>
            <StepText>{text.mint.sendOfferToWallet}</StepText>
            {Boolean(!sendOffer) && (
              <>
                <PriceInRun price={MINTING_COST} />
                <PrimaryButton onClick={sendOfferToWallet}>
                  <ButtonText customColor={color.white}>{text.mint.sendOffer}</ButtonText>
                </PrimaryButton>
              </>
            )}
          </PricingContainer>
        </GeneralInfo>
        <Line />
        <Step active={!sendOffer}>
          <NumberContainer active={!!sendOffer}>
            {acceptOffer ? <Tick /> :<ButtonText>{text.mint.stepTwo}</ButtonText>}
          </NumberContainer>
          <StepText>{text.mint.acceptOfferIn}</StepText>
          {(!acceptOffer && !!sendOffer) && (
            // TODO: remove this onclick
            <Badge onClick={() => acceptOfferInWallet()}><ButtonText customColor={color.darkGrey}>{text.mint.offerPending}</ButtonText></Badge>
          )}
        </Step>
      </StepContainer>
      {Boolean(!sendOffer) && (
        <PreviousButtonContainer onClick={()=>submit(INFORMATION_STEP)}>
          <SecondaryButton>
            <ButtonText >{text.mint.previous}</ButtonText>
          </SecondaryButton>
        </PreviousButtonContainer>
      )}
      <ButtonContainer>
        <PrimaryButton onClick={()=>submit(CONFIRMATION_STEP)} disabled={!acceptOffer}>
          <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
