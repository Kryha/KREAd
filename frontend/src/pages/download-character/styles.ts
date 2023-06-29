import styled from "@emotion/styled";
import { color, margins } from "../../design";
import { ZoomInIcon, ZoomOutIcon } from "../../assets";
import { css } from "@emotion/react";
import { ButtonText, disappear, fadeIn, fadeOut } from "../../components";

export interface DownloadProps {
  isOpen: boolean;
  onClose: () => void;
}

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
`;
export const ControlAreaBottom = styled.footer`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 0 20px;
  flex-wrap: nowrap;
  opacity: 1;
  bottom: 1rem;
  border-radius: 20px;
  pointer-events: all;
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
`;

export const ZoomResetButton = styled.button`
  border-left: 0 !important;
  border-right: 0 !important;
  padding: 0 0.625rem !important;
  justify-content: center;
  color: ${color.black};
  background: ${color.white};
  border-top: 1px solid ${color.grey};
  border-bottom: 1px solid ${color.grey};
  height: 100%;
  width: 100%;
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
`;

export const ZoomIn = styled(ZoomInIcon)`
  svg {
    height: 20px;
    width: 20px;
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
        position: absolute;
        margin-bottom: 40px;
        bottom: 0;
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
