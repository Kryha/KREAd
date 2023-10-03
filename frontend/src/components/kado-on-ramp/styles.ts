import styled from "@emotion/styled";
import { breakpoints, color } from "../../design";

export const KadoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  iframe {
    border: 1px solid ${color.grey};
    border-radius: 24px;
    width: 500px;
    height: 700px;
  }
  @media screen and (max-width: ${breakpoints.tablet}) {
    width: 100vw;
    height: 100vh;
    margin-top: 24px;
    iframe {
      border-radius: 0;
      border: none;
      width: 100%;
      height: 100%;
    }
  }
`;

export const KadoWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
`;
