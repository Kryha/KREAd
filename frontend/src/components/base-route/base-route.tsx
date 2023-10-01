import React, { FC, useMemo } from "react";

import { text } from "../../assets";
import { routes } from "../../navigation";
import { Footer } from "../footer";
import { NavigationSection, NavigationTab } from "../navigation-tab";
import { Box, ChildrenContainer, FooterContainer, NavBarDivider, RightBox, TopbarContainer } from "./styles";
import { useCharacterBuilder } from "../../context/character-builder-context";
import { MAIN_MODE, Section } from "../../constants";
import { useLocation, useParams } from "react-router-dom";
import { SwitchSelector } from "../switch-selector";
import { KreadContainer } from "../../pages/shop/styles";
import { KreadIcon } from "../logo/styles";
import { ButtonText, PrimaryButton } from "../atoms";
import { color } from "../../design";
import { useKadoWidget } from "../../context/filter-context";
import styled from "@emotion/styled";

interface BaseRouteProps {
  sideNavigation: React.ReactNode;
  children?: React.ReactNode;
  onboarding?: boolean;
  isLanding?: boolean;
  isShop?: boolean;
}

export const BaseRoute: FC<BaseRouteProps> = ({ children, sideNavigation, onboarding = false, isLanding = false, isShop = false }) => {
  const isOnboarding = onboarding ? routes.onboarding : routes.character;
  const { interactionMode } = useCharacterBuilder();

  const { pathname } = useLocation();
  const { section } = useParams<{ section: Section }>();

  const pageSelector = useMemo(
    () => (
      <SwitchSelector
        buttonOneText={text.character.items}
        buttonTwoText={text.character.characters}
        selectedSection={section || "items"}
        path={pathname}
      />
    ),
    [section, pathname],
  );

  return (
    <>
      {interactionMode === MAIN_MODE && (
        <TopbarContainer isLanding={isLanding}>
          <Box>
            <KreadContainer>
              <KreadIcon />
            </KreadContainer>
            <NavBarDivider />
            <NavigationSection route={isOnboarding}>
              <NavigationTab title={text.navigation.character} route={isOnboarding} />
            </NavigationSection>
            <NavigationSection route={`${routes.shop}/items`}>
              <NavigationTab title={text.navigation.shop} route={`${routes.shop}/:section`} />
            </NavigationSection>
            <NavigationSection route={`${routes.inventory}/items`}>
              <NavigationTab title={text.navigation.inventory} route={`${routes.inventory}/:section`} />
            </NavigationSection>
          </Box>
          <RightBox>
            {isShop && <BuyCryptoButton />}
            {!isLanding && <>{pageSelector}</>}
            {sideNavigation}
          </RightBox>
        </TopbarContainer>
      )}
      <ChildrenContainer isLanding={isLanding}>{children}</ChildrenContainer>
      <FooterContainer isLanding={isLanding}>
        <Footer />
      </FooterContainer>
    </>
  );
};

export const BuyCryptoButton = () => {
  const { toggleWidget } = useKadoWidget();
  return (
    <Container>
      <PrimaryButton onClick={toggleWidget}>
        <ButtonText customColor={color.white}>{text.store.buyCrypto}</ButtonText>
      </PrimaryButton>
    </Container>
  );
};

export const Container = styled.div`
  z-index: 101;
`;
