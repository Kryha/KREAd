import { useCharacterBuilder } from "../../../context/character-builder-context";
import { getRarityString, useGetItemInInventoryByName } from "../../../service";
import { useViewport } from "../../../hooks";
import { Badge, ButtonText, ContentLoader, HorizontalDivider, PrimaryButton } from "../../../components";
import { ButtonClose } from "../../../components/button-close";
import { DetailSectionHeaderDetails } from "../../detail-section/detail-section-header/styles";
import { color } from "../../../design";
import { DetailSectionSegment } from "../../detail-section/detail-section-segment";
import { text } from "../../../assets";
import {
  DetailSectionSegmentStoryDescription,
  DetailSectionSegmentStoryWrap,
} from "../../detail-section/detail-section-segment-story/styles";
import { ItemDetailSectionSegmentStats } from "../../detail-section/detail-section-segment-stats";
import React from "react";
import { DetailsActions, DetailsContainer, DetailsHeader, DetailsHeaderTitle, DetailsSectionContent, DetailsWrapper } from "./styles";
import { DetailSectionSegmentHeader } from "../../detail-section/detail-section-segment-title/styles";

export const CanvasItemDetails = () => {
  const { selectedAsset, selectedAssetCategory, setShowDetails } = useCharacterBuilder();
  const item = useGetItemInInventoryByName(selectedAssetCategory, selectedAsset);

  const { height } = useViewport();
  if (!item) return <ContentLoader loading={true} />;

  return (
    <DetailsWrapper>
      <DetailsHeader>
        <DetailsHeaderTitle>
          <DetailSectionSegmentHeader>{item?.name}</DetailSectionSegmentHeader>
          <ButtonClose onClick={() => setShowDetails(false)} />
        </DetailsHeaderTitle>
        <DetailSectionHeaderDetails>
          <Badge>
            <ButtonText>{item?.category}</ButtonText>
          </Badge>
          <Badge>
            <ButtonText>{getRarityString(item?.rarity)}</ButtonText>
          </Badge>
          <DetailsActions>
            {item.equippedTo !== "" ? (
              <PrimaryButton>
                <ButtonText customColor={color.white}>unequip</ButtonText>
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={() => setShowDetails(false)}>
                <ButtonText customColor={color.white}>equip</ButtonText>
              </PrimaryButton>
            )}
            <PrimaryButton>
              <ButtonText customColor={color.white}>sell</ButtonText>
            </PrimaryButton>
          </DetailsActions>
        </DetailSectionHeaderDetails>
      </DetailsHeader>
      <HorizontalDivider />
      <DetailsContainer height={height}>
        {/* story */}
        <DetailSectionSegment title={text.item.story} sectionIndex={1}>
          <DetailSectionSegmentStoryWrap>
            <DetailSectionSegmentStoryDescription>{item.description}</DetailSectionSegmentStoryDescription>
          </DetailSectionSegmentStoryWrap>
        </DetailSectionSegment>

        {/* stats */}
        <DetailSectionSegment title={text.item.stats} sectionIndex={2}>
          <ItemDetailSectionSegmentStats item={item} />
        </DetailSectionSegment>
        <DetailsSectionContent></DetailsSectionContent>
      </DetailsContainer>
    </DetailsWrapper>
  );
};
