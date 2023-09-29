import React, { FC, useCallback, useEffect, useState } from "react";
import { ClearButton, SelectBox, StyledSelect, Tick } from "./styles";
import { ButtonText, HorizontalDivider } from "../atoms";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { CloseIcon } from "../../assets";

export interface Options {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  onArrayChange?: (selected: any[]) => void;
  onChange?: (selected: string) => void;
  options: Options[];
  isMultiSelect?: boolean;
  reset: boolean; // Add a reset prop to signal when to reset the component
}

export const Select: FC<SelectProps> = ({ options, onChange, onArrayChange, isMultiSelect = false, reset }) => {
  const { height } = useViewport();

  const [selected, setSelected] = useState<string[]>(isMultiSelect ? [] : [options.length > 0 ? options[0].value : ""]);

  // Function to reset the component's state to its initial state
  const resetComponent = () => {
    setSelected(isMultiSelect ? [] : [options.length > 0 ? options[0].value : ""]);
    onArrayChange && onArrayChange([]);
    onChange && onChange("");
  };
  useEffect(() => {
    // Check if the reset prop is true and reset the component's state
    if (reset) {
      resetComponent();
    }
  }, [reset]);

  const handleOptionClick = useCallback(
    (index: number) => {
      const selectedValue = options[index].value;
      if (isMultiSelect) {
        setSelected((prevSelected) => {
          if (prevSelected.includes(selectedValue)) {
            // Remove the selected option
            const updatedSelected = prevSelected.filter((val) => val !== selectedValue);
            if (onArrayChange) {
              onArrayChange(updatedSelected);
            }
            return updatedSelected;
          } else {
            // Add the selected option
            const updatedSelected = [...prevSelected, selectedValue];
            if (onArrayChange) {
              onArrayChange(updatedSelected);
            }
            return updatedSelected;
          }
        });
      } else {
        setSelected([selectedValue]);
        if (onChange) {
          onChange(selectedValue);
        }
      }
    },
    [isMultiSelect, onChange, onArrayChange, options],
  );

  const isOptionSelected = (optionValue: string) => {
    if (isMultiSelect) {
      return selected.includes(optionValue);
    }
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
      <HorizontalDivider />
      <ClearButton>
        <ButtonText onClick={resetComponent} customColor={color.darkGrey}>
          reset
        </ButtonText>
        <CloseIcon />
      </ClearButton>
    </SelectBox>
  );
};
