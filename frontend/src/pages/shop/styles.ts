import styled from "@emotion/styled";
import { BellIcon, CloseIcon, RefreshIcon } from "../../assets";
import { HorizontalDivider, Label, SecondaryButton } from "../../components";
import { DetailSectionWrap } from "../../containers/detail-section/styles";
import { color, margins } from "../../design";

interface ShopProps {
  height: number;
}

export const ShopWrapper = styled.div`
  margin: 0px ${margins.big} 120px ${margins.big};
  position: relative;

  ${DetailSectionWrap} {
    position: absolute;
    top: -80px;
    left: 0px;
    z-index: 30000000;
  }
`;

export const FilterWrapper = styled.div`
  position: sticky;
  display: flex;
  flex-direction: column;
  padding: 0px;
  z-index: 30;
  ${HorizontalDivider} {
    margin-top: 4px;
  }
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
  padding-bottom: 140px;
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

export const NotificationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: ${margins.small};
`;

export const Close = styled(CloseIcon)`
  margin: 0px 0px 0px 11px !important;
  width: 12px;
`;

export const Notification = styled(BellIcon)`
  width: 15px;
  height: 15px;
`;

interface NotificationProps {
  open: boolean;
}

export const NotificationButton = styled(SecondaryButton) <NotificationProps>`
  padding: ${margins.mini};
  position: relative;
  z-index: 1000;
  ${Close} {
    margin: 0px 6px !important;
    width: 15px;
    height: 15px;
  }
  ${({ open }): string => {
    return open
      ? `
        border-color: ${color.black} !important;
        `
      : `

      `;
  }};
`;
