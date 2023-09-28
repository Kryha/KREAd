import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { margins, zIndex } from "../../../design";
import { disappear, fadeIn, fadeOut } from "../../../components";

interface Animation {
  showItems: boolean;
}

export const LeftItemContainer = styled.div<Animation>`
  position: absolute;
  left: ${margins.medium};
  bottom: ${margins.medium};
  z-index: ${zIndex.overCharacter};
  ${(props) =>
    props.showItems === true
      ? css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 0.6s, 0.8s;
          animation-delay: 0s, 0.6s;
        `
      : css`
          animation: ${fadeOut};
          animation-duration: 0.5s;
        `};
  ${({ showItems }): string => {
    return showItems
      ? `

        `
      : `
        opacity: 0;
        pointer-events: none;
      `;
  }};
`;

export const RightItemContainer = styled.div<Animation>`
  position: absolute;
  right: ${margins.medium};
  bottom: ${margins.medium};
  z-index: ${zIndex.overCharacter};
  ${(props) =>
    props.showItems === true
      ? css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 0.6s, 0.8s;
          animation-delay: 0s, 0.6s;
        `
      : css`
          animation: ${fadeOut};
          animation-duration: 0.5s;
        `};
  ${({ showItems }): string => {
    return showItems
      ? `

        `
      : `
      opacity: 0;
      pointer-events: none;
      `;
  }};
`;

export const RightItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const LeftItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  padding: 0;
  margin: 24px 0;
`;
