import styled from "styled-components";
import { color, fontSize, fontWeight, margins } from "../../../design";

export const DetailSectionSegmentWrap = styled.div`
  margin-bottom: ${margins.extraLarge};
  display: flex;
  flex-flow: column nowrap;
`;

export const DetailSectionBody = styled.p`
  color: ${color.black};
  font-size: ${fontSize.medium};
  font-weight: ${fontWeight.regular};
`;

export const DetailSectionBodyBigBold = styled.p`
  color: ${color.black};
  font-size: ${fontSize.large};
  font-weight: ${fontWeight.medium};
`;
