import styled from "@emotion/styled";
import { ButtonText, fadeUp, HorizontalDivider } from "../atoms";
import { breakpoints, color, fontWeight } from "../../design";

export const MarketplaceMetricsWrapper = styled.div`
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

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const MarketplaceMetricsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MetricsTable = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  @media screen and (max-width: 768px) {
    padding: 16px;
    margin-left: 16px;
    margin-right: 16px;
    border: 1px solid ${color.grey};
    border-radius: 24px;
  }
`;

export const MetricsHeader = styled.div`
  display: flex;
  align-items: center;
  ${ButtonText} {
    font-size: 24px;
    font-weight: ${fontWeight.medium};
    @media screen and (max-width: 768px) {
      font-size: 16px;
    }
  }
  margin-bottom: 8px;
  width: 100%;
  height: 20px;
`;

export const MetricsRow = styled.div`
  display: flex;
  ${ButtonText} {
    :first-letter {
      text-transform: none;
    }
    @media screen and (max-width: ${breakpoints.mobile}) {
      font-size: 10px;
    }
  }
`;

export const LabelWrapper = styled.div`
  //flex: 1;
  //text-align: center;
  //width: 75px;
`;

export const Metric = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-start;
`;
