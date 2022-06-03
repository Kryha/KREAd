import { FC, useState } from "react";
import { text } from "../../assets";

import {  Badge, ButtonText, FormText, PriceInRun, PrimaryButton, SecondaryButton } from "../../components";
import { CONFIRMATION_STEP, MINTING_COST, INFORMATION_STEP } from "../../constants";
import { color } from "../../design";
import { ArrowUp, ButtonContainer, ContentWrapper, Line, NumberContainer, PreviousButtonContainer, Step, StepContainer, StepText, Tick, } from "./styles";

export const Buy: FC = () => {
  const [sendOffer, setSendOffer] = useState(false);
  const [acceptOffer, setAcceptOffer] = useState(false);

  const sendOfferToWallet = () => {
    // TODO: send offer
    setSendOffer(true);
  };

  const acceptOfferInWallet = () => {
    // TODO: send accept
    setAcceptOffer(true);
  };


  return (
    <ContentWrapper>
      {/* <FormText>{text.mint.theCostsOfMinting}</FormText>
      <StepContainer>
        <Step>
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
              <PrimaryButton onClick={() => sendOfferToWallet()}>
                <ButtonText customColor={color.white}>{text.mint.sendOffer}</ButtonText>
              </PrimaryButton>
            </>
          )}
        </Step>
        <Line />
        <Step>
          <NumberContainer active={!!sendOffer}>
            {acceptOffer ? <Tick /> :<ButtonText>{text.mint.stepTwo}</ButtonText>}
          </NumberContainer>
          <StepText>{text.mint.acceptOfferIn}</StepText>
          {Boolean(!acceptOffer && !!sendOffer) && (
            // TODO: remove this onclick
            <Badge onClick={() => acceptOfferInWallet()}><ButtonText customColor={color.darkGrey}>{text.mint.offerPending}</ButtonText></Badge>
          )}
        </Step>
      </StepContainer>
      {Boolean(!sendOffer) && (
        <PreviousButtonContainer onClick={()=>changeStep(INFORMATION_STEP)}>
          <SecondaryButton>
            <ButtonText >{text.mint.previous}</ButtonText>
          </SecondaryButton>
        </PreviousButtonContainer>
      )}
      <ButtonContainer>
        <PrimaryButton onClick={()=>changeStep(CONFIRMATION_STEP)} disabled={!acceptOffer}>
          <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer> */}
    </ContentWrapper>
  );
};
