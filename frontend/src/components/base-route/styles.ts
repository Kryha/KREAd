import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { breakpoints, margins, zIndex } from "../../design";

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
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  background: transparent;
  z-index: ${zIndex.overCharacter};
`;
