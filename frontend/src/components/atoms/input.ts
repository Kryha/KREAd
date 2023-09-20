import styled from "@emotion/styled";

import { color, fontWeight } from "../../design";

export const Input = styled.input`
  color: ${color.black};
  font-weight: ${fontWeight.regular};
  font-size: 14px;
  line-height: 100%;
  background-color: transparent;
  width: 80% !important;

  -moz-appearance: textfield;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &::placeholder {
    color: ${color.darkGrey};
    :first-letter {
      text-transform: capitalize;
    }
  }
  padding: 0;

  box-sizing: border-box;
  outline: 0;
  border-width: 0 0 1px;
  border-color: ${color.grey};
  :hover {
    border-color: ${color.black};
  }
  :active {
    border-color: ${color.black};
  }
`;
