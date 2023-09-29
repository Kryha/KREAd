import { FC } from "react";

import { text } from "../../../assets";
import { FlexColumn, FlexRow } from "../../../components";

import { Item } from "../../../interfaces";
import { DetailSectionColorPalette } from "../detail-section-color-palette";
import { DetailSectionElement } from "../detail-section-element";
import { DetailSectionProgressBar } from "../detail-section-progress-bar";
import { DetailSectionBodyBigBold } from "../detail-section-segment/styles";
import { DetailSectionSegmentStatsWrap } from "./styles";
import { DetailSectionSegmentActivity } from "../detail-section-segment-activity";

interface ItemDetailSectionSegmentStatsProps {
  item: Item;
}

export const ItemDetailSectionSegmentStats: FC<ItemDetailSectionSegmentStatsProps> = ({ item }) => {
  return (
    <DetailSectionSegmentStatsWrap>
      <FlexRow>
        <DetailSectionElement title={text.item.level} info={text.item.levelInfo} infoPosition="right">
          <DetailSectionBodyBigBold>{item.level}</DetailSectionBodyBigBold>
        </DetailSectionElement>
        <FlexColumn>
          <DetailSectionElement title={text.item.durability} info={text.item.durabilityInfo} infoPosition="left">
            <DetailSectionProgressBar title={text.item.durability} amount={item.durability || 0} />
          </DetailSectionElement>
          <DetailSectionElement title={text.item.filtering} info={text.item.filteringInfo} infoPosition="left">
            <DetailSectionProgressBar title={text.item.filtering} amount={item.filtering || 0} />
          </DetailSectionElement>
          <DetailSectionElement title={text.item.weight} info={text.item.weightInfo} infoPosition="left">
            <DetailSectionProgressBar title={text.item.weight} amount={item.weight || 0} />
          </DetailSectionElement>
          <DetailSectionElement title={text.item.sense} info={text.item.senseInfo} infoPosition="left">
            <DetailSectionProgressBar title={text.item.sense} amount={item.sense || 0} />
          </DetailSectionElement>
          <DetailSectionElement title={text.item.reserves} info={text.item.reservesInfo} infoPosition="left">
            <DetailSectionProgressBar title={text.item.reserves} amount={item.reserves || 0} />
          </DetailSectionElement>
        </FlexColumn>
      </FlexRow>
      <DetailSectionElement title={text.item.colors}>
        <DetailSectionColorPalette hexCodeList={item.colors} />
      </DetailSectionElement>
    </DetailSectionSegmentStatsWrap>
  );
};
