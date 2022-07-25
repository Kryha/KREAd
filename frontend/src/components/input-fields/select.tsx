import { FC, useState } from "react";

import { Tick, SelectBox, StyledSelect } from "./styles";
import { ButtonText } from "../atoms";
import { color } from "../../design";
import { useViewport } from "../../hooks";

export interface Options {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  handleChange: (selected: string) => void;
  options: Options[];
}

export const Select: FC<SelectProps> = ({ label, options, handleChange }) => {
  const [selected, setSelected] = useState(-1);
  const { height } = useViewport();
  return (
    <SelectBox height={height}>
      <StyledSelect selected={selected === -1} onClick={() => { handleChange(""); setSelected(-1); }}>
        <ButtonText customColor={selected === -1 ? color.black : color.darkGrey}>{label}</ButtonText>
        <Tick />
      </StyledSelect>
      {options.map((option, index) => (
        <StyledSelect selected={selected === index} key={index} onClick={() => { handleChange(options[index].value); setSelected(index); }}>
          <ButtonText customColor={selected === index ? color.black : color.darkGrey}>{option.label}</ButtonText>
          <Tick />
        </StyledSelect>
      ))}
    </SelectBox>
  );
};
