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

// TODO: make Detail Section polymorphic and render Item or Character data conditionally
// TODO: Make index dynamic
export const DetailSection: FC = () => {
  const { data: item, isLoading: isLoadingItem } = useItem();

  if (isLoadingItem) return <LoadingPage />;

  // TODO: get an empty section view
  if (!item) return <></>;

  // TODO: Add Item Activity Table component
  return (
    <DetailSectionWrap>
      <DetailSectionHeader item={item} />
      <DetailSectionSegment title="Story" sectionIndex={1}>
        <DetailSectionSegmentStory item={item} />
      </DetailSectionSegment>
      <DetailSectionSegment title="Stats" sectionIndex={2}>
        <DetailSectionSegmentStats item={item} />
      </DetailSectionSegment>
      <DetailSectionSegment title="Project" sectionIndex={3}>
        {item.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Details" sectionIndex={4}>
        <DetailSectionSegmentDetails item={item} />
      </DetailSectionSegment>
      <DetailSectionSegment title="Item Activity" sectionIndex={5}>
        <DetailSectionSegmentActivity item={item} />
      </DetailSectionSegment>
    </DetailSectionWrap>
  );
};
