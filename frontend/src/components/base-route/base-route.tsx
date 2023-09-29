import React, { FC } from "react";

import { text } from "../../assets";
import { routes } from "../../navigation";
import { Footer } from "../footer";
import { NavigationSection, NavigationTab } from "../navigation-tab";
import { Box, ChildrenContainer, FooterContainer, TopbarContainer } from "./styles";
import { useCharacterBuilder } from "../../context/character-builder-context";
import { MAIN_MODE } from "../../constants";

interface BaseRouteProps {
  sideNavigation: React.ReactNode;
  children?: React.ReactNode;
  onboarding?: boolean;
  isLanding?: boolean;
}

export const BaseRoute: FC<BaseRouteProps> = ({ children, sideNavigation, onboarding = false, isLanding = false }) => {
  const isOnboarding = onboarding ? routes.onboarding : routes.character;
  const { interactionMode } = useCharacterBuilder();
  return (
    <>
      {interactionMode === MAIN_MODE && (
        <TopbarContainer isLanding={isLanding}>
          <Box>
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
          <Box>{sideNavigation}</Box>
        </TopbarContainer>
      )}
      <ChildrenContainer isLanding={isLanding}>{children}</ChildrenContainer>
      <FooterContainer isLanding={isLanding}>
        <Footer />
      </FooterContainer>
    </>
  );
};
