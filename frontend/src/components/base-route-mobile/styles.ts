import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { breakpoints, color, margins, zIndex } from "../../design";

interface AnimationProps {
  isLanding: boolean;
}

export const NavBarDivider = styled.div`
  border: 0.5px solid ${color.grey};
  transform: rotate(90deg);
  width: 41px;
`;

export const TopbarContainer = styled.header<AnimationProps>`
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 12px;
  margin-bottom: -65px;
  align-items: flex-end;
  z-index: 100;
  top: 0;
  padding: ${margins.medium};
  background: transparent;

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

export const RightBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0;
  z-index: 1;
  align-items: center;
  gap: 12px;
`;

export const ChildrenContainer = styled.div<AnimationProps>`
  display: flex;
  flex: 1;
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
  bottom: 0;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  background: transparent;
  z-index: ${zIndex.overCharacter};
`;
