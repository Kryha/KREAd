import { FC } from "react";

import { DefaultIcon, text } from "../../assets";
import { color } from "../../design";
import {  ButtonText, MenuItemName, MenuText, PrimaryButton, SecondaryButton, TitleText } from "../../components";
import { ArrowUp, ArrowUpRight, ButtonContainer, InfoText, MiddleContent, OnboardingWrapper } from "./styles";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { DefaultImage } from "../create-character/styles";
import { useViewport } from "../../hooks";
import { PageContainer } from "../../components/page-container";


export const Onboarding: FC = () => {
  const navigate = useNavigate();
  const { width, height } = useViewport();

  return (
    <PageContainer  sidebarContent={
      <OnboardingWrapper>
        <MenuItemName>{text.general.logo}</MenuItemName>
        <InfoText height={height}>
          <MenuText>{text.general.launchingTheFirst}</MenuText>
          <TitleText customColor={color.darkGrey}>{text.general.aCharcterBuilderApp}</TitleText>
          <ButtonContainer>
            <SecondaryButton onClick={() => navigate(routes.character)}>
              <ButtonText>{text.general.explore}</ButtonText>
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
    }
    >
      <DefaultImage src={DefaultIcon} alt={text.character.defaultCharacter} height={height} width={width} />
    </PageContainer>
  );
};
