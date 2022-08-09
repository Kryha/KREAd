import styled from "@emotion/styled";
import { BellIcon, CloseIcon, RefreshIcon } from "../../assets";
import { HorizontalDivider, Label, SecondaryButton } from "../../components";
import { fadeUp } from "../../components/atoms/animations";
import { FilterOption } from "../../components/filters/styles";
import { LoadMoreContainer } from "../../components/load-more/styles";
import { KreadIcon } from "../../components/logo/styles";
import { ToastContainer } from "../../components/notification-detail/styles";
import { OverviewWrapper } from "../../components/overview-empty/styles";
import { EXTRA_LARGE_SCREEN_SIZE, LARGE_SCREEN_SIZE } from "../../constants";
import { DetailSectionHeaderNavigationWrap } from "../../containers/detail-section/detail-section-header-navigation/styles";
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
    top: 0px;
    left: 0px;
    z-index: 1000;
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
  animation: ${fadeUp} 1.2s ease-out 0s forwards;
  opacity: 0;
  transform: translate3d(0, 1rem, 0);
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
  ${FilterOption} {
    margin-left: -20px;
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
  padding-top: 40px;
  padding-bottom: 160px;
  animation: ${fadeUp} 1.2s ease-out 0s forwards;
  opacity: 0;
  transform: translate3d(0, 1rem, 0);
`;

export const LoadMoreWrapper = styled.div`
  ${LoadMoreContainer} {
    margin-top: -130px;
  }
`;

export const Refresh = styled(RefreshIcon)`
  margin-left: ${margins.mini};
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

export const Tag = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${margins.nano} ${margins.mini};
  gap: 10px;

  position: absolute;
  width:  ${margins.small};
  height: ${margins.small};
  left: 27px;
  top: -3px;

  background: ${color.black};
  border-radius: ${margins.medium};
  z-index: 1000;
`;

interface ViewProps {
  width: number;
  height: number;
}

export const Wrapper = styled.div<ViewProps>`
  overflow-y: scroll;
  ${({ height }): string => `height: ${height - 132}px;`};
`;

export const Container = styled.div<ViewProps>`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
`;

export const Card = styled.div<ViewProps>`
  color: black;
  background: black;
  height: 520px;
  border: 1px solid red;
  flex: 1 0 500px;
  box-sizing: border-box;
  ${({ width }): string => {
    if (width <= 1300) {
      return "flex: 0 1 calc(49.6% - 1em);";
    }
    else if (width >= 1300 && width <= LARGE_SCREEN_SIZE) {
      return "flex: 0 1 calc(32.4% - 1em);";
    }
    else if (width >= LARGE_SCREEN_SIZE && width <= EXTRA_LARGE_SCREEN_SIZE) {
      return "flex: 0 1 calc(24.41% - 1em);";
    }
    else {
      return "flex: 1 0 500px;";
    }
  }
  }
`;

export const DetailContainer = styled.div`
  ${DetailSectionHeaderNavigationWrap} {
    align-items: center;
  }
`;

export const KreadContainer = styled.div<ViewProps>`
  ${KreadIcon} {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    top: 40px;
    width: 100px;
    height: 24px;
  }
`;

export const OverviewContainer = styled.div`
  ${OverviewWrapper} {
    padding-top: 97px;
    padding-left: 0px;
  }
`;

export const NotificationContainer = styled.div`
  ${ToastContainer} {
    bottom: 100px;
  }
`;
