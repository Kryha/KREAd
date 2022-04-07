import styled from "styled-components";

import { color, fontWeight, margins } from "../../design";

export const ButtonBase = styled.button`
    text-transform: uppercase;
    display: inline-block;
    transition: all 0.4s ease 0s;
    font-size: 15px;
    line-height: 18px;
    cursor: pointer;
    padding: ${margins.small} 14px;
    background: ${(props) => props.backgroundColor || color.limeGreen};
    font-weight: ${fontWeight.light};
    color: ${(props) => props.fontColor || color.black};
    border: none;
    ${({ disabled }) => {
      return disabled
        ? `
          color: ${color.placeholderGrey};
          background-color: ${color.buttonGrey};
          && {
            cursor: default;
          }
        `
        : "";
    }};
  ${({ visible }) => {
    return visible ? `display: none;`:
    ``;
  }};
`;

export const OutlinedButton = styled(ButtonBase)`
  border: ${(props) => `1px solid ${props.borderColor || color.black}}`};
  background: ${(props) => props.backgroundColor || color.white};
  color: ${(props) => props.fontColor || color.black};
`;
