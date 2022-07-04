import { FC } from "react";

import { DefaultIcon, text } from "../../assets";
import { color } from "../../design";
import { ButtonText, Footer, MenuItemName, MenuText, OnboardingCharacter, PrimaryButton, SecondaryButton, TitleText } from "../../components";
import {
  ArrowUp,
  ArrowUpRight,
  ButtonContainer,
  DefaultImage,
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

  return (
    <OnboardingContainer height={height} width={width}>
      <OnboardingWrapper>
        <MenuItemName>{text.general.logo}</MenuItemName>
        <InfoText height={height}>
          <MenuText>{text.general.launchingTheFirst}</MenuText>
          <TitleText customColor={color.darkGrey}>{text.general.aCharcterBuilderApp}</TitleText>
          <ButtonContainer>
            <SecondaryButton onClick={() => navigate(routes.createCharacter)}>
              {/* <ButtonText>{text.general.explore}</ButtonText> */}
              <ButtonText>{text.general.createCharacter}</ButtonText>

              <ArrowUpRight />
            </SecondaryButton>
            {/* TODO: connect to wallet */}
            <PrimaryButton>
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
          <TitleText customColor={color.darkGrey}>{text.general.sendEmailTo}</TitleText>
        </MiddleContent>
      </OnboardingWrapper>
      <OnboardingCharacter />
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </OnboardingContainer>
  );
};
