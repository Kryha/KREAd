import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { DetailSectionWrap } from "../../containers/detail-section/styles";
import { OverviewContainer } from "../../pages/inventory/styles";
import { Overlay } from "../atoms";
import { fadeOut, fadeUp } from "../atoms/animations";
import { EmptyCardWrapper } from "../empty-card/styles";
import { CharacterWrapper } from "../character-card/styles";

interface AnimationProps {
  entering?: boolean;
  exiting?: boolean;
}

export const FadeInOutWrapper = styled.div<AnimationProps>`
  ${CharacterWrapper} {
    ${({ entering, exiting }) => {
    if (entering)
      return css`
          animation: ${fadeUp} 1.2s ease-out 0s forwards;
          opacity: 0;
          transform: translate3d(0, 1rem, 0);
        `;
    if (exiting)
      return css`
          animation: ${fadeOut};
          animation-duration: 2s;
        `;
  }}
  }
  ${DetailSectionWrap} {
    ${({ entering, exiting }) => {
    if (entering === true)
      return css`
          animation: ${fadeUp} 1.2s ease-out 0s forwards;
          opacity: 0;
          transform: translate3d(0, 1rem, 0);
        `;
    if (exiting === true)
      return css`
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
    if (entering === true)
      return css`
          animation: ${fadeUp} 1.2s ease-out 0s forwards;
          opacity: 0;
          transform: translate3d(0, 1rem, 0);
        `;
    if (exiting === true)
      return css`
          animation: ${fadeOut};
          animation-duration: 2s;
        `;
  }}
  }
  ${OverviewContainer} {
    ${({ entering, exiting }) => {
    if (entering === true)
      return css`
          animation: ${fadeUp} 1.2s ease-out 0s forwards;
          opacity: 0;
          transform: translate3d(0, 1rem, 0);
        `;
    if (exiting === true)
      return css`
          animation: ${fadeOut};
          animation-duration: 2s;
        `;
  }}
  }
`;
