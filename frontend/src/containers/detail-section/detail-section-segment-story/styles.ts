import styled from "@emotion/styled";
import { CharacterWrapper, ExpandButton } from "../../../components/base-character/styles";
import { color, fontSize, imageSize, margins } from "../../../design";

export const DetailSectionSegmentStoryWrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${margins.extraLarge};
  margin-bottom: ${margins.extraLarge};
`;

export const DetailSectionSegmentStoryCreators = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${margins.small};
  width: 350px;
`;

export const DetailSectionSegmentStoryCreatorsImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${imageSize.medium};
  height: ${imageSize.medium};
  text-align: center;
  border: 1px solid ${color.grey};
  border-radius: ${margins.medium};
`;

export const DetailSectionSegmentStoryCreatorsImg = styled.img`
  object-fit: contain;
`;

export const DetailSectionSegmentStoryDescription = styled.p`
  font-size: ${fontSize.medium};
  flex-grow: 2;
`;

export const DetailSectionSegmentStoryImg = styled.img`
  width: 100%;
  max-height: 680px;
  box-sizing: border-box;
  border: 1px solid ${color.grey};
  border-radius: ${margins.medium};
  background-color: ${color.white};
  object-fit: contain;
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 550px;
  box-sizing: border-box;
  border: 1px solid ${color.grey};
  border-radius: ${margins.medium};
  background-color: ${color.white};

  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  ${CharacterWrapper} {
    position: relative;
    right: 33%;
    left: 33%;
  }
  ${ExpandButton} {
    display: none;
  }
`;
