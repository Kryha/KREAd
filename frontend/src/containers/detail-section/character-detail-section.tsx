import { FC } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionSegmentStory } from "./detail-section-segment-story";
import { CharacterDetailSectionSegmentStats } from "./detail-section-segment-stats";
import { DetailSectionSegmentDetails } from "./detail-section-segment-details";
import { DetailSectionSegmentActivity } from "./detail-section-segment-activity";
import { DetailSectionWrap } from "./styles";

import { text, UnnamedCreator } from "../../assets";
import { Character } from "../../interfaces";

interface ItemDetailSectionProps {
  character: Character;
  onClose: () => void;
}

// TODO: Make index dynamic
export const CharacterDetailSection: FC<ItemDetailSectionProps> = ({ character, onClose }) => {
  const choose = () => {
    console.log("TODO: implement choose");
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
        data={{ ...character, id: character.characterId, category: character.type }}
        actions={{ onClose, onLeftButtonClick: choose, onRightButtonClick: sell }}
        text={{ leftButton: text.character.choose, rightButton: text.character.equip }}
      />

      {/* story */}
      <DetailSectionSegment title={text.item.story} sectionIndex={1}>
        {/* TODO: fetch actual creator image */}
        <DetailSectionSegmentStory data={{ ...character, creatorImage: UnnamedCreator, image: character.items }} />
      </DetailSectionSegment>

      {/* stats */}
      <DetailSectionSegment title={text.item.stats} sectionIndex={2}>
        <CharacterDetailSectionSegmentStats character={character} />
      </DetailSectionSegment>

      {/* equipped items */}

      {/* details */}
      <DetailSectionSegment title={text.item.details} sectionIndex={3}>
        <DetailSectionSegmentDetails data={{ ...character.detail, brand: character.detail.contractAddresss }} />
      </DetailSectionSegment>

      {/* project */}
      <DetailSectionSegment title={text.item.project} sectionIndex={4}>
        {character.description}
      </DetailSectionSegment>

      {/* activity */}
      <DetailSectionSegment title={text.item.itemActivity} sectionIndex={5}>
        <DetailSectionSegmentActivity events={character.itemActivity} />
      </DetailSectionSegment>
    </DetailSectionWrap>
  );
};
