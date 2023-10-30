import styled from "@emotion/styled";
import { CharacterImgs, sequentialFadeIn } from "../atoms";
import { zIndex as zIndexProps } from "../../design/spacing";
import { breakpoints } from "../../design";

export const CharacterContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: -1;
  @media (max-width: ${breakpoints.tablet}) {
    opacity: 0.5;
  }
`;

export const CharacterSwitchIcon = styled(CharacterImgs)`
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 1.5s;
`;
export const FirstIcon = styled(CharacterImgs)`
  ${({ zIndex }): string => `z-index: ${zIndex || zIndexProps.mid};`};
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 500ms;
`;

export const SecondIcon = styled(FirstIcon)`
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 1s;
`;

export const ThirdIcon = styled(FirstIcon)`
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 1.5s;
`;

export const FourthIcon = styled(FirstIcon)`
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 2s;
`;

export const FifthIcon = styled(FirstIcon)`
  opacity: 0;
  animation: ${sequentialFadeIn} 5s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 2.5s;
`;
