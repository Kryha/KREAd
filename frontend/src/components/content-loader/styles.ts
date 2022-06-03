import styled, { keyframes } from "styled-components";

import { color, margins } from "../../design";

const spin = keyframes`
  0% {
      transform: rotate(0deg);
  }
  100% {
      transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  border: 4px solid ${color.black};
  border-top: 4px solid ${color.offWhite};
  border-radius: 50%;
  width: ${margins.large};
  height: ${margins.large};
  animation: ${spin} 0.6s linear infinite;
`;

export const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 350px 0;
`;
