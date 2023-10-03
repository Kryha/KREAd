import React, { FC } from "react";

import { CharacterSelector, Group, ItemsSelector, SwitchButtonLeft, SwitchButtonRight } from "./styles";
import { Section } from "../../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { breakpoints } from "../../design";
import { useIsMobile } from "../../hooks";

interface SwitchSelectorProps {
  selectedSection: Section;
  path: string;
  buttonOneText: string;
  buttonTwoText: string;
  toggleDevMode?: boolean;
}

export const SwitchSelector: FC<SwitchSelectorProps> = ({ toggleDevMode = false, buttonOneText, buttonTwoText, selectedSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.split("/").slice(0, -1).join("/");
  const isMobile = useIsMobile(breakpoints.tablet);

  const handleItem = () => {
    navigate(`${basePath}/items`);
    toggleDevMode && window.location.reload();
  };

  const handleCharacter = () => {
    navigate(`${basePath}/characters`);
    toggleDevMode && window.location.reload();
  };

  return (
    <Group>
      <SwitchButtonLeft onClick={handleItem} selected={selectedSection === "items"}>
        {!isMobile && buttonOneText}
        {isMobile && <ItemsSelector />}
      </SwitchButtonLeft>
      <SwitchButtonRight onClick={handleCharacter} selected={selectedSection === "characters"}>
        {!isMobile && buttonTwoText}
        {isMobile && <CharacterSelector />}
      </SwitchButtonRight>
    </Group>
  );
};
