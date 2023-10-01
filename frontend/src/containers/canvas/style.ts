import styled from "@emotion/styled";
import { disappear, fadeIn, SecondaryButton } from "../../components";
import { breakpoints, color, fontSize, margins } from "../../design";

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

export const CanvasAssetContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
  width: 400px;
  background: ${color.white};
  border: 1px solid ${color.grey};
  border-radius: ${margins.medium};
  padding: ${margins.medium};

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

export const CardActionsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 16px;
  justify-content: center;
  margin-top: ${margins.small};
  margin-bottom: ${margins.mini};
`;

export const Store = styled.div`
  z-index: 1;
  ${SecondaryButton} {
    position: relative;
    /* Add styles for the pop-up */
    &::before {
      content: "Go to Store";
      position: absolute;
      top: -2rem; /* Adjust the vertical position as needed */
      left: 50%;
      transform: translateX(-50%);
      background: ${color.black};
      color: ${color.white};
      padding: 0.25rem 0.5rem;
      font-size: ${fontSize.extraSmall};
      border-radius: ${margins.mini};
      opacity: 0;
      width: max-content;
      transition: opacity 0.3s ease-in-out;
    }

    /* Show the pop-up on hover */
    &:hover::before {
      opacity: 1;
    }
  }
`;
