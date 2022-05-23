import styled from "styled-components";

import { color, fontWeight } from "../../design";

interface ButtonProps {
  backgroundColor?: string;
  fontColor?: string;
  borderColor?: string;
  visible?: boolean;
}

export const ButtonBase = styled.button<ButtonProps>`
  ::first-letter {
    text-transform: capitalize;
  };
  font-family: Aktiv Grotesk Medium;
  display: inline-block;
  transition: all 0.4s ease 0s;
  font-size: 12px;
  line-height: 15px;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 3px 8px 3px 16px;
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
    return visible ? `display: none;` :
      ``;
  }};
`;

export const OutlinedButton = styled(ButtonBase)`
  border: ${(props): string => `1px solid ${props.borderColor || color.grey}}`};
  background: ${(props): string => props.backgroundColor || "transparent"};
  color: ${(props): string => props.fontColor || color.black};
  border-radius: 24px;
`;
