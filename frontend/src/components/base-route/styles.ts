import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { margins, zIndex } from "../../design";
import { disappear, fadeIn } from "../atoms/animations";

interface AnimationProps {
  isLanding: boolean;
}

export const TopbarContainer = styled.header<AnimationProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: ${margins.big};
  ${({ isLanding }) => (isLanding === true ?
    css`
    animation: ${disappear}, ${fadeIn};
    animation-duration: 0.8s, 2s;
    animation-delay: 0s, 0.8s;
    `
    :
    css``)};
`;

export const Box = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px;
`;

export const ChildrenContainer = styled.div`
  margin-bottom: 40px;
`;

export const FooterContainer = styled.div<AnimationProps>`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: ${zIndex.overCharacter};
  ${({ isLanding }) => (isLanding === true ?
    css`
    animation: ${disappear}, ${fadeIn};
    animation-duration: 0.8s, 2s;
    animation-delay: 0s, 0.8s;
    `
    :
    css`
    animation: ${disappear}, ${fadeIn};
    animation-duration: 0.3s, 0.5s;
    animation-delay: 0s, 0.3s;
  `)};
`;
