import React, { FC } from "react";
import { routes } from "../../navigation";
import { Footer } from "../footer";
import { ChildrenContainer, FooterContainer, TopbarContainer } from "./styles";
import { useCharacterBuilder } from "../../context/character-builder-context";
import { MAIN_MODE } from "../../constants";
import { useNavigate } from "react-router-dom";
import { KreadContainerMobile } from "../../pages/shop/styles";
import { KreadIcon } from "../logo/styles";

interface BaseRouteProps {
  sideNavigation: React.ReactNode;
  children?: React.ReactNode;
  onboarding?: boolean;
  isLanding?: boolean;
  isShop?: boolean;
}

export const BaseRouteMobile: FC<BaseRouteProps> = ({ children, isLanding = false}) => {
  const { interactionMode } = useCharacterBuilder();
  const navigate = useNavigate();
  const home = () => {
    navigate(routes.character);
  };

  return (
    <>
      {interactionMode === MAIN_MODE && (
        <TopbarContainer isLanding={isLanding}>
          <KreadContainerMobile onClick={home}>
            <KreadIcon />
          </KreadContainerMobile>
        </TopbarContainer>
      )}
      <ChildrenContainer isLanding={isLanding}>{children}</ChildrenContainer>
      <FooterContainer isLanding={isLanding}>
        <Footer />
      </FooterContainer>
    </>
  );
};
