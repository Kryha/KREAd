import styled from "@emotion/styled";
import { color, margins } from "../../design";
import { ZoomInIcon, ZoomOutIcon } from "../../assets";

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
export const ControlArea = styled.footer`
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
