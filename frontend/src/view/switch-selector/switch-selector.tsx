
import { FC } from "react";
// TODO: replace @mui components
// import ButtonGroup from '@mui/material/ButtonGroup';
import { SwitchButtonLeft, SwitchButtonRight } from "./styles";

interface SwitchSelectorProps {
  buttonOneText: string;
  buttonTwoText: string;
}

export const SwitchSelector: FC<SwitchSelectorProps> = ({ buttonOneText, buttonTwoText }) => {
  return (
    // <ButtonGroup disableElevation >
    <div>
      <SwitchButtonLeft>{buttonOneText}</SwitchButtonLeft>
      <SwitchButtonRight>{buttonTwoText}</SwitchButtonRight>
    </div>
    // </ButtonGroup>
  );
}
