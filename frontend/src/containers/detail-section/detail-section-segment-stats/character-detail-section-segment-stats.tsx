import { FC } from "react";

import { text } from "../../../assets";
import { FlexRow } from "../../../components";
import { Character } from "../../../interfaces";
import { DetailSectionElement } from "../detail-section-element";
import { DetailSectionBodyBigBold } from "../detail-section-segment/styles";
import { DetailSectionSegmentStatsWrap } from "./styles";

interface Props {
  character: Character;
}

export const CharacterDetailSectionSegmentStats: FC<Props> = ({ character }) => {
  return (
    <DetailSectionSegmentStatsWrap>
      <FlexRow>
        <DetailSectionElement title={text.item.level} info={text.item.levelInfo} infoPosition="right">
          <DetailSectionBodyBigBold>{character.level}</DetailSectionBodyBigBold>
        </DetailSectionElement>
      </FlexRow>
    </DetailSectionSegmentStatsWrap>
  );
};
