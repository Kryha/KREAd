import styled from "@emotion/styled";
import { breakpoints, color, fontWeight, margins } from "../../../design";
import { disappear, fadeIn, SecondaryButton } from "../../../components";
import { Equipped } from "../../../components/asset-card/styles";

interface StyleProps {
  height: number;
  isSelected?: boolean;
}

export const ItemButtonContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 0;
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
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 16px;
  margin-right: 16px;
  flex: 1 1 auto;
`;

export const ItemsRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: end;
`;
export const ItemDetailsButton = styled(SecondaryButton)``;

export const EquippedContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;

  ${Equipped} {
    width: 24px;
    height: 24px;
  }
`;
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
  height: 160px;
`;
export const ItemCardContainer = styled.div<ItemProps>`
  display: flex;
  transition: transform 0.3s ease; /* Add CSS transition for smooth animation */
  border-radius: ${margins.medium};
  border: 1px solid ${color.grey};
  ${({ isSelected }): string => (isSelected ? `background: whitesmoke; border: 1px solid ${color.black} ` : "background: white")};

  :hover {
    border: 1px solid ${color.black};
  }
`;

export const ItemImageCard = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 40%;
  height: 120px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${color.white};
  border-top-left-radius: ${margins.medium};
  border-bottom-left-radius: ${margins.medium};
`;
