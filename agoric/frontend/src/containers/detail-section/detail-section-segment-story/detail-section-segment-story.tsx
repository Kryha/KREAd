import { FC } from "react";

import { text } from "../../../assets";
import { BaseCharacter, Label } from "../../../components";
import { CharacterItems } from "../../../interfaces";

import {
  DetailSectionSegmentStoryCreators,
  DetailSectionSegmentStoryCreatorsImg,
  DetailSectionSegmentStoryCreatorsImgContainer,
  DetailSectionSegmentStoryDescription,
  DetailSectionSegmentStoryImg,
  DetailSectionSegmentStoryWrap,
  ImageContainer,
} from "./styles";

interface Data {
  characterImage?: string;
  name: string;
  description: string;
  image: string | CharacterItems;
  creatorImage: string;
}

interface DetailSectionSegmentStoryProps {
  data: Data;
}

export const DetailSectionSegmentStory: FC<DetailSectionSegmentStoryProps> = ({ data }) => {
  return (
    <>
      <DetailSectionSegmentStoryWrap>
        <DetailSectionSegmentStoryCreators>
          <Label>{text.item.creators}</Label>
          <DetailSectionSegmentStoryCreatorsImgContainer>
            <DetailSectionSegmentStoryCreatorsImg alt={data.name} src={data.creatorImage} />
          </DetailSectionSegmentStoryCreatorsImgContainer>
        </DetailSectionSegmentStoryCreators>
        <DetailSectionSegmentStoryDescription>{data.description}</DetailSectionSegmentStoryDescription>
      </DetailSectionSegmentStoryWrap>

      {typeof data.image === "string" ? (
        <DetailSectionSegmentStoryImg src={data.image} />
      ) : (
        <ImageContainer>
          <BaseCharacter characterImage={data.characterImage} items={data.image} size="half" />
        </ImageContainer>
      )}
    </>
  );
};
