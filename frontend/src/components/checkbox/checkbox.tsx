import React, { FC } from "react";
import { ButtonText } from "../atoms";
import { CheckboxContainer, HiddenCheckbox, StyledCheckbox } from "./styles";

interface Props {
  checked: boolean;
  onChange: () => void;
  label: string;
}
export const Checkbox: FC<Props> = ({ checked, onChange, label }) => {
  return (
    <CheckboxContainer>
      <HiddenCheckbox checked={checked} onChange={onChange} />
      <StyledCheckbox />
      <ButtonText>{label}</ButtonText>
    </CheckboxContainer>
  );
};
