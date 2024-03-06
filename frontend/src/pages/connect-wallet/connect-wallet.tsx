import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeplerIcon, text } from "../../assets";
import { breakpoints, color } from "../../design";
import {
  ButtonText,
  FadeInOut,
  Footer,
  Kado,
  KeplerIconWrapper,
  LoadingPage,
  MenuText,
  NotificationDetail,
  OnboardingCharacter,
  Overlay,
  PrimaryButton,
  TitleText,
} from "../../components";
import {
  ArrowUp,
  ButtonContainer,
  FooterContainer,
  InfoText,
  KreadLogo,
  LogoContainer,
  OnboardingContainer,
  OnboardingWrapper,
  SectionContainer,
} from "./styles";
import { useIsMobile, useOnScreen, useViewport } from "../../hooks";
import { useAgoricContext } from "../../context/agoric";
import { routes } from "../../navigation";
import { ButtonRow } from "../onboarding/styles";
import { NotificationWrapper } from "../../components/notification-detail/styles";

export const ConnectWallet: FC = () => {
  const [service, _] = useAgoricContext();
  const navigate = useNavigate();
  const { width, height } = useViewport();
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isConnectButtonVisible = useOnScreen(ref);
  const isMobile = useIsMobile(breakpoints.tablet);
  const [showWidget, setShowWidget] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(()=>{
    if (service.status.walletProvisioned) navigate(routes.character);
  },[service.status.walletProvisioned, navigate]);

  const toggleWidget = () => {
    setShowWidget(!showWidget);
  };
  const showAnimation = false;

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

  return (
    <>
      <OnboardingContainer height={height} width={width} showAnimation={showAnimation}>
        <ButtonContainer isVisible={isConnectButtonVisible}>
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
        </ButtonContainer>
        <OnboardingWrapper>
          <InfoText height={height}>
            <SectionContainer>
              <MenuText>{text.general.activateSmartWallet}</MenuText>
              <TitleText customColor={color.darkGrey}>{text.general.activateSmartWalletDescription}</TitleText>
            </SectionContainer>
          </InfoText>
        </OnboardingWrapper>
        {!isMobile && <OnboardingCharacter size={"large"} isZoomed={true} />}
        <FooterContainer>
          <Footer />
        </FooterContainer>
      </OnboardingContainer>
      <LogoContainer>
        <KreadLogo />
      </LogoContainer>
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
    </>
  );
};
