import { FC } from "react";

import { text } from "../../../assets";
import { FlexColumn, FlexRow } from "../../../components";

import { Item } from "../../../interfaces";
import { DetailSectionColorPalette } from "../detail-section-color-palette";
import { DetailSectionElement } from "../detail-section-element";
import { DetailSectionProgressBar } from "../detail-section-progress-bar";
import { DetailSectionBody, DetailSectionBodyBigBold } from "../detail-section-segment/styles";
import { DetailSectionSegmentStatsWrap } from "./styles";

interface DetailSectionSegmentStatsProps {
  item: Item;
}

// TODO: Use props intead of hardcoded placeholder for image src
export const DetailSectionSegmentStats: FC<DetailSectionSegmentStatsProps> = ({ item }) => {
  return (
    <DetailSectionSegmentStatsWrap>
      <FlexRow>
        <DetailSectionElement title={text.item.level} info={text.item.levelInfo} infoPosition="right">
          <DetailSectionBodyBigBold>{item.level}</DetailSectionBodyBigBold>
        </DetailSectionElement>
        <FlexColumn>
          <DetailSectionElement title={text.item.effectiveness} info={text.item.effectivenessInfo} infoPosition="left">
            <DetailSectionProgressBar title={text.item.effectiveness} amount={item.effectiveness || 0} />
          </DetailSectionElement>
          <DetailSectionElement title={text.item.layerComplexity} info={text.item.layerComplexityInfo} infoPosition="left">
            <DetailSectionProgressBar title={text.item.layerComplexity} amount={item.layerComplexity || 0} />
          </DetailSectionElement>
        </FlexColumn>
      </FlexRow>

      <FlexRow>
        <DetailSectionElement title={text.item.forged}>
          <DetailSectionBody>{item.forged}</DetailSectionBody>
        </DetailSectionElement>
        <DetailSectionElement title={text.item.baseMaterial}>
          <DetailSectionBody>{item.baseMaterial}</DetailSectionBody>
        </DetailSectionElement>
      </FlexRow>

      <DetailSectionElement title={text.item.colors}>
        <DetailSectionColorPalette hexCodeList={item.colors} />
      </DetailSectionElement>
    </DetailSectionSegmentStatsWrap>
  );
};
