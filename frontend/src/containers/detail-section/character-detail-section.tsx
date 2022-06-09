import { Dispatch, FC } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionSegmentStory } from "./detail-section-segment-story";
import { ItemDetailSectionSegmentStats } from "./detail-section-segment-stats";
import { DetailSectionSegmentDetails } from "./detail-section-segment-details";
import { DetailSectionSegmentActivity } from "./detail-section-segment-activity";
import { DetailSectionWrap, EmptyView } from "./styles";

import { text, UnnamedCreator } from "../../assets";
import { Character, Item } from "../../interfaces";

// TODO: maybe make data mandatory
interface ItemDetailSectionProps {
  character?: Character;
  setSelectedItem: Dispatch<React.SetStateAction<Item | undefined>>;
}

// TODO: Make index dynamic
export const CharacterDetailSection: FC<ItemDetailSectionProps> = ({ character, setSelectedItem }) => {
  const handleClose = () => setSelectedItem(undefined);

  const handleEquip = () => {
    // TODO: implement
  };

  const handleSell = () => {
    // TODO: implement
  };

  // // TODO: Add placeholder image to empty view?
  if (!character) return <EmptyView />;

  return <></>;

  //   return (
  //     <DetailSectionWrap>
  //       {/* header */}
  //       <DetailSectionHeader
  //         data={item}
  //         actions={{ onClose: handleClose, onLeftButtonClick: handleEquip, onRightButtonClick: handleSell }}
  //         text={{ leftButton: text.character.choose, rightButton: text.character.equip }}
  //       />

  //       {/* story */}
  //       <DetailSectionSegment title={text.item.story} sectionIndex={1}>
  //         {/* TODO: fetch actual creator image */}
  //         <DetailSectionSegmentStory data={{ ...item, creatorImage: UnnamedCreator }} />
  //       </DetailSectionSegment>

  //       {/* stats */}
  //       <DetailSectionSegment title={text.item.stats} sectionIndex={2}>
  //         <ItemDetailSectionSegmentStats item={item} />
  //       </DetailSectionSegment>

  //       {/* details */}
  //       <DetailSectionSegment title={text.item.details} sectionIndex={3}>
  //         <DetailSectionSegmentDetails data={{ ...item.details, brand: item.details.contractAddresss }} />
  //       </DetailSectionSegment>

  //       {/* project */}
  //       <DetailSectionSegment title={text.item.project} sectionIndex={4}>
  //         {item.description}
  //       </DetailSectionSegment>

  //       {/* activity */}
  //       <DetailSectionSegment title={text.item.itemActivity} sectionIndex={5}>
  //         <DetailSectionSegmentActivity events={item.activity} />
  //       </DetailSectionSegment>
  //     </DetailSectionWrap>
  //   );
};
