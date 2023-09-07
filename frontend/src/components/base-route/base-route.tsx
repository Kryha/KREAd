import React, { FC } from "react";

import { text } from "../../assets";
import { routes } from "../../navigation";
import { Footer } from "../footer";
import { NavigationSection, NavigationTab } from "../navigation-tab";
import {
  TopbarContainer,
  Box,
  ChildrenContainer,
  FooterContainer,
} from "./styles";

interface BaseRouteProps {
  sideNavigation: React.ReactNode;
  children?: React.ReactNode;
  onboarding?: boolean;
  isLanding?: boolean;
}

export const BaseRoute: FC<BaseRouteProps> = ({
  children,
  sideNavigation,
  onboarding = false,
  isLanding = false,
}) => {
  const isOnboarding = onboarding ? routes.onboarding : routes.character;
  return (
    <>
      <TopbarContainer isLanding={isLanding}>
        <Box>
          <NavigationSection route={isOnboarding}>
            <NavigationTab
              title={text.navigation.character}
              route={isOnboarding}
            />
          </NavigationSection>
          <NavigationSection route={routes.shop}>
            <NavigationTab title={text.navigation.shop} route={routes.shop} />
          </NavigationSection>
          <NavigationSection route={routes.inventory}>
            <NavigationTab
              title={text.navigation.inventory}
              route={routes.inventory}
            />
          </NavigationSection>
        </Box>
        <Box>
          {sideNavigation}
          <DevelopmentMode />
        </Box>
      </TopbarContainer>
      <ChildrenContainer isLanding={isLanding}>{children}</ChildrenContainer>
      <FooterContainer isLanding={isLanding}>
        <Footer />
      </FooterContainer>
    </>
  );
};
