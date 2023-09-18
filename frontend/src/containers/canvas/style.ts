import styled from "@emotion/styled";
import { disappear, fadeIn } from "../../components";
import { breakpoints, color, margins } from "../../design";
import { css } from "@emotion/react";

export const CanvasAssetInventoryWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin-top: 24px;
  margin-bottom: 24px;
  margin-right: 24px;

  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.6s, 0.8s;
  animation-delay: 0s, 0.6s;

  @media screen and (max-width: ${breakpoints.tablet}) {
    grid-area: bottom-pane;
    position: relative;
    width: 100%;
    margin: 0;
  }
`;

export const CanvasAssetHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: ${margins.small};
  border-bottom: 1px solid ${color.grey};

  @media screen and (max-width: ${breakpoints.tablet}) {
    flex-direction: row;
    padding-top: ${margins.mini};
    padding-bottom: ${margins.mini};
    padding-right: ${margins.mini};
    border-right: 1px solid ${color.grey};
  }
`;

interface Props {
  showDetails?: boolean;
}

export const CanvasAssetContainer = styled.div<Props>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
  width: 400px;
  background: ${color.white};
  border: 1px solid ${color.grey};
  border-radius: ${margins.medium};
  padding: ${margins.medium};
  ${({ showDetails }) =>
    showDetails === true
      ? css`
          background: ${color.lightGrey};
          width: 500px;
        `
      : css`
          background: ${color.white};
        `};

  @media screen and (max-width: ${breakpoints.tablet}) {
    height: fit-content;
    flex: none;
    padding: 0;
    border-radius: 0;
  }
`;

export const CanvasContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
