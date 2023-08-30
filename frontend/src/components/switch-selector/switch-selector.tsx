import React, { FC } from "react";

import { Group, SwitchButtonLeft, SwitchButtonRight } from "./styles";
import { useSearchParams } from "react-router-dom";

interface SwitchSelectorProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  buttonOneText: string;
  buttonTwoText: string;
  toggleDevMode?: boolean;
}

export const SwitchSelector: FC<SwitchSelectorProps> = ({
  toggleDevMode = false,
  buttonOneText,
  buttonTwoText,
  selectedIndex,
  setSelectedIndex,
}) => {
  const [, setSearchParams] = useSearchParams();
  const handleItemButtonClick = () => {
    setSelectedIndex(0);
    !toggleDevMode && setSearchParams({ section: "items" }, { relative: "path" });
    toggleDevMode && window.location.reload();
  };

  const handleCharacterButtonClick = () => {
    setSelectedIndex(1);
    !toggleDevMode && setSearchParams({ section: "characters" }, { relative: "path" });
    toggleDevMode && window.location.reload();
  };

  return (
    <Group>
      <SwitchButtonLeft onClick={handleItemButtonClick} selected={selectedIndex === 0}>
        {buttonOneText}
      </SwitchButtonLeft>
      <SwitchButtonRight onClick={handleCharacterButtonClick} selected={selectedIndex === 1}>
        {buttonTwoText}
      </SwitchButtonRight>
    </Group>
  );
};
