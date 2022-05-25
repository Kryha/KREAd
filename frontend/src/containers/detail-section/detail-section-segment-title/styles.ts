import styled from "styled-components";
import { color, fontSize, fontWeight, margins } from "../../../design";

export const DetailSectionSegmentTitleWrap = styled.header`
  position: relative;
  padding-bottom: ${margins.large};
`;

export const DetailSectionSegmentHeader = styled.h2`
  font-size: ${fontSize.sectionTitle};
  font-weight: ${fontWeight.medium};
  position: relative;
  left: 30px;
  &::first-letter {
    text-transform: capitalize;
  }
`;

export const DetailSectionSegmentIndex = styled.sup`
  font-size: ${fontSize.extraSmall};
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
  color: ${color.black};
`;
