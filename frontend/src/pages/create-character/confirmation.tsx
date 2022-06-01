import { FC, useState } from "react";
import { text } from "../../assets";

import {  Badge, ButtonText, FormText, PriceInRun, PrimaryButton, SecondaryButton } from "../../components";
import { CONFIRMATION_STEP, MINTING_COST, INFORMATION_STEP } from "../../constants";
import { color } from "../../design";
import { ArrowUp, ButtonContainer, ContentWrapper, Tick, } from "./styles";

export const Confirmation: FC = () => {
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

      <ButtonContainer>
        <PrimaryButton disabled={!acceptOffer}>
          <ButtonText customColor={color.white}>{text.mint.confirm}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
