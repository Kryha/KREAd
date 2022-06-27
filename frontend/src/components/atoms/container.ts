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

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(50% 158.18% at 50% 79.69%, rgba(20, 20, 20, 0) 0%, rgba(20, 20, 20, 0.03) 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */, rgba(255, 255, 255, 0.8);
  z-index: 100;
`;
