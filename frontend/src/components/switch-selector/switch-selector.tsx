import { FC } from "react";

import { SwitchButtonLeft, SwitchButtonRight, Group } from "./styles";

interface SwitchSelectorProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  buttonOneText: string;
  buttonTwoText: string;
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
