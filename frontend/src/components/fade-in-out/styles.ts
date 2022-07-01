import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { DetailSectionWrap } from "../../containers/detail-section/styles";
import { Overlay } from "../atoms";
import { disappear, fadeIn, fadeOut, slideUpOpacity } from "../atoms/animations";
import { CharacterWrapper } from "../character-card/styles";

interface AnimationProps {
  entering: boolean;
  exiting: boolean;
}

export const FadeInOutWrapper = styled.div<AnimationProps>`
  ${CharacterWrapper} {
    ${({ entering, exiting }) => {
    if (entering === true) return css`
      animation: ${disappear}, ${slideUpOpacity} 2s cubic-bezier(0.4, 0.9, 0.2, 1) 500ms forwards;
      animation-duration: 1.6s, 2s;
      animation-delay: 0s, 1.6s;
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
      animation-duration: 0.5s, 1s;
      animation-delay: 0s, 0.5s;
      `;
    if (exiting === true) return css`
      animation: ${fadeOut};
      animation-duration: 0.7s;
      `;
  }}
  }
  ${Overlay} {
    ${({ entering, exiting }) => {
    if (exiting === true) return css`

        `;
  }}
    }
  }
`;
