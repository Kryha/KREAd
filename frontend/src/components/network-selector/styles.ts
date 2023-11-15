import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { TickIcon, TriangleIcon } from "../../assets";
import { breakpoints, color, margins } from "../../design";
import { ButtonText, disappear, fadeIn, fadeOut } from "../atoms";
import { Diamond } from "../price-in-ist/styles";

interface NetworkSelectorProps {
  isOpen: boolean;
  disabled?: boolean;
  hasValue?: boolean;
}

export const NetworkSelectorWrapper = styled.div`
  position: relative;
`;

export const Triangle = styled(TriangleIcon)`
  margin-right: ${margins.mini};
`;

export const NetworkSelectorContainer = styled.div<NetworkSelectorProps>`
  box-sizing: border-box;
  border-radius: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 120px;
  cursor: pointer;
  @media (max-width: ${breakpoints.tablet}) {
    min-width: 0;
  }

  padding: ${margins.mini} ${margins.mini} ${margins.mini} ${margins.small};
  &:hover {
    ${ButtonText} {
      color: ${color.black};
    }
  }
  &:focus {
    border: 1px solid ${color.darkGrey};
    ${ButtonText} {
      color: ${color.black};
    }
  }
  &:active {
    border: 1px solid ${color.grey};
  }
  ${({ isOpen }): string => {
    return isOpen
      ? `
      ${ButtonText} {
        color: ${color.black};
      }
      ${Triangle} {
        transform: rotate(180deg);
        transition: transform 0.2s ease 0.2s;
        }
        `
      : `
        ${ButtonText} {
          color: ${color.darkGrey};
        }
       ${Triangle} {
        transform: rotate(0);
        transition: transform 0.1s ease 0.1s;
        }
      `;
  }};
  ${({ disabled }): string => {
    return disabled
      ? `
      ${ButtonText} {
        color: ${color.grey};
      }
      ${Triangle} {
        path {
          fill: ${color.grey};
          stroke: ${color.grey};
        }
      }

        `
      : "";
  }};
  ${({ hasValue }): string => {
    return hasValue
      ? `
      ${ButtonText} {
        color: ${color.black};
      }
        `
      : "";
  }};
`;

export const NetworkSelectorOption = styled.div<NetworkSelectorProps>`
  z-index: 1000;
  ${({ isOpen }): string => {
    return isOpen
      ? `
        position: absolute;
        bottom: 40px;
        z-index: 1000;
        `
      : `
      display: none;
      `;
  }};
  ${({ isOpen }) =>
    isOpen === true
      ? css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 0.2s, 0.5s;
          animation-delay: 0s, 0.2s;
        `
      : css`
          animation: ${fadeOut};
          animation-duration: 0.5s;
        `};
`;

interface SelectProps {
  selected: boolean;
}

export const Tick = styled(TickIcon)``;

export const StyledSelect = styled.div<SelectProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0;
  margin: ${margins.small} 0px;
  cursor: pointer;
  :hover {
    ${ButtonText} {
      color: ${color.black};
    }
    ${Diamond} {
      background: ${color.black};
    }
  }
  ${Tick} {
    ${({ selected }) => !selected && "display: none"}
  }
  ${Diamond} {
    align-self: center;
    margin-left: -25px;
    background: ${({ selected }) => (selected ? color.black : color.grey)};
  }
`;

interface ViewProps {
  height: number;
}

export const SelectBox = styled.div<ViewProps>`
  display: flex;
  flex-direction: column;
  width: 200px;
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
  background: ${color.lightGrey};
  padding: ${margins.medium};
`;
export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${margins.small};
  align-items: center;
  justify-content: center;
  padding: 0;
`;
