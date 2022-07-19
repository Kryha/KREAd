import { FC } from "react";

import { text } from "../../assets";
import { color } from "../../design";
import { AnimatedLogo, BoldLabel, Footer, MenuText, OnboardingCharacter, TitleText } from "../../components";
import {
  ArrowDown,
  Email,
  EmailContainer,
  EndContent,
  FooterContainer,
  InfoText,
  KreadContainer,
  MiddleContent,
  OnboardingContainer,
  OnboardingWrapper,
} from "./styles";
import { useViewport } from "../../hooks";

export const Onboarding: FC = () => {
  // TODO: uncomment
  // const navigate = useNavigate();
  const { width, height } = useViewport();

  // TODO: uncomment
  // const connectWallet = () => {
  //   // TODO: check if you have any assets in your wallet & connect to wallet
  //   navigate(routes.createCharacter);
  // };

  return (
    <OnboardingContainer height={height} width={width}>
      <OnboardingWrapper>
        <BoldLabel customColor={color.black}>{text.general.comingSoon}</BoldLabel>
        <InfoText height={height}>
          <MenuText>{text.general.launchingTheFirst}</MenuText>
          <TitleText customColor={color.darkGrey}>{text.general.aCharcterBuilderApp}</TitleText>
          {/* TODO: uncomment */}
          {/* <ButtonContainer>
            <PrimaryButton onClick={() => connectWallet()}>
              <ButtonText customColor={color.white}>{text.general.connectWallet}</ButtonText>
              <ArrowUp />
            </PrimaryButton>
          </ButtonContainer>
          */}
        </InfoText>
        <MiddleContent height={height}>
          <MenuText>{text.general.whoWeAre}</MenuText>
          <TitleText customColor={color.darkGrey}>{text.general.isPartOfAgoric}</TitleText>
          <TitleText customColor={color.darkGrey}>{text.general.ourLeadership}</TitleText>
        </MiddleContent>
        <EndContent height={height}>
          <MenuText>{text.general.contactUs}</MenuText>
          <TitleText customColor={color.darkGrey}>{text.general.questionsBug}</TitleText>
          <EmailContainer>
            {text.general.sendEmailTo} </EmailContainer>
          <Email href={`mailto:${text.general.contactEmail}`}>{text.general.contactEmail}</Email>
        </EndContent>
      </OnboardingWrapper>
      <OnboardingCharacter />
      <FooterContainer>
        <Footer />
      </FooterContainer>
      <KreadContainer height={height} width={width}>
        <AnimatedLogo />
      </KreadContainer>
      <ArrowDown />
    </OnboardingContainer>
  );
};
