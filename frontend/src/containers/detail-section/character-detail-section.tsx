import { FC, useMemo } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionSegmentStory } from "./detail-section-segment-story";
import { CharacterDetailSectionSegmentStats } from "./detail-section-segment-stats";
import { DetailSectionSegmentDetails } from "./detail-section-segment-details";
import { DetailSectionSegmentActivity } from "./detail-section-segment-activity";
import { DetailSectionWrap } from "./styles";

import { text, UnnamedCreator } from "../../assets";
import { Character, CharacterItems } from "../../interfaces";
import { DetailSectionItems } from "./detail-section-items";
import { DetailSectionActions } from "./types";
import { useViewport } from "../../hooks";

interface CharacterDetailSectionProps {
  nft: Character;
  equippedItems: CharacterItems;
  actions?: DetailSectionActions;
  showToast: () => void;
}

// TODO: Make index dynamic
export const CharacterDetailSection: FC<CharacterDetailSectionProps> = ({ nft, equippedItems, actions, showToast }) => {
  const { width } = useViewport();

  const itemsValues = useMemo(() => Object.values(equippedItems).filter((item) => item), [equippedItems]);

  return (
    <DetailSectionWrap width={width}>
      {/* header */}
      <DetailSectionHeader data={{ ...nft, id: nft.id, category: nft.type }} actions={actions} />

      {/* story */}
      <DetailSectionSegment title={text.character.story} sectionIndex={1}>
        {/* TODO: fetch actual creator image */}
        <DetailSectionSegmentStory data={{ ...nft, creatorImage: UnnamedCreator, image: equippedItems, characterImage: nft.image }} />
      </DetailSectionSegment>

      {/* stats */}
      <DetailSectionSegment title={text.character.stats} sectionIndex={2}>
        <CharacterDetailSectionSegmentStats character={nft} />
      </DetailSectionSegment>

      {/* equipped items */}
      <DetailSectionSegment title={text.character.equippedItems} sectionIndex={3}>
        <DetailSectionItems items={itemsValues} showToast={showToast} />
      </DetailSectionSegment>

      {/* details */}
      <DetailSectionSegment title={text.character.details} sectionIndex={4}>
        <DetailSectionSegmentDetails data={{ ...nft.detail, brand: nft.detail.brand }} />
      </DetailSectionSegment>

      {/* project */}
      <DetailSectionSegment title={text.character.project} sectionIndex={5}>
        {nft.description}
      </DetailSectionSegment>

      {/* activity */}
      <DetailSectionSegment title={text.character.itemActivity} sectionIndex={6}>
        <DetailSectionSegmentActivity events={nft.itemActivity} />
      </DetailSectionSegment>
    </DetailSectionWrap>
  );
};
