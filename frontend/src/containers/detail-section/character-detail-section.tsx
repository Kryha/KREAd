import { FC } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionSegmentStory } from "./detail-section-segment-story";
import { CharacterDetailSectionSegmentStats } from "./detail-section-segment-stats";
import { DetailSectionSegmentActivity } from "./detail-section-segment-activity";
import { DetailSectionWrap } from "./styles";

import { InstagramIcon, text, UnnamedCreator } from "../../assets";
import { ExtendedCharacter } from "../../interfaces";
import { DetailSectionActions } from "./types";
import { useViewport } from "../../hooks";
import { ErrorView } from "../../components";
import { DetailSectionItems } from "./detail-section-items";
import { Link } from "../../pages/onboarding/styles";

interface CharacterDetailSectionProps {
  character: ExtendedCharacter;
  actions?: DetailSectionActions;
  showToast?: () => void;
}

// TODO: Make index dynamic
export const CharacterDetailSection: FC<CharacterDetailSectionProps> = ({ character, actions }) => {
  const { width } = useViewport();
  if (!character) return <ErrorView />;

  return (
    <DetailSectionWrap width={width}>
      {/* header */}
      <DetailSectionHeader data={{ ...character.nft, category: character.nft.title }} actions={actions} />

      {/* story */}
      <DetailSectionSegment title={text.character.story} sectionIndex={1}>
        {/* TODO: fetch actual creator image */}
        <DetailSectionSegmentStory
          data={{ ...character.nft, creatorImage: UnnamedCreator, image: character.equippedItems, characterImage: character.nft.image }}
        />
      </DetailSectionSegment>

      {/* stats */}
      <DetailSectionSegment title={text.character.stats} sectionIndex={2}>
        <CharacterDetailSectionSegmentStats character={character} />
      </DetailSectionSegment>

      {/* equipped items */}
      <DetailSectionSegment title={text.character.equippedItems} sectionIndex={3}>
        <DetailSectionItems items={Object.values(character.equippedItems).filter((i) => i !== undefined)} showToast={() => {}} />
      </DetailSectionSegment>

      {/* project */}
      <DetailSectionSegment title={text.character.project} sectionIndex={4}>
        {text.util.correctDescriptionString(character.nft.description)}
      </DetailSectionSegment>

      <DetailSectionSegment title={text.character.artistInfo} sectionIndex={5}>
        <Link href={character.nft.artistMetadata} target="_blank">
          <InstagramIcon />
          {text.general.instagram}
        </Link>
      </DetailSectionSegment>
    </DetailSectionWrap>
  );
};
