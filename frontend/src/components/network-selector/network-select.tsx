import React, { FC, useCallback, useState } from "react";
import { SelectBox, StyledSelect, Tick } from "./styles";
import { ButtonText } from "../atoms";
import { color } from "../../design";
import { useViewport } from "../../hooks";

export interface Options {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  onChange: (value: string) => void;
  options: readonly Options[];
}

export const NetworkSelect: FC<SelectProps> = ({ options, onChange }) => {
  const { height } = useViewport();

  const [selected, setSelected] = useState<string>(options[0].value);

  const handleOptionClick = useCallback(
    (index: number) => {
      const selectedValue = options[index].value;
      setSelected(selectedValue);
      onChange(selectedValue);
    },
    [onChange, options],
  );

  const isOptionSelected = (optionValue: string) => {
    return selected[0] === optionValue;
  };

  return (
    <SelectBox height={height}>
      {options.map((option, index) => (
        <React.Fragment key={index}>
          <StyledSelect
            selected={isOptionSelected(option.value)}
            onClick={() => {
              handleOptionClick(index);
            }}
          >
            <ButtonText customColor={isOptionSelected(option.value) ? color.black : color.darkGrey}>{option.label}</ButtonText>
            <Tick />
          </StyledSelect>
        </React.Fragment>
      ))}
    </SelectBox>
  );
};
