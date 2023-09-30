import { FC, useState } from "react";

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
import { Download, DownloadButton } from "../../../components/download-image/styles";
import styled from "@emotion/styled";
import { DownloadImageModal } from "../../../components/download-image";

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
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const handleDownloadButtonClick = () => {
    setIsDownloadOpen(true);
  };

  const handleCloseDownload = () => {
    setIsDownloadOpen(false);
  };
  return (
    <>
      <DetailSectionSegmentStoryWrap>
        <DetailSectionSegmentStoryCreators>
          <Label>{text.item.creators}</Label>
          <DetailSectionSegmentStoryCreatorsImgContainer>
            <DetailSectionSegmentStoryCreatorsImg alt={data.name} src={data.creatorImage} />
          </DetailSectionSegmentStoryCreatorsImgContainer>
        </DetailSectionSegmentStoryCreators>
        <DetailSectionSegmentStoryDescription>{text.util.correctDescriptionString(data.description)} </DetailSectionSegmentStoryDescription>
      </DetailSectionSegmentStoryWrap>

      {typeof data.image === "string" ? (
        <DetailSectionSegmentStoryImg src={data.image} />
      ) : (
        <ImageContainer>
          <BaseCharacter characterImage={data.characterImage} items={data.image} size="half" />
          <DownloadButtonContainer>
            <DownloadButton onClick={handleDownloadButtonClick}>
              <Download />
            </DownloadButton>
          </DownloadButtonContainer>
          <DownloadImageModal isOpen={isDownloadOpen} onClose={handleCloseDownload} />
        </ImageContainer>
      )}
    </>
  );
};

export const DownloadButtonContainer = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
`;
