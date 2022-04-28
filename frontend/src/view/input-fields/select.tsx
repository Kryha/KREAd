import { FC } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SelectForm from '@mui/material/Select';

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

export const Select: FC<SelectProps> = ({ label, handleChange, input, options }) => {
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <SelectForm
          value={input}
          label={label}
          onChange={handleChange}
        >
          {options.map((option) => (
            <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
          ))}
        </SelectForm>
      </FormControl>
    </Box>
  );
}
