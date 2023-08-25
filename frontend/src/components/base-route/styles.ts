import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { breakpoints, color, margins, zIndex } from "../../design";
import { disappear, fadeIn } from "../atoms";

interface AnimationProps {
  isLanding: boolean;
}

export const TopbarContainer = styled.header<AnimationProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 100;
  padding: ${margins.big};

  @media screen and (max-width: ${breakpoints.tablet}) {
    padding: ${margins.small};
  }

  ${({ isLanding }) =>
    isLanding === true
      ? css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 0.8s, 2s;
          animation-delay: 0s, 0.8s;
        `
      : css``};
`;

export const Box = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px;
  z-index: 1;
  align-items: center;
`;

export const ChildrenContainer = styled.div<AnimationProps>`
  display: flex;
  ${({ isLanding }) =>
    isLanding === true
      ? css`
          margin-left: ${margins.big};
          margin-right: ${margins.big};
        `
      : css`
          margin-left: auto;
          margin-right: auto;
        `};
`;

export const FooterContainer = styled.div<AnimationProps>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  background: ${color.white};
  z-index: ${zIndex.overCharacter};
  ${({ isLanding }) =>
    isLanding === true
      ? css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 0.8s, 2s;
          animation-delay: 0s, 0.8s;
        `
      : css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 0.3s, 0.5s;
          animation-delay: 0s, 0.3s;
        `};
`;
