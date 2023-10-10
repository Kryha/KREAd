import React, { FC } from "react";

import { Group, SwitchButtonLeft, SwitchButtonRight } from "./styles";
import { Section } from "../../constants";
import { useLocation, useNavigate } from "react-router-dom";

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
        {buttonOneText}
      </SwitchButtonLeft>
      <SwitchButtonRight onClick={handleCharacter} selected={selectedSection === "characters"}>
        {buttonTwoText}
      </SwitchButtonRight>
    </Group>
  );
};
