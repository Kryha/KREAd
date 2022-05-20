import styled from "styled-components";
import { BodyText } from "../../../components";
import { color, fontSize, fontWeight, margins } from "../../../design";

export const DetailSectionElementWrap = styled.div`
  display: block;
  ${BodyText} {
    font-size: ${fontSize.tiny};
    color: blue;
  }
`;

export const DetailSectionElemenTitle = styled.h3`
  color: ${color.darkGrey};
  font-size: ${fontSize.title};
  font-weight: ${fontWeight.medium};
  text-transform: capitalize;
  margin-bottom: ${margins.mini};
`;
