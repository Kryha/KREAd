import styled from "@emotion/styled";

import { color, fontWeight } from "../../design";
import { ButtonText } from "./text";

interface ButtonProps {
  backgroundColor?: string;
  fontColor?: string;
  borderColor?: string;
  visible?: boolean;
  disabled?: boolean;
}

export const PrimaryButton = styled.button<ButtonProps>`
  max-height: 35px;
  transition: all 0.4s ease 0s;
  display: flex;
  flex-direction: row;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 24px;
  font-family: "aktiv-grotesk";
  font-weight: ${fontWeight.medium};
  font-size: 14px;
  line-height: 18px;
  border: 1px solid ${color.black};
  box-sizing: border-box;
  align-items: center;
  letter-spacing: 0.05em;
  background: ${(props): string => props.backgroundColor || color.black};
  color: ${(props): string => props.fontColor || color.white};
  &:hover {
    color: ${(props): string => props.fontColor || color.black};
    background: ${(props): string => props.backgroundColor || color.white};
    border: 1px solid ${color.black};
    box-sizing: border-box;
    ${ButtonText} {
      color: ${(props): string => props.fontColor || color.black};
    }
  }
  &:active {
    background: ${(props): string => props.backgroundColor || color.white};
    border: 1px solid ${color.black};
    box-sizing: border-box;
  }
  &:focus {
    border: 1px solid ${color.black};
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
      border: 1px solid ${color.grey};
      &:hover {
        ${ButtonText} {
          color: ${color.white};
        }
        background: ${color.grey};
        border: 1px solid ${color.grey};
        > svg {
          path {
            stroke: ${color.white} !important;
          }
        }
      }
      &:focus {
        border: 1px solid ${color.grey};
      }
      &:active {
        border: 1px solid ${color.grey};
      }
      && {
        cursor: default;
      }
        `
      : "";
  }};
`;

export const SecondaryButton = styled(PrimaryButton) <ButtonProps>`
  color: ${(props): string => props.fontColor || color.black};
  border: 1px solid ${(props): string => props.borderColor || color.grey};
  background-color: ${(props): string => props.backgroundColor || "transparent"};
  ${ButtonText} {
    color: ${(props): string => props.fontColor || color.black};
  }
  padding: 8px 16px;
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
    border: 1px solid ${color.darkGrey};
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
  background-color: ${(props): string => props.backgroundColor || "transparent"};
  color: ${(props): string => props.fontColor || color.black};
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
    border: 1px solid ${color.black};
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
        border: 1px solid${color.black};
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
