import styled from "@emotion/styled";
import { color, fontSize, margins } from "../../design";
import { DownloadIcon, ZoomInIcon, ZoomOutIcon } from "../../assets";
import { css } from "@emotion/react";
import { ButtonText, disappear, fadeIn, fadeOut, SecondaryButton } from "../../components";
import { DownloadProps } from "../../components/download-image/download-image-modal";

interface ViewProps {
  height: number;
}

export const CanvasArea = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden !important;
  margin: auto;
`;

export const ControlAreaWrapper = styled.div`
  position: absolute;
  z-index: 100;
  height: 100%;
  width: 100%;
  pointer-events: none;
  touch-action: none;
`;

export const ControlAreaBody = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  pointer-events: all;
`;

export const ControlAreaBottomWrapper = styled.footer`
  position: absolute;
  width: 100%;
  opacity: 1;
  bottom: 1rem;
  pointer-events: all;
`;

export const ControlAreaBottom = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 24px;
  border-radius: 20px;
  padding: 0 20px;
`;
export const ControlAreaTop = styled.header`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 0 20px;
  flex-wrap: nowrap;
  opacity: 1;
  top: 1rem;
  border-radius: 20px;
  pointer-events: all;
`;
export const ZoomActions = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-template-rows: auto;
  align-items: center;
  height: 35px;
`;

export const ZoomContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: min-content;
  grid-template-columns: auto;
`;

export const ZoomInButton = styled.button`
  border-top-right-radius: ${margins.mini};
  border-bottom-right-radius: ${margins.mini};
  background: ${color.white};
  border: 1px solid ${color.grey};
  height: 100%;
  width: 100%;
  &:hover {
    background: ${color.lightGrey};
  }
`;

export const ZoomResetButton = styled.button`
  border-left: 0 !important;
  border-right: 0 !important;
  padding: 0 0.625rem !important;
  justify-content: center;
  color: ${color.black};
  font-size: ${fontSize.extraSmall};
  background: ${color.white};
  border-top: 1px solid ${color.grey};
  border-bottom: 1px solid ${color.grey};
  height: 100%;
  width: 100%;

  position: relative;
  /* Add styles for the pop-up */
  &::before {
    content: "Reset Zoom";
    position: absolute;
    top: -2rem; /* Adjust the vertical position as needed */
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

export const ZoomOutButton = styled.button`
  border-top-left-radius: ${margins.mini};
  border-bottom-left-radius: ${margins.mini};
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  background: ${color.white};
  border: 1px solid ${color.grey};
  height: 100%;
  width: 100%;
  &:hover {
    background: ${color.lightGrey};
  }
`;

export const ZoomIn = styled(ZoomInIcon)`
  svg {
    height: 20px;
    width: 20px;
  }
`;

export const DownloadButton = styled(SecondaryButton)`
  background: ${color.white};
  padding: 19px 3px;
  border-radius: 50%;

  position: relative;
  /* Add styles for the pop-up */
  &::before {
    content: "Download Character";
    position: absolute;
    top: -2rem; /* Adjust the vertical position as needed */
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

export const ZoomOut = styled(ZoomOutIcon)`
  svg {
    height: 20px;
    width: 20px;
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
        width: 50%;
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
  flex-direction: column;
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
