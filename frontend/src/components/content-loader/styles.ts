import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { color, margins } from "../../design";
import { Loading } from "../../assets";

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
interface SpinnerProps {
  isSpinner?: boolean;
}

export const LoadingPageContainer = styled.div<SpinnerProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 350px 0;
  ${({ isSpinner }): string => {
    return isSpinner
      ? `
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 350px 0;
        `
      : `
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      `;
  }};
`;
interface AnimationProps {
  iteration?: number;
}

export const LogoWrap = styled.div<AnimationProps>`
  ${({ iteration }): string => `
  #eB1kvmsL79H3 {
    animation: eB1kvmsL79H3_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H3_c_o {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    52.941176% {
      opacity: 0;
    }
    82.352941% {
      opacity: 0;
    }
    85.294118% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  #eB1kvmsL79H5 {
    animation: eB1kvmsL79H5_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H5_c_o {
    0% {
      opacity: 0;
    }
    14.705882% {
      opacity: 0;
    }
    17.647059% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  #eB1kvmsL79H6 {
    animation: eB1kvmsL79H6_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H6_c_o {
    0% {
      opacity: 1;
    }
    14.705882% {
      opacity: 1;
    }
    17.647059% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    52.941176% {
      opacity: 1;
    }
    82.352941% {
      opacity: 1;
    }
    85.294118% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #eB1kvmsL79H8 {
    animation: eB1kvmsL79H8_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H8_c_o {
    0% {
      opacity: 0;
    }
    14.705882% {
      opacity: 0;
    }
    17.647059% {
      opacity: 1;
    }
    82.352941% {
      opacity: 1;
    }
    85.294118% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #eB1kvmsL79H9 {
    animation: eB1kvmsL79H9_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H9_c_o {
    0% {
      opacity: 1;
    }
    32.352941% {
      opacity: 1;
    }
    35.294118% {
      opacity: 0;
    }
    64.705882% {
      opacity: 0;
    }
    67.647059% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  #eB1kvmsL79H10 {
    animation: eB1kvmsL79H10_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H10_c_o {
    0% {
      opacity: 1;
    }
    14.705882% {
      opacity: 1;
    }
    17.647059% {
      opacity: 0;
    }
    32.352941% {
      opacity: 0;
    }
    35.294118% {
      opacity: 1;
    }
    64.705882% {
      opacity: 1;
    }
    67.647059% {
      opacity: 0;
    }
    82.352941% {
      opacity: 0;
    }
    85.294118% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  #eB1kvmsL79H12 {
    animation: eB1kvmsL79H12_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H12_c_o {
    0% {
      opacity: 1;
    }
    64.705882% {
      opacity: 1;
    }
    67.647059% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #eB1kvmsL79H13 {
    animation: eB1kvmsL79H13_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H13_c_o {
    0% {
      opacity: 0;
    }
    14.705882% {
      opacity: 0;
    }
    17.647059% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  #eB1kvmsL79H14 {
    animation: eB1kvmsL79H14_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H14_c_o {
    0% {
      opacity: 1;
    }
    32.352941% {
      opacity: 1;
    }
    35.294118% {
      opacity: 0;
    }
    64.705882% {
      opacity: 0;
    }
    67.647059% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  #eB1kvmsL79H16 {
    animation: eB1kvmsL79H16_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H16_c_o {
    0% {
      opacity: 0;
    }
    32.352941% {
      opacity: 0;
    }
    35.294118% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  #eB1kvmsL79H17 {
    animation: eB1kvmsL79H17_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H17_c_o {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    52.941176% {
      opacity: 0;
    }
    82.352941% {
      opacity: 0;
    }
    85.294118% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #eB1kvmsL79H19 {
    animation: eB1kvmsL79H19_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H19_c_o {
    0% {
      opacity: 1;
    }
    14.705882% {
      opacity: 1;
    }
    17.647059% {
      opacity: 0;
    }
    64.705882% {
      opacity: 0;
    }
    67.647059% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  #eB1kvmsL79H20 {
    animation: eB1kvmsL79H20_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H20_c_o {
    0% {
      opacity: 1;
    }
    82.352941% {
      opacity: 1;
    }
    85.294118% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #eB1kvmsL79H22 {
    animation: eB1kvmsL79H22_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H22_c_o {
    0% {
      opacity: 1;
    }
    32.352941% {
      opacity: 1;
    }
    35.294118% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    52.941176% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  #eB1kvmsL79H23 {
    animation: eB1kvmsL79H23_c_o 3400ms linear ${iteration || "infinite"} normal forwards;
  }
  @keyframes eB1kvmsL79H23_c_o {
    0% {
      opacity: 0;
    }
    14.705882% {
      opacity: 0;
    }
    17.647059% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  `};
`;

export const LoadingIcon = styled(Loading)`
  height: 24px;
`;
