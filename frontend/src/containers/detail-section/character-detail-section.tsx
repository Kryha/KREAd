import { FC, useMemo } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionSegmentStory } from "./detail-section-segment-story";
import { CharacterDetailSectionSegmentStats } from "./detail-section-segment-stats";
import { DetailSectionSegmentDetails } from "./detail-section-segment-details";
import { DetailSectionSegmentActivity } from "./detail-section-segment-activity";
import { DetailSectionWrap } from "./styles";

import { text, UnnamedCreator } from "../../assets";
import { ExtendedCharacter } from "../../interfaces";
import { DetailSectionItems } from "./detail-section-items";
import { DetailSectionActions } from "./types";
import { useViewport } from "../../hooks";
import { ErrorView } from "../../components";

interface CharacterDetailSectionProps {
  character: ExtendedCharacter;
  actions?: DetailSectionActions;
  showToast?: () => void;
}

// TODO: Make index dynamic
export const CharacterDetailSection: FC<CharacterDetailSectionProps> = ({ character, actions, showToast }) => {
  const { width } = useViewport();

  // const itemsValues = useMemo(() => Object.values(character?.equippedItems).filter((item) => item), [character.equippedItems]);
  console.log("character", character);
  console.log("DETAIL", character.nft.detail);
  if (!character) return <ErrorView />;

  return (
    <DetailSectionWrap width={width}>
      {/* header */}
      <DetailSectionHeader data={{ ...character.nft, category: character.nft.type }} actions={actions} />

      {/* story */}
      <DetailSectionSegment title={text.character.story} sectionIndex={1}>
        {/* TODO: fetch actual creator image */}
        <DetailSectionSegmentStory
          data={{ ...character.nft, creatorImage: UnnamedCreator, image: character.equippedItems, characterImage: character.nft.image }}
        />
      </DetailSectionSegment>

      {/* stats */}
      <DetailSectionSegment title={text.character.stats} sectionIndex={2}>
        <CharacterDetailSectionSegmentStats character={character.nft} />
      </DetailSectionSegment>

      {/* equipped items */}
      <DetailSectionSegment title={text.character.equippedItems} sectionIndex={3}>
        {/* <DetailSectionItems items={itemsValues} showToast={showToast || (() => {})} /> */}
      </DetailSectionSegment>

      {/* details */}
      <DetailSectionSegment title={text.character.details} sectionIndex={4}>
        <DetailSectionSegmentDetails data={{ ...character.nft.details, brand: character.nft.details.brand }} />
      </DetailSectionSegment>

      {/* project */}
      <DetailSectionSegment title={text.character.project} sectionIndex={5}>
        {character.nft.description}
      </DetailSectionSegment>

      {/* activity */}
      <DetailSectionSegment title={text.character.itemActivity} sectionIndex={6}>
        {character.activity && <DetailSectionSegmentActivity events={character.activity} />}
      </DetailSectionSegment>
    </DetailSectionWrap>
  );
};
