import { FC, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { text } from "../../assets";
import { color } from "../../design";
import { AnimatedLogo, ButtonText, Footer, MenuText, OnboardingCharacter, PrimaryButton, TitleText } from "../../components";
import {
  ArrowDown,
  ArrowUp,
  ButtonContainer,
  EndContent,
  FooterContainer,
  GeneralSectionContainer,
  InfoText,
  KreadContainer,
  KreadLogo,
  KryhaLink,
  Link,
  LogoContainer,
  MiddleContent,
  OnboardingContainer,
  OnboardingWrapper,
  ScrollContainer,
  SectionContainer,
  TextContainer,
} from "./styles";
import { useLocalStorage, useOnScreen, useTimer, useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { AGORIC_LINK, FIRST_TIME, KRYHA_LINK, SLIDER_TIME } from "../../constants";

export const Onboarding: FC = () => {
  const navigate = useNavigate();
  const { width, height } = useViewport();
  const [showSlider] = useTimer(SLIDER_TIME, true);
  const [showAnimation, setShowAnimation] = useLocalStorage(FIRST_TIME);

  const ref = useRef<HTMLDivElement>(null);
  const isConnectButtonVisible = useOnScreen(ref);

  const connectWallet = () => {
    navigate(routes.character);
    setShowAnimation(false);
  };

  return (
    <>
      <OnboardingContainer height={height} width={width} showAnimation={showAnimation}>
        <ButtonContainer isVisible={isConnectButtonVisible}>
          <PrimaryButton onClick={() => connectWallet()}>
            <ButtonText customColor={color.white}>{text.general.connectWallet}</ButtonText>
            <ArrowUp />
          </PrimaryButton>
        </ButtonContainer>
        <OnboardingWrapper>
          <InfoText height={height}>
            <SectionContainer>
              <MenuText>{text.general.launchingTheFirst}</MenuText>
              <TitleText customColor={color.darkGrey}>{text.general.aCharcterBuilderApp}</TitleText>
            </SectionContainer>
            <ScrollContainer>
              <ButtonText>{text.general.scroll}</ButtonText>
              <ArrowDown />
            </ScrollContainer>
          </InfoText>
          <MiddleContent height={height} ref={ref}>
            <GeneralSectionContainer>
              <MenuText>{text.general.whoWeAre}</MenuText>
              <TextContainer>{text.general.isPartOfAgoric}</TextContainer>
              <Link href={AGORIC_LINK}>{text.param.comma(text.general.agoric)}</Link>
              <TextContainer>{text.general.anOpenSource}</TextContainer>
              <KryhaLink href={KRYHA_LINK}>{text.param.fullstop(text.general.kryha)}</KryhaLink>
              <TextContainer>{text.general.ourLeadership}</TextContainer>
            </GeneralSectionContainer>
          </MiddleContent>
          <EndContent height={height}>
            <GeneralSectionContainer>
              <MenuText>{text.general.contactUs}</MenuText>
              <TitleText customColor={color.darkGrey}>{text.general.questionsBug}</TitleText>
              <TextContainer>{text.general.sendEmailTo}</TextContainer>
              <Link href={`mailto:${text.general.contactEmail}`}>{text.general.contactEmail}</Link>
            </GeneralSectionContainer>
          </EndContent>
        </OnboardingWrapper>
        <OnboardingCharacter />
        <FooterContainer>
          <Footer />
        </FooterContainer>
      </OnboardingContainer>
      {showAnimation ? (
        <KreadContainer height={height} width={width} showSlider={showSlider}>
          <AnimatedLogo iteration={1} />
        </KreadContainer>
      ) : (
        <LogoContainer>
          <KreadLogo />
        </LogoContainer>
      )}
    </>
  );
};
