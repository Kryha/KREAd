import styled from "@emotion/styled";

import { color, margins } from "../../design";
import { Label } from "./text";

export const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${margins.medium};
  align-items: center;
  width: 100%;
  text-align: center;
`;

export const Badge = styled.span`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: ${margins.nano} ${margins.mini};
  background: ${color.lightGrey};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
  ${Label} {
    margin: 0px 10px;
  }
`;

export const FlexRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
`;

interface OverlayProps {
  isOnTop?: boolean;
}

export const Overlay = styled.div<OverlayProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.46);
  backdrop-filter: blur(4px);
  ${({ isOnTop }): string =>
    isOnTop
      ? `
    z-index: 1001;
      `
      : `
    z-index: 100;
   `};
`;
