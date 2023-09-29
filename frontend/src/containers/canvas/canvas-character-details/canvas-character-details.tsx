import { useCharacterBuilder } from "../../../context/character-builder-context";
import { useGetCharacterByName } from "../../../service";
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
import React from "react";
import { DetailsActions, DetailsContainer, DetailsHeader, DetailsHeaderTitle, DetailsSectionContent, DetailsWrapper } from "./styles";
import { DetailSectionSegmentHeader } from "../../detail-section/detail-section-segment-title/styles";

export const CanvasCharacterDetails = () => {
  const { selectedAsset, setShowDetails } = useCharacterBuilder();
  const [character] = useGetCharacterByName(selectedAsset);

  const { height } = useViewport();
  if (!character) return <ContentLoader loading={true} />;

  return (
    <DetailsWrapper>
      <DetailsHeader>
        <DetailsHeaderTitle>
          <DetailSectionSegmentHeader>{character.nft.name}</DetailSectionSegmentHeader>
          <ButtonClose onClick={() => setShowDetails(false)} />
        </DetailsHeaderTitle>
        <DetailSectionHeaderDetails>
          <Badge>
            <ButtonText>{character.nft.title}</ButtonText>
          </Badge>
          <Badge>
            <ButtonText>{character.nft.origin}</ButtonText>
          </Badge>
          <DetailsActions>
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
            <DetailSectionSegmentStoryDescription>
              {text.util.correctDescriptionString(character.nft.description)}
            </DetailSectionSegmentStoryDescription>
          </DetailSectionSegmentStoryWrap>
        </DetailSectionSegment>
        <DetailsSectionContent></DetailsSectionContent>
      </DetailsContainer>
    </DetailsWrapper>
  );
};
