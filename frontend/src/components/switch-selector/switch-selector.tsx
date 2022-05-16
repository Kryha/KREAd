
import { FC } from "react";
import ButtonGroup from '@mui/material/ButtonGroup';

import { SwitchButtonLeft, SwitchButtonRight } from "./styles";

interface SwitchSelectorProps {
  buttonOneText: string;
  buttonTwoText: string;
}

export const SwitchSelector: FC<SwitchSelectorProps> = ({ buttonOneText, buttonTwoText }) => {
  return (
    <ButtonGroup disableElevation >
      <SwitchButtonLeft>{buttonOneText}</SwitchButtonLeft>
      <SwitchButtonRight>{buttonTwoText}</SwitchButtonRight>
    </ButtonGroup>
  );
}
