import { FC, useEffect, useState } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionWrap } from "./styles";

import { LoadingPage } from "../../components";

import { DetailSectionSegmentStory } from "./detail-section-segment-story";
import { DetailSectionSegmentStats } from "./detail-section-segment-stats";
import { DetailSectionSegmentDetails } from "./detail-section-segment-details";
import { DetailSectionSegmentActivity } from "./detail-section-segment-activity";
import { text } from "../../assets";

import { Item } from "../../interfaces";

interface DetailSectionProps {
  item?: Item;
}

// TODO: make Detail Section polymorphic and render Item or Character data conditionally based on type
// TODO: Make index dynamic
// TODO: Handle Loading and Errors in a more global/standdard way
export const DetailSection: FC<DetailSectionProps> = ({ item }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (item) {
      setIsLoading(false);
    }
  }, [item]);

  if (isLoading) return <LoadingPage />;

  // TODO: get an empty section view
  if (!item) return <></>;

  // TODO: Add Item Activity Table component
  return (
    <DetailSectionWrap>
      <DetailSectionHeader item={item} />
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
