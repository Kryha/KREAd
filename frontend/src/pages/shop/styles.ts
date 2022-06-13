import styled from "styled-components";

import { RefreshIcon } from "../../assets";
import { Label } from "../../components";
import { DetailSectionWrap } from "../../containers/detail-section/styles";
import { margins } from "../../design";

interface ShopProps {
  height: number;
}

export const ShopWrapper = styled.div`
  margin: ${margins.big} ${margins.big} 120px ${margins.big};
  position: relative;

  ${DetailSectionWrap} {
    position: absolute;
    top: -5px;
    left: 0px;
    z-index: 30000000;
  }
`;

export const FilterWrapper = styled.div`
  position: sticky;
  display: flex;
  flex-direction: column;
  padding: 0px;
  z-index: 30000000;
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
  gap: ${margins.big};
  padding-top: ${margins.big};
  align-items: flex-start;
`;

export const LoadMore = styled.div`
  margin-bottom: 150px;
  margin-top: ${margins.big};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Refresh = styled(RefreshIcon)`
  margin-left: ${margins.mini};
`;
