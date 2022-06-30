import styled from "@emotion/styled";
import { margins, zIndex } from "../../design";
import { disappear, fadeIn, fadeOut } from "../atoms";

interface Animation {
  showItems: boolean;
}

export const LeftItemContainer = styled.div<Animation>`
  position: absolute;
  width: 310px;
  height: 408px;
  left: ${margins.big};
  bottom: ${margins.big};
  z-index: ${zIndex.overCharacter};
  ${({ showItems }): string => {
    return showItems
      ? `
        animation: ${disappear}, ${fadeIn};
        animation-duration: 2.6s, 2s;
        animation-delay: 0s, 2.6s;
        `
      : `
      animation: ${fadeOut};
      animation-duration:2s;
      // animation-delay: 0s, 2.6s;
      `;
  }};
`;

export const RightItemContainer = styled.div<Animation>`
  position: absolute;
  width: 310px;
  height: 408px;
  right: 60px;
  bottom: ${margins.big};
  z-index: ${zIndex.overCharacter};
  ${({ showItems }): string => {
    return showItems
      ? `
        animation: ${disappear}, ${fadeIn};
        animation-duration: 2.6s, 2s;
        animation-delay: 0s, 2.6s;
        `
      : `
      animation: ${fadeOut};
      animation-duration: 2s;
      // animation-delay: 0s, 2.6s;
      `;
  }};
`;

export const RightItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: -22px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  margin: 24px 0px;
`;

export const Conta = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  margin: 24px 0px;
`;
