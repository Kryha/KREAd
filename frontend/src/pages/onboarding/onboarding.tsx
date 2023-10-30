import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { color } from "../../design";
import { AnimatedLogo, ButtonText, Footer, OnboardingCharacter, PrimaryButton } from "../../components";
import {
  ArrowUp,
  ButtonRow,
  Discord,
  EndContent,
  FooterContainer,
  KreadContainer,
  KreadLogo,
  KryhaLink,
  LeftContent,
  Link,
  LogoContainer,
  OnboardingContainer,
  OnboardingWrapper,
  RightContent,
  SectionContainer,
  SectionHeading,
  SectionText,
  SectionWrapper,
  SocialLink,
  SocialsContainer,
  TextContainer,
  Twitter,
} from "./styles";
import { useTimer, useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { AGORIC_LINK, DISCORD_LINK, FIRST_TIME, KRYHA_LINK, SLIDER_TIME, TWITTER_LINK } from "../../constants";
import { useInView } from "framer-motion";
import { KeplerIcon, text } from "../../assets";

export const Onboarding: FC = () => {
  const navigate = useNavigate();
  const { width, height } = useViewport();
  const [showSlider] = useTimer(SLIDER_TIME, true);
  const [showAnimation, setShowAnimation] = useState(true);
  const isFirstTime = localStorage.getItem(FIRST_TIME) === null;

  useEffect(() => {
    if (showSlider) {
      setShowAnimation(false);
    }

    if (!isFirstTime) {
      setShowAnimation(false);
    }
  }, [showSlider, isFirstTime]);

  const connectWallet = () => {
    navigate(routes.connectWallet);
    localStorage.setItem(FIRST_TIME, "false");
    setShowAnimation(false);
  };

  return (
    <OnboardingWrapper>
      {showAnimation ? (
        <KreadContainer height={height} width={width} showSlider={showSlider}>
          <AnimatedLogo iteration={2} />
        </KreadContainer>
      ) : (
        <>
          <LogoContainer>
            <KreadLogo />
          </LogoContainer>
          <OnboardingContainer height={height}>
            <ConnectButton connectWallet={connectWallet} />
            <Section>
              <LeftContent>
                <SectionHeading>{text.general.logo}</SectionHeading>
                <SectionText customColor={color.darkGrey}>{text.general.aCharcterBuilderApp}</SectionText>
              </LeftContent>
              <RightContent>
                <OnboardingCharacter />
              </RightContent>
            </Section>
            <Section>
              <LeftContent>
                <SectionHeading>{text.general.sagesBy}</SectionHeading>
                <SectionText customColor={color.darkGrey}>{text.general.sagesIsTheFirst}</SectionText>
              </LeftContent>
            </Section>
            <Section>
              <LeftContent>
                <SectionHeading>{text.general.whoWeAre}</SectionHeading>
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
              </LeftContent>
            </Section>
            <Section>
              <LeftContent>
                <SectionHeading>{text.general.contactUs}</SectionHeading>
                <SectionText customColor={color.darkGrey}>{text.general.questionsBug}</SectionText>
                <TextContainer>
                  {text.general.sendEmailTo}
                  <Link href={`mailto:${text.general.contactEmail}`}>{text.general.contactEmail}</Link>
                </TextContainer>
              </LeftContent>
            </Section>
            <Section last={true}>
              <EndContent>
                <SectionHeading>{text.general.followUs}</SectionHeading>
                <SocialsContainer>
                  <Link href={DISCORD_LINK} target="_blank">
                    <SocialLink>
                      <Discord />
                      <ButtonText customColor={color.darkGrey}>{text.general.discord}</ButtonText>
                    </SocialLink>
                  </Link>
                  <Link href={TWITTER_LINK} target="_blank">
                    <SocialLink>
                      <Twitter />
                      <ButtonText customColor={color.darkGrey}>{text.general.twitter}</ButtonText>
                    </SocialLink>
                  </Link>
                </SocialsContainer>
              </EndContent>
              <FooterContainer>
                <Footer />
              </FooterContainer>
            </Section>
          </OnboardingContainer>
        </>
      )}
    </OnboardingWrapper>
  );
};

interface SectionProps {
  children: React.ReactNode;
  last?: boolean;
}
export const Section: FC<SectionProps> = ({ children, last = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <SectionWrapper ref={ref} last={last}>
      <SectionContainer
        last={last}
        style={{
          transform: isInView ? "none" : "translateX(-200px)",
          opacity: isInView ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }}
      >
        {children}
      </SectionContainer>
    </SectionWrapper>
  );
};

interface ConnectButton {
  connectWallet: () => void;
}
export const ConnectButton: FC<ConnectButton> = ({ connectWallet }) => {
  return (
    <ButtonRow>
      <PrimaryButton onClick={() => connectWallet()}>
        <KeplerIcon />
        <ButtonText customColor={color.white}>{text.general.connectWallet}</ButtonText>
        <ArrowUp />
      </PrimaryButton>
    </ButtonRow>
  );
};
