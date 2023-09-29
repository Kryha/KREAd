import { FC } from "react";
import {
  LabelWrapper,
  MarketplaceMetricsContainer,
  MarketplaceMetricsWrapper,
  Metric,
  MetricsHeader,
  MetricsRow,
  MetricsTable,
  MetricText,
} from "./styles";
import { ButtonText, HorizontalDivider } from "../atoms";
import { color } from "../../design";
import { metricsLabels } from "../../constants";

interface Props {
  data: (string | number)[];
}

export const MarketplaceMetrics: FC<Props> = ({ data }) => {
  return (
    <>
      <MarketplaceMetricsWrapper>
        <MarketplaceMetricsContainer>
          <MetricsTable>
            {metricsLabels.map((item, index) => (
              <Metric key={index}>
                <MetricsHeader>
                  <MetricText>{data[index]}</MetricText>
                </MetricsHeader>
                <HorizontalDivider />
                <MetricsRow>
                  <LabelWrapper key={index}>
                    <ButtonText customColor={color.darkGrey}>{item}</ButtonText>
                  </LabelWrapper>
                </MetricsRow>
              </Metric>
            ))}
          </MetricsTable>
        </MarketplaceMetricsContainer>
      </MarketplaceMetricsWrapper>
    </>
  );
};
