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
  padding: ${margins.medium};

  @media screen and (max-width: ${breakpoints.tablet}) {
    padding: ${margins.mini};
  }

  ${({ isLanding }) =>
    isLanding === true
      ? css`
          // animation: ${disappear}, ${fadeIn};
          // animation-duration: 0.8s, 2s;
          // animation-delay: 0s, 0.8s;
        `
      : css``};
`;

export const Box = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0;
  z-index: 1;
  align-items: center;
`;

export const ChildrenContainer = styled.div<AnimationProps>`
  display: flex;
  align-items: stretch;
  flex: 1 1 auto;
  ${({ isLanding }) =>
    isLanding === true
      ? css`
          margin-left: 0;
          margin-right: 0;
        `
      : css`
          margin-left: ${margins.medium};
          margin-right: ${margins.medium};
        `};
  @media screen and (max-width: ${breakpoints.tablet}) {
    margin-left: 0;
    margin-right: 0;
  }
`;

export const FooterContainer = styled.div<AnimationProps>`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  //position: absolute;
  //bottom: 0;
  //right: 0;
  width: 100%;
  background: ${color.white};
  z-index: ${zIndex.overCharacter};
  ${({ isLanding }) =>
    isLanding === true
      ? css`
          // animation: ${disappear}, ${fadeIn};
          // animation-duration: 0.8s, 2s;
          // animation-delay: 0s, 0.8s;
          display: none;
        `
      : css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 0.3s, 0.5s;
          animation-delay: 0s, 0.3s;
        `};
`;
