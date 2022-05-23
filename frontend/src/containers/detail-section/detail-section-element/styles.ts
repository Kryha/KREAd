import styled from "styled-components";
import { color, fontSize, fontWeight, margins } from "../../../design";

export const DetailSectionElementWrap = styled.div`
  display: block;
  width: 100%;
  margin-bottom: ${margins.medium};
`;

export const DetailSectionElemenTitle = styled.h3`
  display: inline-block;
  color: ${color.darkGrey};
  font-size: ${fontSize.title};
  font-weight: ${fontWeight.medium};
  text-transform: capitalize;
  margin-bottom: ${margins.mini};
  margin-right: ${margins.medium};
`;
