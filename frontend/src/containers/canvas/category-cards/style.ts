import styled from "@emotion/styled";
import { breakpoints, color, fontWeight } from "../../../design";
import { disappear, fadeIn } from "../../../components";

interface StyleProps {
  height: number;
  width: number;
  isSelected?: boolean;
}

export const CategoryInfoCategory = styled.span`
  :first-letter {
    text-transform: capitalize;
  }
  font-weight: ${fontWeight.medium};
  font-size: 14px;
  white-space: nowrap;
  color: ${color.darkGrey};
`;

export const CategoryInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const CategoryCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 8px;

  @media screen and (max-width: ${breakpoints.tablet}) {
    display: flex;
    flex-direction: row;
    overflow-x: scroll !important;
    overflow-y: hidden;
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const CategoryImage = styled.div`
  display: flex;
  position: relative;
`;
export const CategoryCardsWrapper = styled.div<StyleProps>`
  overflow-y: scroll;
  ${({ height }): string => `height: ${height - 190}px;`};
  ::-webkit-scrollbar {
    display: none;
  }
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.6s, 0.8s;
  animation-delay: 0s, 0.6s;

  /* Add a media query for the horizontal scrolling */
  @media screen and (max-width: ${breakpoints.tablet}) {
    overflow: hidden !important;
    height: fit-content;
    ${({ width }): string => `width: ${width}px;`};
  }
`;

interface CategoryProps {
  isSelected: boolean;
}

export const CategoryCard = styled.div<CategoryProps>`
  display: flex;
  position: relative;
  gap: 16px;
  transition: transform 0.3s ease; /* Add CSS transition for smooth animation */

  &:hover {
    ${CategoryInfoCategory} {
      color: ${color.black};
    }
  }

  @media screen and (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
`;
