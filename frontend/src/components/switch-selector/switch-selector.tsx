
import { FC } from "react";

import { SwitchButtonLeft, SwitchButtonRight, Group } from "./styles";

interface SwitchSelectorProps {
  buttonOneText: string;
  buttonTwoText: string;
}

export const SwitchSelector: FC<SwitchSelectorProps> = ({ buttonOneText, buttonTwoText }) => {
  return (
    <Group disableElevation >
      <SwitchButtonLeft>{buttonOneText}</SwitchButtonLeft>
      <SwitchButtonRight>{buttonTwoText}</SwitchButtonRight>
    </Group>
  );
};
