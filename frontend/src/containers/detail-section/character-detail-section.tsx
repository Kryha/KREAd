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
import { DetailSectionItems } from "./detail-section-items";
import { DetailSectionActions } from "./types";
import { useViewport } from "../../hooks";

interface ItemDetailSectionProps {
  character: Character;
  actions?: DetailSectionActions;
}

// TODO: Make index dynamic
export const CharacterDetailSection: FC<ItemDetailSectionProps> = ({ character, actions }) => {
  const { width } = useViewport();

  return (
    <DetailSectionWrap width={width}>
      {/* header */}
      <DetailSectionHeader data={{ ...character, id: character.characterId, category: character.type }} actions={actions} />

      {/* story */}
      <DetailSectionSegment title={text.character.story} sectionIndex={1}>
        {/* TODO: fetch actual creator image */}
        <DetailSectionSegmentStory data={{ ...character, creatorImage: UnnamedCreator, image: character.items }} />
      </DetailSectionSegment>

      {/* stats */}
      <DetailSectionSegment title={text.character.stats} sectionIndex={2}>
        <CharacterDetailSectionSegmentStats character={character} />
      </DetailSectionSegment>

      {/* equipped items */}
      <DetailSectionSegment title={text.character.equippedItems} sectionIndex={3}>
        <DetailSectionItems items={Object.values(character.items)} />
      </DetailSectionSegment>

      {/* details */}
      <DetailSectionSegment title={text.character.details} sectionIndex={4}>
        <DetailSectionSegmentDetails data={{ ...character.detail, brand: character.detail.brand }} />
      </DetailSectionSegment>

      {/* project */}
      <DetailSectionSegment title={text.character.project} sectionIndex={5}>
        {character.description}
      </DetailSectionSegment>

      {/* activity */}
      <DetailSectionSegment title={text.character.itemActivity} sectionIndex={6}>
        <DetailSectionSegmentActivity events={character.itemActivity} />
      </DetailSectionSegment>
    </DetailSectionWrap>
  );
};
