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
  buttonOneText,
  buttonTwoText,
  selectedIndex,
  setSelectedIndex,
}) => {
  return (
    <Group>
      <SwitchButtonLeft
        onClick={() => setSelectedIndex(0)}
        selected={selectedIndex === 0}
      >
        {buttonOneText}
      </SwitchButtonLeft>
      <SwitchButtonRight
        onClick={() => setSelectedIndex(1)}
        selected={selectedIndex === 1}
      >
        {buttonTwoText}
      </SwitchButtonRight>
    </Group>
  );
};
