import { FC } from "react";

import { text, UnnamedCreator } from "../../../assets";
import { Label } from "../../../components";

import { Item } from "../../../interfaces";
import {
  DetailSectionSegmentStoryCreators,
  DetailSectionSegmentStoryCreatorsImgContainer,
  DetailSectionSegmentStoryDescription,
  DetailSectionSegmentStoryImg,
  DetailSectionSegmentStoryWrap,
} from "./styles";

interface DetailSectionSegmentStoryProps {
  item: Item;
}

// TODO: Use props intead of hardcoded placeholder for image src
export const DetailSectionSegmentStory: FC<DetailSectionSegmentStoryProps> = ({ item }) => {
  return (
    <>
      <DetailSectionSegmentStoryWrap>
        <DetailSectionSegmentStoryCreators>
          <Label>{text.item.creators}</Label>
          <DetailSectionSegmentStoryCreatorsImgContainer>
            <img alt={item.name} src={UnnamedCreator} />
          </DetailSectionSegmentStoryCreatorsImgContainer>
        </DetailSectionSegmentStoryCreators>
        <DetailSectionSegmentStoryDescription>{item.description}</DetailSectionSegmentStoryDescription>
      </DetailSectionSegmentStoryWrap>
      <DetailSectionSegmentStoryImg src={item.image} />
    </>
  );
};
