
import { FC } from "react";
import { SwitchButtonLeft, SwitchButtonRight } from "./styles";

interface SwitchSelectorProps {
  buttonOneText: string;
  buttonTwoText: string;
}

// TODO: re-work @mui/material/ButtonGroup conponent w/o @mui

export const SwitchSelector: FC<SwitchSelectorProps> = ({ buttonOneText, buttonTwoText }) => {
  return (
    <div> {/* previously @mui/material/ButtonGroup */}
      <SwitchButtonLeft>{buttonOneText}</SwitchButtonLeft>
      <SwitchButtonRight>{buttonTwoText}</SwitchButtonRight>
    </div>
  );
}
