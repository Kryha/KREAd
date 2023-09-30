import { FC, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { text } from "../../assets";
import { breakpoints, color } from "../../design";
import { ButtonText, Footer, Kado, LoadingPage, MenuText, OnboardingCharacter, PrimaryButton, TitleText } from "../../components";
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

// TODO: Update to designs, Update stylings

export const ConnectWallet: FC = () => {
  const [service, _] = useAgoricContext();
  const navigate = useNavigate();
  const { width, height } = useViewport();
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isConnectButtonVisible = useOnScreen(ref);
  const isMobile = useIsMobile(breakpoints.tablet);
  const showAnimation = false;

  const provisionWallet = async () => {
    setIsLoading(true);
    await service.walletConnection.provisionSmartWallet();
  };
  if (!service.walletConnection.address) return <LoadingPage spinner={false} />;
  if (service.walletConnection.smartWalletProvisioned) navigate(routes.character);

  return (
    <>
      <Kado show={true} />
      <OnboardingContainer height={height} width={width} showAnimation={showAnimation}>
        <ButtonContainer isVisible={isConnectButtonVisible}>
          <PrimaryButton onClick={() => provisionWallet()}>
            <ButtonText customColor={color.white}>{text.general.activateWallet}</ButtonText>
            <ArrowUp />
          </PrimaryButton>
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
    </>
  );
};
