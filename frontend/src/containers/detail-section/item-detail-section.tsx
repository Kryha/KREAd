import { FC, useState } from "react";
import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionSegmentStory } from "./detail-section-segment-story";
import { ItemDetailSectionSegmentStats } from "./detail-section-segment-stats";
import { DetailSectionSegmentDetails } from "./detail-section-segment-details";
import { DetailSectionSegmentActivity } from "./detail-section-segment-activity";
import { DetailSectionWrap } from "./styles";
import { text, UnnamedCreator } from "../../assets";
import { ActivityEvent, Item } from "../../interfaces";
import { DetailSectionActions } from "./types";
import { useViewport } from "../../hooks";
import { ErrorView, LoadingPage } from "../../components";

interface ItemDetailSectionProps {
  item?: Item;
  actions?: DetailSectionActions;
}

// TODO: Make index dynamic
export const ItemDetailSection: FC<ItemDetailSectionProps> = ({ item, actions }) => {
  const { width } = useViewport();
  const [activity, setActivity] = useState<ActivityEvent[]>();

  // TODO: implement fetching activity/history

  if (!item) return <ErrorView />;

  {
    /* FIXME: update details section based on new types */
  }

  return (
    <DetailSectionWrap width={width}>
      {/* header */}
      <DetailSectionHeader data={item} actions={actions} />

      {/* story */}
      <DetailSectionSegment title={text.item.story} sectionIndex={1}>
        {/* TODO: fetch actual creator image */}
        <DetailSectionSegmentStory data={{ ...item, image: item.thumbnail, creatorImage: UnnamedCreator }} />
      </DetailSectionSegment>

      {/* stats */}
      <DetailSectionSegment title={text.item.stats} sectionIndex={2}>
        <ItemDetailSectionSegmentStats item={item} />
      </DetailSectionSegment>

      {/* details */}
      {/*<DetailSectionSegment title={text.item.details} sectionIndex={3}>*/}
      {/*  /!* FIXME: grab brand from state *!/*/}
      {/*  <DetailSectionSegmentDetails data={{ ...item.details, brand: "KREAdITEM" }} />*/}
      {/*</DetailSectionSegment>*/}

      {/* project */}
      <DetailSectionSegment title={text.item.project} sectionIndex={4}>
        {item.description}
      </DetailSectionSegment>

      {/* activity */}
      <DetailSectionSegment title={text.item.itemActivity} sectionIndex={5} isActivity>
        {activity ? <DetailSectionSegmentActivity events={activity} /> : <LoadingPage />}
      </DetailSectionSegment>
    </DetailSectionWrap>
  );
};
