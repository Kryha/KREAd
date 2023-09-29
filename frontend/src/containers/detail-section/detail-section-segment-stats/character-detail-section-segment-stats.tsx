import { FC } from "react";

import { text } from "../../../assets";
import { FlexRow } from "../../../components";
import { ExtendedCharacter, Item } from "../../../interfaces";
import { DetailSectionElement } from "../detail-section-element";
import { DetailSectionBodyBigBold } from "../detail-section-segment/styles";
import { DetailSectionSegmentStatsWrap } from "./styles";
import { calculateCharacterLevels } from "../../../util";

interface Props {
  character: ExtendedCharacter;
}

export const CharacterDetailSectionSegmentStats: FC<Props> = ({ character }) => {
  const { totalItemLevel, characterLevel, totalLevel } = calculateCharacterLevels(character);

  return (
    <DetailSectionSegmentStatsWrap>
      <FlexRow>
        <DetailSectionElement title={text.character.level} info={text.character.levelInfo} infoPosition="right">
          <DetailSectionBodyBigBold>{totalLevel}</DetailSectionBodyBigBold>
        </DetailSectionElement>
        <DetailSectionElement title={text.character.characterLevel} info={text.character.characterLevelInfo} infoPosition="right">
          <DetailSectionBodyBigBold>{characterLevel}</DetailSectionBodyBigBold>
        </DetailSectionElement>
        <DetailSectionElement title={text.character.combinedItemLevel} info={text.character.itemLevelInfo} infoPosition="left">
          <DetailSectionBodyBigBold>{totalItemLevel}</DetailSectionBodyBigBold>
        </DetailSectionElement>
      </FlexRow>
    </DetailSectionSegmentStatsWrap>
  );
};
