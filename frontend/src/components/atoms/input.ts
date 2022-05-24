import styled from "styled-components";

import { color } from "../../design";

export const Input = styled.input`
  color: ${color.black};
  font-family: Aktiv Grotesk Medium;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  background-color: transparent;

  -moz-appearance: textfield;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  ::placeholder {
    opacity: 0.4;
    color: ${color.darkGrey};
    :first-letter {
      text-transform: capitalize;
    }
  }

  box-sizing: border-box;
  outline: 0;
  border-width: 0 0 1px;
  border-color: ${color.grey};
  padding: 20.5px 0px;
  :hover {
    border-color: ${color.black};
  }
  :active {
    border-color: ${color.black};
  }
`;
