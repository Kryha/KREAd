import styled from "@emotion/styled";
import { breakpoints, color, fontWeight, margins } from "../../../design";
import { disappear, fadeIn, SecondaryButton } from "../../../components";
import { DiagonalContainer, ElementContainer, PlusContainer } from "../../../components/item-card/styles";
import { css } from "@emotion/react";

interface StyleProps {
  height: number;
  isSelected?: boolean;
}

export const ItemButtonContainer = styled.div`
  margin-top: ${margins.medium};
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;
export const ItemInfoItem = styled.span`
  :first-letter {
    text-transform: capitalize;
  }
  font-weight: ${fontWeight.medium};
  font-size: 12px;
  white-space: nowrap;
  color: ${color.darkGrey};
`;
export const ItemInfo = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
`;

export const ItemDetailsButton = styled(SecondaryButton)``;
export const ItemCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${margins.small};
  gap: 8px;

  @media screen and (max-width: ${breakpoints.tablet}) {
    padding: 8px;
    margin: 0;
  }
`;

export const ItemCardsWrapper = styled.div<StyleProps>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: scroll;
  ${({ height }): string => `height: ${height - 480}px;`};
  ::-webkit-scrollbar {
    display: none;
  }
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.6s, 0.8s;
  animation-delay: 0s, 0.6s;
`;

interface ItemProps {
  isSelected?: boolean;
}

export const EmptyItemCardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ItemCardContainer = styled.div<ItemProps>`
  display: flex;
  gap: 16px;
  transition: transform 0.3s ease; /* Add CSS transition for smooth animation */

  ${ElementContainer} {
    ${({ isSelected }) =>
      isSelected === true
        ? css`
            background: ${color.lightGrey};
            border: 1px solid ${color.darkGrey};
            ${PlusContainer} {
              background-color: ${color.lightGrey};
            }
            ${DiagonalContainer} {
              background-color: ${color.lightGrey};
            }
          `
        : css`
            background: ${color.white};
            border: 1px solid ${color.lightGrey};
            ${PlusContainer} {
              background-color: ${color.white};
            }
            ${DiagonalContainer} {
              background-color: ${color.white};
            }
          `};
  }
`;

export const AdjustedItemButtonContainer = styled(ItemButtonContainer)`
  justify-content: center;
`;
