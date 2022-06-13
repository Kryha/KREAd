import { FC } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionSegmentStory } from "./detail-section-segment-story";
import { ItemDetailSectionSegmentStats } from "./detail-section-segment-stats";
import { DetailSectionSegmentDetails } from "./detail-section-segment-details";
import { DetailSectionSegmentActivity } from "./detail-section-segment-activity";
import { DetailSectionWrap } from "./styles";

import { text, UnnamedCreator } from "../../assets";
import { Item } from "../../interfaces";

interface ItemDetailSectionProps {
  item: Item;
  onClose?: () => void;
}

// TODO: Make index dynamic
export const ItemDetailSection: FC<ItemDetailSectionProps> = ({ item, onClose }) => {
  const equip = () => {
    console.log("TODO: implement equip");
    // TODO: implement
  };

  const sell = () => {
    console.log("TODO: implement sell");
    // TODO: implement
  };

  return (
    <DetailSectionWrap>
      {/* header */}
      <DetailSectionHeader
        data={item}
        actions={{
          onClose,
          primary: { onClick: equip, text: text.item.equip },
          secondary: { onClick: sell, text: text.item.sell },
        }}
      />

      {/* story */}
      <DetailSectionSegment title={text.item.story} sectionIndex={1}>
        {/* TODO: fetch actual creator image */}
        <DetailSectionSegmentStory data={{ ...item, creatorImage: UnnamedCreator }} />
      </DetailSectionSegment>

      {/* stats */}
      <DetailSectionSegment title={text.item.stats} sectionIndex={2}>
        <ItemDetailSectionSegmentStats item={item} />
      </DetailSectionSegment>

      {/* details */}
      <DetailSectionSegment title={text.item.details} sectionIndex={3}>
        <DetailSectionSegmentDetails data={{ ...item.details, brand: item.details.contractAddresss }} />
      </DetailSectionSegment>

      {/* project */}
      <DetailSectionSegment title={text.item.project} sectionIndex={4}>
        {item.description}
      </DetailSectionSegment>

      {/* activity */}
      <DetailSectionSegment title={text.item.itemActivity} sectionIndex={5}>
        <DetailSectionSegmentActivity events={item.activity} />
      </DetailSectionSegment>
    </DetailSectionWrap>
  );
};
