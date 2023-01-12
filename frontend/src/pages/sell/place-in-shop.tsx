import { FC, useState } from "react";
import { text } from "../../assets";

import { Badge, ButtonText, FormText, LoadingPage, PriceInIst, PrimaryButton, SecondaryButton } from "../../components";
import { CONFIRMATION_STEP, MINTING_COST, INFORMATION_STEP } from "../../constants";
import { color } from "../../design";
import { useViewport } from "../../hooks";
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
import { SellStep } from "./types";

interface PlaceInShopProps {
  submit: (step: SellStep) => void;
  price: number;
  sendOfferHandler: (price: number) => Promise<void>;
  isOfferAccepted: boolean;
  isLoading: boolean;
}

export const PlaceInShop: FC<PlaceInShopProps> = ({ submit, price, sendOfferHandler, isOfferAccepted, isLoading }) => {
  price = 2;
  const { width, height } = useViewport();
  const [sendOffer, setSendOffer] = useState(false);
  const [disable, setDisable] = useState(false);

  const sendOfferToWallet = async () => {
    setDisable(true);
    console.info("SENDING OFFER TO WALLET");
    await sendOfferHandler(price);
    setSendOffer(true);
  };

  return (
    <ContentWrapper width={width} height={height}>
      <FormText>{text.store.sellDescription}</FormText>
      <StepContainer>
        <GeneralInfo active={sendOffer}>
          <PricingContainer>
            <NumberContainer active={true}>{sendOffer ? <Tick /> : <ButtonText>{text.mint.stepOne}</ButtonText>}</NumberContainer>
            <StepText>{text.mint.sendOfferToWallet}</StepText>
            {!sendOffer && (
              <>
                <PriceInIst price={price} />
                <PrimaryButton onClick={sendOfferToWallet} disabled={disable}>
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
          {isLoading ? <LoadingPage /> : <ArrowUp />}
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
