import { FC } from "react";

import { text } from "../../assets";
import { routes } from "../../navigation";
import { Footer } from "../footer";
import { NavigationSection, NavigationTab } from "../navigation-tab";
import { TopbarContainer, Box, ChildrenContainer, FooterContainer } from "./styles";

interface BaseRouteProps {
  sideNavigation: React.ReactNode;
  children?: React.ReactNode;
}

export const BaseRoute: FC<BaseRouteProps> = ({ children, sideNavigation }) => {
  return (
    <>
      <TopbarContainer>
        <Box>
          <NavigationSection route={routes.character}>
            <NavigationTab title={text.navigation.character} route={routes.character} />
          </NavigationSection>
          <NavigationSection route={routes.shop}>
            <NavigationTab title={text.navigation.shop} route={routes.shop} />
          </NavigationSection>
          <NavigationSection route={routes.inventory}>
            <NavigationTab title={text.navigation.inventory} route={routes.inventory} />
          </NavigationSection>
        </Box>
        {sideNavigation}
      </TopbarContainer>
      <ChildrenContainer>{children}</ChildrenContainer>
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </>
  );
};
