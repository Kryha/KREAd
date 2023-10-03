import { SecondaryButton } from "../atoms";
import React, { FC, useMemo } from "react";
import { color } from "../../design";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { text } from "../../assets";
import { Section } from "../../constants";
import styled from "@emotion/styled";
import { SwitchSelector } from "../switch-selector";
import { routes } from "../../navigation";
import { BuyCryptoButton } from "../base-route";
import { KreadContainer } from "../../pages/shop/styles";
import { KreadIcon } from "../logo/styles";

interface Props {
  isLanding?: boolean;
}
export const ShopNavbar: FC<Props> = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { section } = useParams<{ section: Section }>();
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
    <NavbarWrapper>
      <BuyCryptoButton />
      <KreadContainer onClick={home}>
        <KreadIcon />
      </KreadContainer>
      {pageSelector}
    </NavbarWrapper>
  );
};

export const NavbarWrapper = styled.div`
  display: flex;
  position: relative;
  top: 0;
  width: 100%;
  background-color: ${color.white};
  padding: 16px;
  justify-content: space-between;
  border-bottom: 1px solid ${color.darkGrey};
  z-index: 1000;
  ${SecondaryButton} {
    border: none;
  }
`;
