
import { FC, useState } from "react";

import { SwitchButtonLeft, SwitchButtonRight, Group } from "./styles";

interface SwitchSelectorProps {
  buttonOneText: string;
  buttonTwoText: string;
  handleView: (changeView: boolean) => void;
}

export const SwitchSelector: FC<SwitchSelectorProps> = ({ buttonOneText, buttonTwoText, handleView }) => {
  const [switchView, setSwitchView] = useState(false);

  return (
    <Group>
      <SwitchButtonLeft onClick={() => { setSwitchView(false); handleView(false); }} selected={switchView}>{buttonOneText}</SwitchButtonLeft>
      <SwitchButtonRight onClick={() => { setSwitchView(true); handleView(true); }} selected={switchView}>{buttonTwoText}</SwitchButtonRight>
    </Group>
  );
};
