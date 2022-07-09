import { FC } from "react";

import { text } from "../../assets";
import { color } from "../../design";
import { ButtonText, Footer, MenuItemName, MenuText, OnboardingCharacter, PrimaryButton, TitleText } from "../../components";
import {
  ArrowUp,
  ButtonContainer,
  Email,
  EmailContainer,
  FooterContainer,
  InfoText,
  MiddleContent,
  OnboardingContainer,
  OnboardingWrapper,
} from "./styles";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { useViewport } from "../../hooks";

export const Onboarding: FC = () => {
  const navigate = useNavigate();
  const { width, height } = useViewport();

  const connectWallet = () => {
    // TODO: check if you have any assets in your wallet & connect to wallet
    navigate(routes.createCharacter);
  };

  return (
    <OnboardingContainer height={height} width={width}>
      <OnboardingWrapper>
        <MenuItemName>{text.general.logo}</MenuItemName>
        <InfoText height={height}>
          <MenuText>{text.general.launchingTheFirst}</MenuText>
          <TitleText customColor={color.darkGrey}>{text.general.aCharcterBuilderApp}</TitleText>
          <ButtonContainer>
            {/* TODO: connect to wallet */}
            <PrimaryButton onClick={() => connectWallet()}>
              <ButtonText customColor={color.white}>{text.general.connectWallet}</ButtonText>
              <ArrowUp />
            </PrimaryButton>
          </ButtonContainer>
        </InfoText>
        <MiddleContent height={height}>
          <MenuText>{text.general.whoWeAre}</MenuText>
          <TitleText customColor={color.darkGrey}>{text.general.isPartOfAgoric}</TitleText>
          <TitleText customColor={color.darkGrey}>{text.general.ourLeadership}</TitleText>
        </MiddleContent>
        <MiddleContent height={height}>
          <MenuText>{text.general.contactUs}</MenuText>
          <TitleText customColor={color.darkGrey}>{text.general.questionsBug}</TitleText>
          <EmailContainer>
            {text.general.sendEmailTo} </EmailContainer>
          <Email href={`mailto:${text.general.contactEmail}`}>{text.general.contactEmail}</Email>

        </MiddleContent>
      </OnboardingWrapper>
      <OnboardingCharacter />
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </OnboardingContainer>
  );
};
