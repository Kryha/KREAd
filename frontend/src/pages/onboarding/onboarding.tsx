import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DiscordIcon, KeplerIcon, text, TwitterIcon } from "../../assets";
import { breakpoints, color } from "../../design";
import {
  AnimatedLogo,
  ButtonText,
  FadeInOut,
  Footer,
  Kado,
  MenuText,
  OnboardingCharacter,
  Overlay,
  PrimaryButton,
  TitleText,
} from "../../components";
import {
  ArrowDown,
  ArrowUp,
  ButtonContainer,
  ButtonRow,
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
  SocialsContainer,
  TextContainer,
} from "./styles";
import { useIsMobile, useOnScreen, useTimer, useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { AGORIC_LINK, DISCORD_LINK, FIRST_TIME, KRYHA_LINK, SLIDER_TIME, TWITTER_LINK } from "../../constants";

export const Onboarding: FC = () => {
  const navigate = useNavigate();
  const { width, height } = useViewport();
  const [showSlider] = useTimer(SLIDER_TIME, true);
  const isMobile = useIsMobile(breakpoints.tablet);
  const ref = useRef<HTMLDivElement>(null);
  const isConnectButtonVisible = useOnScreen(ref);
  const [showAnimation, setShowAnimation] = useState(true);
  const isFirstTime = localStorage.getItem(FIRST_TIME) === null;
  const [showWidget, setShowWidget] = useState(false);

  const toggleWidget = () => {
    setShowWidget(!showWidget);
  };

  useEffect(() => {
    if (!isFirstTime) {
      setShowAnimation(false);
    }
  }, [isFirstTime]);

  const connectWallet = () => {
    navigate(routes.connectWallet);
    localStorage.setItem(FIRST_TIME, "false");
    setShowAnimation(false);
  };

  return (
    <>
      <OnboardingContainer height={height} width={width} showAnimation={showAnimation}>
        <ButtonContainer isVisible={isConnectButtonVisible}>
          <ButtonRow>
            <PrimaryButton onClick={() => connectWallet()}>
              <KeplerIcon />
              <ButtonText customColor={color.white}>{text.general.connectWallet}</ButtonText>
              <ArrowUp />
            </PrimaryButton>
          </ButtonRow>
        </ButtonContainer>
        <OnboardingWrapper>
          <InfoText height={height}>
            <SectionContainer>
              <MenuText>{text.general.logo}</MenuText>
              <TitleText customColor={color.darkGrey}>{text.general.aCharcterBuilderApp}</TitleText>
            </SectionContainer>
            <SectionContainer>
              <MenuText>{text.general.sagesBy}</MenuText>
              <TitleText customColor={color.darkGrey}>{text.general.sagesIsTheFirst}</TitleText>
            </SectionContainer>
            <ScrollContainer>
              <ButtonText>{text.general.scroll}</ButtonText>
              <ArrowDown />
            </ScrollContainer>
          </InfoText>
          <MiddleContent height={height} ref={ref}>
            <GeneralSectionContainer>
              <MenuText>{text.general.whoWeAre}</MenuText>
              <TextContainer>
                {text.general.isPartOfAgoric}
                <Link href={AGORIC_LINK} target="_blank">
                  {text.general.agoric}
                </Link>
                {text.general.anOpenSource}
                <KryhaLink href={KRYHA_LINK} target="_blank">
                  {text.general.kryha}.
                </KryhaLink>
              </TextContainer>
              <TextContainer>{text.general.theSagesArt}</TextContainer>
              <TextContainer>{text.general.ourLeadership}</TextContainer>
            </GeneralSectionContainer>
          </MiddleContent>
          <EndContent height={height}>
            <GeneralSectionContainer>
              <MenuText>{text.general.contactUs}</MenuText>
              <TitleText customColor={color.darkGrey}>{text.general.questionsBug}</TitleText>
              <TextContainer>
                {text.general.sendEmailTo}
                <Link href={`mailto:${text.general.contactEmail}`}>{text.general.contactEmail}</Link>
              </TextContainer>
            </GeneralSectionContainer>
            <GeneralSectionContainer>
              <MenuText>{text.general.followUs}</MenuText>
              <SocialsContainer>
                <Link href={DISCORD_LINK} target="_blank">
                  <DiscordIcon />
                  {text.general.discord}
                </Link>
                <Link href={TWITTER_LINK} target="_blank">
                  <TwitterIcon />
                  {text.general.twitter}
                </Link>
              </SocialsContainer>
            </GeneralSectionContainer>
          </EndContent>
        </OnboardingWrapper>
        {!isMobile && <OnboardingCharacter />}
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
      <FadeInOut show={showWidget}>
        <Kado show={showWidget} toggleWidget={toggleWidget} />
        <Overlay />
      </FadeInOut>
    </>
  );
};
