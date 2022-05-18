import { FC } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionWrap } from "./styles";


// Temporary mocked item
import { Items } from "../../service/fake-item-data";

const mockedItem = Items[0];

export const DetailSection: FC = () => {
  return (
    <DetailSectionWrap>
      <DetailSectionHeader item={mockedItem}/>
      <DetailSectionSegment title="Story" index={1} image={mockedItem.image}>
        {mockedItem.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Stats" index={2}>
        {mockedItem.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Project" index={3}>
        {mockedItem.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Details" index={4}>
        {mockedItem.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Item Activity" index={5}>
        {mockedItem.description}
      </DetailSectionSegment>
    </DetailSectionWrap>
  )
};
