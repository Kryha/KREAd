import styled from "@emotion/styled";
import { color } from "../../design";

export const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

export const StyledCheckbox = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid ${color.darkGrey}; /* Change the border style to match your design */
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px; /* Adjust spacing as needed */
  transition: all 0.2s;

  input:checked {
    background-color: ${color.black}; /* Change the background color when checked */
    border-color: ${color.black}; /* Change the border color when checked */
    color: #fff; /* Change the color of the checkmark when checked */
  }

  input:checked {
    visibility: visible; /* Show the checkmark icon when checked */
  }
`;
