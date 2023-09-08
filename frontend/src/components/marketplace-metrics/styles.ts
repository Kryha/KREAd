import styled from "@emotion/styled";
import { fadeUp, HorizontalDivider } from "../atoms";


export const MarketplaceMetricsWrapper = styled.div`
  position: sticky;
  display: flex;
  flex-direction: column;
  padding: 0;
  z-index: 30;
  ${HorizontalDivider} {
    margin-top: 4px;
  }
  animation: ${fadeUp} 1.2s ease-out 0s forwards;
  opacity: 0;
  transform: translate3d(0, 1rem, 0);
`;

export const MarketplaceMetricsContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0;
  gap: 16px;
  margin-left: auto;
  margin-right: auto;
`;

export const MetricsTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const MetricsHeader = styled.div`
  display: flex;
  min-width: 600px;
  margin-bottom: 3px;
`;

export const MetricsRow = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 600px;
  margin-top: 5px;
`;

export const LabelWrapper = styled.div`
  flex: 1;
  text-align: center;
  width: 75px;
`;
