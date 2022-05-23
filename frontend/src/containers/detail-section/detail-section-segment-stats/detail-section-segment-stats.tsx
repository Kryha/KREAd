import { FC } from "react";

import { text } from "../../../assets";

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
      <DetailSectionElement title={text.item.level} info={text.item.levelInfo}>
        <DetailSectionBodyBigBold>{item.level}</DetailSectionBodyBigBold>
      </DetailSectionElement>
      <div>
        <DetailSectionElement title={text.item.effectiveness} info={text.item.effectivenessInfo}>
          <DetailSectionProgressBar title={text.item.effectiveness} amount={item.effectiveness} />
        </DetailSectionElement>
        <DetailSectionElement title={text.item.layerComplexity} info={text.item.layerComplexityInfo}>
          <DetailSectionProgressBar title={text.item.layerComplexity} amount={item.layerComplexity} />
        </DetailSectionElement>
      </div>
      <DetailSectionElement title={text.item.forged}>
        <DetailSectionBody>{item.forged}</DetailSectionBody>
      </DetailSectionElement>
      <DetailSectionElement title={text.item.baseMaterial}>
        <DetailSectionBody>{item.baseMaterial}</DetailSectionBody>
      </DetailSectionElement>
      <DetailSectionElement title={text.item.colors}>
        <DetailSectionColorPalette hexCodeList={item.colors} />
      </DetailSectionElement>
    </DetailSectionSegmentStatsWrap>
  );
};
