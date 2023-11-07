import styled from "@emotion/styled";
import { CloseIcon } from "../../assets";
import { fadeUp } from "../../components";
import { LoadMoreContainer } from "../../components/load-more/styles";
import { KreadIcon } from "../../components/logo/styles";
import { OverviewWrapper } from "../../components/overview-empty/styles";
import { DetailSectionHeaderNavigationWrap } from "../../containers/detail-section/detail-section-header-navigation/styles";
import { DetailSectionWrap } from "../../containers/detail-section/styles";
import { color, margins } from "../../design";

interface ShopProps {
  height: number;
}

export const ShopWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  ${DetailSectionWrap} {
    position: absolute;
    top: 0;
    left: 25%;
    z-index: 1000;
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

export const Close = styled(CloseIcon)`
  margin: 0 0 0 11px !important;
  width: 12px;
`;

export const Tag = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${margins.nano} ${margins.mini};
  gap: 10px;

  position: absolute;
  width: ${margins.small};
  height: ${margins.small};
  left: 27px;
  top: -3px;

  background: ${color.black};
  border-radius: ${margins.medium};
  z-index: 1000;
`;

export const DetailContainer = styled.div`
  ${DetailSectionHeaderNavigationWrap} {
    align-items: center;
  }
`;

export const KreadContainer = styled.div`
  ${KreadIcon} {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    top: 24px;
    width: 100px;
    height: 24px;
  }
`;

export const OverviewContainer = styled.div`
  position: relative;
  z-index: 0;
  ${OverviewWrapper} {
    padding-top: 97px;
    padding-left: 0;
    z-index: 0;
  }
`;
