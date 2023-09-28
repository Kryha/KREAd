import styled from "@emotion/styled";
import { ButtonText, disappear, fadeIn, fadeOut, SecondaryButton } from "../atoms";
import { color, fontSize, margins } from "../../design";
import { DownloadProps } from "./download-image-modal";
import { css } from "@emotion/react";
import { DownloadIcon } from "../../assets";

interface ViewProps {
  height: number;
}

export const DownloadButton = styled(SecondaryButton)`
  padding: 19px 3px;
  border-radius: 50%;

  position: relative;
  /* Add styles for the pop-up */
  &::before {
    content: "Download Character";
    position: absolute;
    bottom: -2rem; /* Adjust the vertical position as needed */
    left: 50%;
    transform: translateX(-50%);
    background: ${color.black};
    color: ${color.white};
    padding: 0.25rem 0.5rem;
    font-size: ${fontSize.extraSmall};
    border-radius: ${margins.mini};
    opacity: 0;
    width: max-content;
    transition: opacity 0.3s ease-in-out;
  }

  /* Show the pop-up on hover */
  &:hover::before {
    opacity: 1;
  }
`;

export const Download = styled(DownloadIcon)`
  svg {
    height: 20px;
    width: 20px;
    margin: 0;
  }
`;

export const DownloadWrapper = styled.div<DownloadProps>`
  z-index: 1000;
  ${({ isOpen }): string => {
    return isOpen
      ? `
        position: relative;
        z-index: 1000;
        margin: auto;
        width: max-content;
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

export const DownloadContainer = styled.div<ViewProps>`
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
  background: ${color.lightGrey};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: ${margins.medium};
  ${({ height }): string => `max-height: ${height - 250}px;`};

  &.open {
    opacity: 1;
    visibility: visible;
  }
`;

export const DownloadHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: ${margins.small};
  border-bottom: 1px solid ${color.grey};
`;

export const DownloadContents = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  scrollbar-width: none;
`;

export const DownloadContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0;
  margin: ${margins.small} 0px;
  cursor: pointer;
  color: ${color.darkGrey};
  gap: 16px;
  :hover {
    ${ButtonText} {
      color: ${color.black};
    }
  }
`;
