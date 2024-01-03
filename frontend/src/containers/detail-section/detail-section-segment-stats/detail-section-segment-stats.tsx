import { FC } from "react";

import { text } from "../../../assets";
import { FlexRow } from "../../../components";

import { Item } from "../../../interfaces";
import { DetailSectionColorPalette } from "../detail-section-color-palette";
import { DetailSectionElement } from "../detail-section-element";
import { DetailSectionBodyBigBold } from "../detail-section-segment/styles";
import { DetailSectionSegmentStatsWrap } from "./styles";

interface DetailSectionSegmentStatsProps {
  item: Item;
}

export const DetailSectionSegmentStats: FC<DetailSectionSegmentStatsProps> = ({ item }) => {
  return (
    <DetailSectionSegmentStatsWrap>
      <FlexRow>
        <DetailSectionElement title={text.item.level} info={text.item.levelInfo} infoPosition="right">
          <DetailSectionBodyBigBold>{item.level}</DetailSectionBodyBigBold>
        </DetailSectionElement>
      </FlexRow>
      <DetailSectionElement title={text.item.colors}>
        <DetailSectionColorPalette hexCodeList={item.colors} />
      </DetailSectionElement>
    </DetailSectionSegmentStatsWrap>
  );
};
