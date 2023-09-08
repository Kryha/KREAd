import { FC } from "react";
import { LabelWrapper, MarketplaceMetricsContainer, MarketplaceMetricsWrapper, MetricsHeader, MetricsRow, MetricsTable } from "./styles";
import { BoldLabel, HorizontalDivider } from "../atoms";
import { color } from "../../design";

interface Props {
  header: string[];
  data: string[];
}

export const MarketplaceMetrics: FC<Props> = ({ header, data }) => {
  return (
    <>
      <MarketplaceMetricsWrapper>
        <MarketplaceMetricsContainer>
          <MetricsTable>
            <MetricsHeader>
              {header.map((item, index) => (
                <LabelWrapper key={index}>
                  <BoldLabel>{item}</BoldLabel>
                </LabelWrapper>
              ))}
            </MetricsHeader>
            <HorizontalDivider />
            <MetricsRow>
              {data.map((item, index) => (
                <LabelWrapper key={index}>
                  <BoldLabel customColor={color.black}>{item}</BoldLabel>
                </LabelWrapper>
              ))}
            </MetricsRow>
          </MetricsTable>
        </MarketplaceMetricsContainer>
      </MarketplaceMetricsWrapper>
    </>
  );
};
