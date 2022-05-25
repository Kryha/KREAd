import { FC } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionWrap } from "./styles";

import { LoadingPage } from "../../components";

import { useItem } from "../../service";
import { DetailSectionSegmentStory } from "./detail-section-segment-story";
import { DetailSectionSegmentStats } from "./detail-section-segment-stats";
import { DetailSectionSegmentDetails } from "./detail-section-segment-details";
import { DetailSectionSegmentActivity } from "./detail-section-segment-activity";
import { text } from "../../assets";

// TODO: make Detail Section polymorphic and render Item or Character data conditionally based on type
// TODO: Make index dynamic
export const DetailSection: FC = () => {
  const MOCKED_ITEM_ID = "12344";
  const { data: item, isLoading: isLoadingItem } = useItem(MOCKED_ITEM_ID);

  if (isLoadingItem) return <LoadingPage />;

  // TODO: get an empty section view
  if (!item) return <></>;

  // TODO: Add Item Activity Table component
  return (
    <DetailSectionWrap>
      <DetailSectionHeader item={item} />
      <DetailSectionSegment title={text.item.itemActivity} sectionIndex={5}>
        <DetailSectionSegmentActivity item={item} />
      </DetailSectionSegment>
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
    </DetailSectionWrap>
  );
};
