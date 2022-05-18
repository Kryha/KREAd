import styled from "styled-components";
import { Label } from "../../components";

interface ShopProps {
  height: number;
};

export const ShopWrapper = styled.div`
  margin: 40px 40px 120px 40px;
  position: relative;
`;

export const FilterWrapper = styled.div`
  position: sticky;
  display: flex;
  flex-direction: column;
  padding: 0px;
`;

export const FilterContainer = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 16px;
`;

export const SelectorContainer = styled.div`
  display: flex;
  gap: 16px;
`;

export const SortByContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px;
  align-items: center;
  ${Label} {
    margin-right: 10px;
  }
`;

export const ItemWrapper = styled.div<ShopProps>`
  overflow-y: scroll;
  ${({ height }): string => `height: ${height - 132}px;`};
`;

export const ItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding-top: 40px;
  align-items: flex-start;
`;

export const LoadMore = styled.div`
  margin-bottom: 150px;
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
