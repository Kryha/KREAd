import React, { FC, useMemo } from "react";

import { text } from "../../assets";
import { routes } from "../../navigation";
import { Footer } from "../footer";
import { NavigationSection, NavigationTab } from "../navigation-tab";
import { Box, ChildrenContainer, FooterContainer, RightBox, TopbarContainer } from "./styles";
import { useCharacterBuilder } from "../../context/character-builder-context";
import { MAIN_MODE, Section } from "../../constants";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SwitchSelector } from "../switch-selector";
import { KreadContainer, KreadContainerMobile } from "../../pages/shop/styles";
import { KreadIcon } from "../logo/styles";
import { ButtonText, PrimaryButton } from "../atoms";
import { color } from "../../design";
import { useKadoWidget } from "../../context/filter-context";
import styled from "@emotion/styled";
import { BuyCryptoButton } from "../base-route/base-route";

interface BaseRouteProps {
  sideNavigation: React.ReactNode;
  children?: React.ReactNode;
  onboarding?: boolean;
  isLanding?: boolean;
  isShop?: boolean;
}

export const BaseRouteMobile: FC<BaseRouteProps> = ({ children, sideNavigation, onboarding = false, isLanding = false, isShop = false }) => {
  const isOnboarding = onboarding ? routes.onboarding : routes.character;
  const { interactionMode } = useCharacterBuilder();

  const { pathname } = useLocation();
  const { section } = useParams<{ section: Section }>();
  const navigate = useNavigate();
  const home = () => {
    navigate(routes.character);
  };

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
          {/* <Box>
            <NavigationSection route={isOnboarding}>
              <NavigationTab title={text.navigation.character} route={isOnboarding} />
            </NavigationSection>
          </Box> */}
          <KreadContainerMobile onClick={home}>
            <KreadIcon />
          </KreadContainerMobile>
          {/* <RightBox>
            {isShop && <BuyCryptoButton />}
            {!isLanding && <>{pageSelector}</>}
            {sideNavigation}
          </RightBox> */}
        </TopbarContainer>
      )}
      <ChildrenContainer isLanding={isLanding}>{children}</ChildrenContainer>
      <FooterContainer isLanding={isLanding}>
        <Footer />
      </FooterContainer>
    </>
  );
};
