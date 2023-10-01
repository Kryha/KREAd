import { FC, useMemo } from "react";
import {
  LabelWrapper,
  MarketplaceMetricsContainer,
  MarketplaceMetricsWrapper,
  Metric,
  MetricsHeader,
  MetricsRow,
  MetricsTable,
} from "./styles";
import { ButtonText, HorizontalDivider } from "../atoms";
import { color } from "../../design";
import { IST } from "../asset-card/styles";

interface Props {
  data: (string | number)[];
  asset: string[];
}

export const MarketplaceMetrics: FC<Props> = ({ data, asset }) => {
  const metrics = useMemo(() => data, [data]);

  return (
    <>
      <MarketplaceMetricsWrapper>
        <MarketplaceMetricsContainer>
          <MetricsTable>
            {asset.map((item, index) => (
              <Metric key={index}>
                <MetricsHeader>
                  {index === 2 && <IST />}
                  {index === 3 && <IST />}
                  <ButtonText>{metrics[index].toString()}</ButtonText>
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
