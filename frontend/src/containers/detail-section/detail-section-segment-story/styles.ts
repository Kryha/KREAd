import styled from "styled-components";
import { color, fontSize, imageSize, margins } from "../../../design";

export const DetailSectionSegmentStoryWrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${margins.extraLarge};
`;

export const DetailSectionSegmentStoryCreators = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${margins.medium};
  width: 350px;
`;

export const DetailSectionSegmentStoryCreatorsImg = styled.img`
  width: ${imageSize.minute};
  height: auto;
  border: 1px solid ${color.grey};
  border-radius: 15px;
`;

export const DetailSectionSegmentStoryDescription = styled.p`
  font-size: ${fontSize.medium};
  flex-grow: 2;
`;
