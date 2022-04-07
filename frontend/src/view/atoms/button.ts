import styled from "styled-components";

import { color, fontWeight, margins } from "../../design";

interface ButtonProps {
  backgroundColor?: string;
  fontColor?: string;
  borderColor?: string;
  visible?: boolean;
}

export const ButtonBase = styled.button<ButtonProps>`
    text-transform: uppercase;
    display: inline-block;
    transition: all 0.4s ease 0s;
    font-size: 15px;
    line-height: 18px;
    cursor: pointer;
    padding: ${margins.small} 14px;
    background: ${(props): string => props.backgroundColor || color.limeGreen};
    font-weight: ${fontWeight.light};
    color: ${(props): string => props.fontColor || color.black};
    border: none;
    ${({ disabled }): string => {
      return disabled
        ? `
          color: ${color.grey};
          background-color: ${color.white};
          && {
            cursor: default;
          }
        `
        : "";
    }};
  ${({ visible }): string => {
    return visible ? `display: none;`:
    ``;
  }};
`;

export const OutlinedButton = styled(ButtonBase)`
  border: ${(props): string => `1px solid ${props.borderColor || color.black}}`};
  background: ${(props): string => props.backgroundColor || color.white};
  color: ${(props): string => props.fontColor || color.black};
`;
