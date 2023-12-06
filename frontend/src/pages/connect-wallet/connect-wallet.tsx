import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeplerIcon, text } from "../../assets";
import { color } from "../../design";
import {
  ButtonText,
  FadeInOut,
  Footer,
  Kado,
  KeplerIconWrapper,
  LoadingPage,
  NotificationDetail,
  OnboardingCharacter,
  Overlay,
  PrimaryButton,
} from "../../components";
import { ArrowUp, FooterContainer } from "./styles";
import { useViewport } from "../../hooks";
import { useAgoricContext } from "../../context/agoric";
import {
  ButtonRow,
  KreadLogo,
  LeftContent,
  LogoContainer,
  OnboardingContainer,
  OnboardingWrapper,
  RightContent,
  SectionHeading,
  SectionText,
} from "../onboarding/styles";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { Section } from "../onboarding";
import { routes } from "../../navigation";

export const ConnectWallet: FC = () => {
  const [service, _] = useAgoricContext();
  const navigate = useNavigate();
  const { height } = useViewport();
  const [isLoading, setIsLoading] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toggleWidget = () => {
    setShowWidget(!showWidget);
  };

  const provisionWallet = async () => {
    setIsLoading(true);
    try {
      await service.walletConnection.provisionSmartWallet();
    } catch (e) {
      setIsLoading(false);
      setShowToast(true);
    }
  };

  if (!service.walletConnection.address) return <LoadingPage spinner={false} />;
  if (service.status.walletProvisioned) navigate(routes.character);

  return (
    <OnboardingWrapper>
      <LogoContainer>
        <KreadLogo />
      </LogoContainer>
      <OnboardingContainer height={height}>
        <Section>
          <LeftContent>
            <SectionHeading>{text.general.activateSmartWallet}</SectionHeading>
            <SectionText customColor={color.darkGrey}>{text.general.activateSmartWalletDescription}</SectionText>
          </LeftContent>
          <RightContent>
            <OnboardingCharacter />
          </RightContent>
          <ButtonRow>
            <PrimaryButton onClick={() => provisionWallet()}>
              <KeplerIconWrapper>
                <KeplerIcon />
              </KeplerIconWrapper>
              <ButtonText customColor={color.white}>{text.general.activateWallet}</ButtonText>
              {isLoading ? <LoadingPage /> : <ArrowUp />}
            </PrimaryButton>
            <PrimaryButton onClick={toggleWidget}>
              <ButtonText customColor={color.white}>{text.store.buyAssets}</ButtonText>
              <ArrowUp />
            </PrimaryButton>
          </ButtonRow>
        </Section>
        <FooterContainer>
          <Footer />
        </FooterContainer>
      </OnboardingContainer>
      <FadeInOut show={showWidget}>
        <Kado show={showWidget} toggleWidget={toggleWidget} />
        <Overlay />
      </FadeInOut>
      <FadeInOut show={showToast} exiting={!showToast}>
        {showToast && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showToast}>
          <NotificationDetail
            title={text.error.provisionError}
            info={text.error.notEnoughBLD}
            closeToast={() => setShowToast(false)}
            isError
          />
        </NotificationWrapper>
      </FadeInOut>
    </OnboardingWrapper>
  );
};
