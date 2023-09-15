import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { TriangleIcon } from "../../assets";
import { breakpoints, color, margins } from "../../design";
import { ButtonText, disappear, fadeIn, fadeOut } from "../atoms";

interface FilterProps {
  isOpen: boolean;
  disabled?: boolean;
  hasValue?: boolean;
}

export const FiltersWrapper = styled.div`
  position: relative;
`;

export const Triangle = styled(TriangleIcon)`
  margin-right: ${margins.mini};
`;

export const FiltersContainer = styled.div<FilterProps>`
  box-sizing: border-box;
  border: 1px solid ${color.grey};
  border-radius: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 160px;
  cursor: pointer;
  @media (max-width: ${breakpoints.tablet}) {
    min-width: 0;
  }

  padding: ${margins.mini} ${margins.mini} ${margins.mini} ${margins.small};
  &:hover {
    border: 1px solid ${color.black};
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
        `
      : `
      ${ButtonText} {
        color: ${color.darkGrey};
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

export const FilterOption = styled.div<FilterProps>`
  z-index: 1000;
  ${({ isOpen }): string => {
    return isOpen
      ? `
        position: absolute;
        margin-top: 14px;
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
