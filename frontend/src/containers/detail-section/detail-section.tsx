import { Dispatch, FC } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionSegmentStory } from "./detail-section-segment-story";
import { DetailSectionSegmentStats } from "./detail-section-segment-stats";
import { DetailSectionSegmentDetails } from "./detail-section-segment-details";
import { DetailSectionSegmentActivity } from "./detail-section-segment-activity";
import { DetailSectionWrap, EmptyView } from "./styles";

import { text } from "../../assets";
import { Item } from "../../interfaces";

interface DetailSectionProps {
  item?: Item;
  setSelectedItem: Dispatch<React.SetStateAction<Item | undefined>>;
}

// TODO: make Detail Section polymorphic and render Item or Character data conditionally based on type
// TODO: Make index dynamic
export const DetailSection: FC<DetailSectionProps> = ({ item, setSelectedItem }) => {
  const handleClose = () => setSelectedItem(undefined);

  // TODO: Add placeholder image to empty view?
  if (!item) return <EmptyView></EmptyView>;

  return (
    <DetailSectionWrap>
      <DetailSectionHeader item={item} handleClose={handleClose} />
      <DetailSectionSegment title={text.item.story} sectionIndex={1}>
        <DetailSectionSegmentStory item={item} />
      </DetailSectionSegment>
      <DetailSectionSegment title={text.item.stats} sectionIndex={2}>
        <DetailSectionSegmentStats item={item} />
      </DetailSectionSegment>
      <DetailSectionSegment title={text.item.project} sectionIndex={3}>
        {item.description}
      </DetailSectionSegment>
      <DetailSectionSegment title={text.item.details} sectionIndex={4}>
        <DetailSectionSegmentDetails item={item} />
      </DetailSectionSegment>
      <DetailSectionSegment title={text.item.itemActivity} sectionIndex={5}>
        <DetailSectionSegmentActivity item={item} />
      </DetailSectionSegment>
    </DetailSectionWrap>
  );
};
