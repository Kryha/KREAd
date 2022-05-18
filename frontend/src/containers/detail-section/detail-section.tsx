import { FC } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionWrap } from "./styles";

// Temporary mocked item
import { Items } from "../../service/fake-item-data";

// TODO: Make index dynamic
// TODO: Define state management to grab selected Item
export const DetailSection: FC = () => {
  const item = Items[0];
  return (
    <DetailSectionWrap>
      <DetailSectionHeader item={item} />
      <DetailSectionSegment title="Story" index={1} image={item.image}>
        {item.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Stats" index={2}>
        {item.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Project" index={3}>
        {item.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Details" index={4}>
        {item.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Item Activity" index={5}>
        {item.description}
      </DetailSectionSegment>
    </DetailSectionWrap>
  );
};
