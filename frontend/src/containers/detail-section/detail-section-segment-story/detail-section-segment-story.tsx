import { FC } from "react";

import { text } from "../../../assets";
import { Label } from "../../../components";

import {
  DetailSectionSegmentStoryCreators,
  DetailSectionSegmentStoryCreatorsImg,
  DetailSectionSegmentStoryCreatorsImgContainer,
  DetailSectionSegmentStoryDescription,
  DetailSectionSegmentStoryImg,
  DetailSectionSegmentStoryWrap,
} from "./styles";

interface Data {
  name: string;
  description: string;
  image: string;
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
      <DetailSectionSegmentStoryImg src={data.image} />
    </>
  );
};
