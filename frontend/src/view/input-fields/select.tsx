import { FC, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import { FormBox, Label, SelectArrow, StyledSelect } from "./styles";


interface Options {
  label: string;
  value: string;
};

interface SelectProps {
  label: string;
  input: string;
  handleChange: (event: any) => void;
  options: Options[];
};

export const Select: FC<SelectProps> = ({ label, input, options }) => {
  const [age, setAge] = useState("");

  const handleChange = (event: any) => {
    setAge(event.target.value);
  };

  return (
    <FormBox>
      <FormControl fullWidth>
        <Label>{label}</Label>
        <StyledSelect
          value={age}
          label={label}
          onChange={handleChange}
          IconComponent={props => (<SelectArrow {...props} />)}
        >
          {options.map((option) => (
            <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </FormBox>
  );
}
