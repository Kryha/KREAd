import styled from '@emotion/styled';

import { color, fontWeight } from '../../design';

export const Input = styled.input`
  color: ${color.black};
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.regular};
  font-size: 14px;
  line-height: 100%;
  background-color: transparent;

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

  box-sizing: border-box;
  outline: 0;
  border-width: 0 0 1px;
  border-color: ${color.grey};
  padding: 2px 0 20.5px 0;
  :hover {
    border-color: ${color.black};
  }
  :active {
    border-color: ${color.black};
  }
`;
