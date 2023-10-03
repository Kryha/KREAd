import { ButtonText, SecondaryButton } from "../atoms";
import React, { FC, useEffect } from "react";
import { color } from "../../design";
import { routes } from "../../navigation";
import { useCharacterBuilder } from "../../context/character-builder-context";
import { useLocation, useNavigate } from "react-router-dom";
import { CharacterIcon, CharactersIcon, InventoryIcon, MetricsIcon, StoreIcon } from "../../assets";
import { CHARACTER_SELECT_MODE } from "../../constants";
import styled from "@emotion/styled";

interface Props {
  isLanding?: boolean;
}
export const MobileNavbar: FC<Props> = ({ isLanding }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = React.useState<boolean>(false);
  const { setShowToast, setInteractionMode } = useCharacterBuilder();

  useEffect(() => {
    if (location.pathname === `${routes.shop}/items` || location.pathname === `${routes.shop}/characters`) {
      setShow(true);
    }
  }, [location.pathname]);

  return (
    <NavbarWrapper>
      <SecondaryButton onClick={() => navigate(`${routes.character}`)}>
        <ButtonText customColor={color.white}>
          <CharacterIcon />
        </ButtonText>
      </SecondaryButton>
      <SecondaryButton onClick={() => navigate(`${routes.shop}/items`)}>
        <ButtonText customColor={color.white}>
          <Store />
        </ButtonText>
      </SecondaryButton>
      <SecondaryButton onClick={() => navigate(`${routes.inventory}/items`)}>
        <ButtonText customColor={color.white}>
          <InventoryIcon />
        </ButtonText>
      </SecondaryButton>
      {isLanding && (
        <SecondaryButton onClick={() => setInteractionMode(CHARACTER_SELECT_MODE)}>
          <ButtonText customColor={color.white}>
            <CharactersIcon />
          </ButtonText>
        </SecondaryButton>
      )}
      {show && (
        <SecondaryButton onClick={() => setShowToast(true)}>
          <ButtonText customColor={color.white}>
            <MetricsIcon />
          </ButtonText>
        </SecondaryButton>
      )}
    </NavbarWrapper>
  );
};

export const NavbarWrapper = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: ${color.white};
  padding: 16px;
  justify-content: space-evenly;
  border-top: 1px solid ${color.darkGrey};
  ${SecondaryButton} {
    border: none;
  }
`;

const Store = styled(StoreIcon)`
  width: 30px;
  height: 30px;
`;

export const NavRoute = styled.div``;
