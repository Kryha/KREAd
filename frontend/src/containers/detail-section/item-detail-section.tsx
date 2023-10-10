import React, { FC } from "react";
import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionSegmentStory } from "./detail-section-segment-story";
import { ItemDetailSectionSegmentStats } from "./detail-section-segment-stats";
import { DetailSectionWrap } from "./styles";
import { text, UnnamedCreator } from "../../assets";
import { Item } from "../../interfaces";
import { DetailSectionActions } from "./types";
import { useClickAwayListener, useViewport } from "../../hooks";
import styled from "@emotion/styled";
import { useCharacterBuilder } from "../../context/character-builder-context";

interface ItemDetailSectionProps {
  item?: Item;
  actions?: DetailSectionActions;
}

export const ItemDetailSection: FC<ItemDetailSectionProps> = ({ item, actions }) => {
  const { width } = useViewport();
  const { showItemDetails, setShowItemDetails } = useCharacterBuilder();
  const detailRef = React.useRef<HTMLDivElement>(null);

  const closeFilter = () => {
    setShowItemDetails(false);
  };

  useClickAwayListener(detailRef, showItemDetails, closeFilter);

  if (!item) {
    return <></>;
  }

  return (
    <DetailContainer>
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

        {/* project */}
        <DetailSectionSegment title={text.item.project} sectionIndex={4}>
          {text.util.correctDescriptionString(item.description)}
        </DetailSectionSegment>
      </DetailSectionWrap>
    </DetailContainer>
  );
};

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
