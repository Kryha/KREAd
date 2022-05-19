import styled from "styled-components";

import { color, fontWeight } from "../../design";
import { ButtonText } from "./text";

interface ButtonProps {
  backgroundColor?: string;
  fontColor?: string;
  borderColor?: string;
  visible?: boolean;
  disabled?: boolean;
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
  background: ${(props): string => props.backgroundColor || color.black};
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
    return visible ? "display: none;" :
      "";
  }};
`;

export const PrimaryButton = styled.div<ButtonProps>`
  transition: all 0.4s ease 0s;
  display: table-cell;
  flex-direction: row;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 24px;
  font-family: Aktiv Grotesk Medium;
  font-weight: ${fontWeight.light};
  font-size: 14px;
  line-height: 18px;
  border: 2px solid ${color.black};
  box-sizing: border-box;
  align-items: center;
  letter-spacing: 0.05em;
  display: flex;
  background: ${(props): string => props.backgroundColor || color.black};
  ${ButtonText} {
    color: ${(props): string => props.fontColor || color.white};
  }
  &:hover {
    background: ${(props): string => props.backgroundColor || color.white};
    border: 2px solid ${color.black};
    box-sizing: border-box;
  }
  &:active {
    background: ${(props): string => props.backgroundColor || color.white};
    border: 2px solid ${color.black};
    box-sizing: border-box;
  }
  &:focus {
    border: 2px solid ${color.black};
    outline: none;
    box-sizing: border-box;
  }
  ${({ disabled }): string => {
    return disabled
      ? `
      ${ButtonText} {
        color: ${color.white};
      }
      background: ${color.grey};
      opacity: 0.4;
      border: 2px solid ${color.grey};
      &:hover {
        ${ButtonText} {
          color: ${color.white};
        }
        background: ${color.grey};
        opacity: 0.4;
        border: 2px solid ${color.grey};
      }
      &:focus {
        border: 2px solid ${color.grey};
      }
      &:active {
        border: 2px solid ${color.grey};
      }
      && {
        cursor: default;
      }
        `
      : "";
  }};
`;

export const SecondaryButton = styled(PrimaryButton) <ButtonProps>`
  border: 1px solid ${(props): string => props.borderColor || color.grey};
  background-color: ${(props): string => props.backgroundColor || "transparent"};
  ${ButtonText} {
    color: ${(props): string => props.fontColor || color.black};
  }
  padding: 10px 16px;
  > svg {
    margin: 0px 6px;
  }
  &:hover {
    border: 1px solid ${color.black};
    background-color: ${(props): string => props.backgroundColor || "transparent"};
    ${ButtonText} {
      color: ${(props): string => props.fontColor || color.black};
    }
  }
  &:active {
    background: ${color.lightGrey};
    border: 1px solid ${color.black};
    ${ButtonText} {
      color: ${color.black};
    }
    box-sizing: border-box;
  }
  &:focus {
    border: 2px solid ${color.darkGrey};
    outline: none;
    box-sizing: border-box;
  }
  ${({ disabled }): string => {
    return disabled
      ? `
      ${ButtonText} {
        color: ${color.grey};
      }
      background: ${color.white};
      border: 1px solid ${color.grey};
      &:hover {
        ${ButtonText} {
          color: ${color.grey};
        }
        background: ${color.white};
        border: 1px solid ${color.grey};
      }
      &:focus {
        ${ButtonText} {
          color: ${color.grey};
        }
        background: ${color.white};
        border: 1px solid ${color.grey};
      }
      &:active {
        ${ButtonText} {
          color: ${color.grey};
        }
        background: ${color.white};
        border: 1px solid ${color.grey};
      }
      && {
        cursor: default;
      }
        `
      : "";
  }};
`;

export const TertiaryButton = styled(PrimaryButton) <ButtonProps>`
  border: none;
  outline: none;
  &:hover {
    background: ${(props): string => props.backgroundColor || "transparent"};
    border: none;
    outline: none;
    box-sizing: border-box;
  }
  &:active {
    background: ${(props): string => props.backgroundColor || "transparent"};
    border: none;
    outline: none;
    box-sizing: border-box;
  }
  &:focus {
    border: 2px solid ${color.black};
    box-sizing: border-box;
  }
  ${({ disabled }): string => {
    return disabled
      ? `
      ${ButtonText} {
        color: ${color.white};
      }
      &:hover {
        ${ButtonText} {
          color: ${color.white};
        }
        opacity: 0.4;
      }
      &:focus {
        border: 2px solid${color.black};
      }
      &:active {
      }
      && {
        cursor: default;
      }
        `
      : "";
  }};
`;

export const OutlinedButton = styled(ButtonBase) <ButtonProps>`
  border: ${(props): string => `1px solid ${props.borderColor || color.grey}}`};
  background: ${(props): string => props.backgroundColor || "transparent"};
  color: ${(props): string => props.fontColor || color.black};
  border-radius: 24px;
`;
