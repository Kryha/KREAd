import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { DetailSectionWrap } from "../../containers/detail-section/styles";
import { OverviewContainer } from "../../pages/inventory/styles";
import { Overlay } from "../atoms";
import { disappear, fadeOut, slideUpOpacity } from "../atoms/animations";
import { CharacterWrapper } from "../character-card/styles";
import { EmptyCardWrapper } from "../empty-card/styles";

interface AnimationProps {
  entering: boolean;
  exiting: boolean;
}

export const FadeInOutWrapper = styled.div<AnimationProps>`
  ${CharacterWrapper} {
    ${({ entering, exiting }) => {
    if (entering === true) return css`
      animation: ${disappear}, ${slideUpOpacity} 2s cubic-bezier(0.4, 0.9, 0.2, 1) 500ms forwards;
      animation-duration: 1.4s, 1.8s;
      animation-delay: 0s, 1.4s;
      `;
    if (exiting === true) return css`
      animation: ${fadeOut};
      animation-duration: 2s;
      `;
  }}
  }
  ${DetailSectionWrap} {
    ${({ entering, exiting }) => {
    if (entering === true) return css`
      animation: ${disappear}, ${slideUpOpacity} 1.5s cubic-bezier(0.4, 0.9, 0.2, 1) 500ms forwards;
      animation-duration: 0.4s, 0.8s;
      animation-delay: 0s, 0.4s;
      `;
    if (exiting === true) return css`
      animation: ${fadeOut};
      animation-duration: 0.6s;
      `;
  }}
  }
  ${Overlay} {
    ${({ exiting }) => {
    if (exiting === true) return css``;
  }}
    }
    ${EmptyCardWrapper} {
      ${({ entering, exiting }) => {
    if (entering === true) return css`
        animation: ${disappear}, ${slideUpOpacity} 2s cubic-bezier(0.4, 0.9, 0.2, 1) 500ms forwards;
        animation-duration: 0.4s, 0.6s;
        animation-delay: 0s, 0.4s;
      `;
    if (exiting === true) return css`
        animation: ${fadeOut};
        animation-duration: 2s;
      `;
  }}
    }
    ${OverviewContainer} {
      ${({ entering, exiting }) => {
    if (entering === true) return css`
        animation: ${disappear}, ${slideUpOpacity} 2s cubic-bezier(0.4, 0.9, 0.2, 1) 500ms forwards;
        animation-duration: 0.4s, 0.6s;
        animation-delay: 0s, 0.4s;
      `;
    if (exiting === true) return css`
        animation: ${fadeOut};
        animation-duration: 2s;
      `;
  }}
    }
  }
`;
