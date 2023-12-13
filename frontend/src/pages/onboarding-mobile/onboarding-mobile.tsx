import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DiscordIcon, KeplerIcon, text, TwitterIcon } from "../../assets";
import { color } from "../../design";
import {
  AnimatedLogo,
  ButtonText,
  FadeInOut,
  Footer,
  Kado,
  KeplerIconWrapper,
  MenuText,
  OnboardingCharacterMobile,
  Overlay,
  PrimaryButton,
  TitleText,
} from "../../components";
import {
  ArrowUp,
  ButtonContainer,
  ButtonRow,
  EndContent,
  InfoText,
  KreadContainer,
  KreadLogo,
  KryhaLink,
  Link,
  LogoContainer,
  MiddleContent,
  OnboardingCharacterWrapper,
  OnboardingContainer,
  OnboardingWrapper,
  SectionContainer,
  SocialsContainer,
  TextContainer,
} from "./styles";
import { useOnScreen, useTimer, useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { AGORIC_LINK, DISCORD_LINK, FIRST_TIME, KRYHA_LINK, SLIDER_TIME, TWITTER_LINK } from "../../constants";

export const OnboardingMobile: FC = () => {
  const navigate = useNavigate();
  const { width, height } = useViewport();
  const [showSlider] = useTimer(SLIDER_TIME, true);
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
  console.log(showSlider)
  return (
    <OnboardingWrapper>
      {showAnimation ? (
        <KreadContainer height={height} width={width} showSlider={showSlider}>
          <AnimatedLogo iteration={1} />
        </KreadContainer>
      ) : (
        <LogoContainer>
          <KreadLogo />
        </LogoContainer>
      )}
      <OnboardingContainer showAnimation={showAnimation}>
        <InfoText>
          <SectionContainer>
            <TitleText customColor={color.darkGrey}>{text.general.aCharcterBuilderApp}</TitleText>
          </SectionContainer>
          <OnboardingCharacterWrapper>
            <OnboardingCharacterMobile/>
          </OnboardingCharacterWrapper>
          <ButtonContainer isVisible={isConnectButtonVisible}>
            <ButtonRow>
              <PrimaryButton onClick={() => connectWallet()}>
                <KeplerIconWrapper>
                  <KeplerIcon />
                </KeplerIconWrapper>
                <ButtonText customColor={color.white}>{text.general.connectWallet}</ButtonText>
                <ArrowUp />
              </PrimaryButton>
            </ButtonRow>
          </ButtonContainer>
        </InfoText>
        <MiddleContent height={height} ref={ref}>
          <SectionContainer>
            <MenuText>{text.general.sagesBy}</MenuText>
            <TextContainer customColor={color.darkGrey}>{text.general.sagesIsTheFirst}</TextContainer>
          </SectionContainer>
          <SectionContainer>
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
          </SectionContainer>
        </MiddleContent>
        <EndContent height={height}>
          <SectionContainer>
            <MenuText>{text.general.contactUs}</MenuText>
            <TextContainer customColor={color.darkGrey}>{text.general.questionsBug}</TextContainer>
            <TextContainer>
              {text.general.sendEmailTo}
              <Link href={`mailto:${text.general.contactEmail}`}>{text.general.contactEmail}</Link>
            </TextContainer>
          </SectionContainer>
          <SectionContainer>
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
          </SectionContainer>
        </EndContent>
      </OnboardingContainer>
      <Footer />
      <FadeInOut show={showWidget}>
        <Kado show={showWidget} toggleWidget={toggleWidget} />
        <Overlay />
      </FadeInOut>
    </OnboardingWrapper>
  );
};
