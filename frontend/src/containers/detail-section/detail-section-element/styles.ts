import styled from "@emotion/styled";
import { FlexRow } from "../../../components";
import { color, fontSize, fontWeight, margins } from "../../../design";

export const DetailSectionElementWrap = styled.div`
  display: block;
  width: 100%;
  margin-bottom: ${margins.medium};
`;

export const DetailSectionElemenTitle = styled.h3`
  display: inline-block;
  color: ${color.darkGrey};
  font-size: ${fontSize.subTitle};
  font-weight: ${fontWeight.medium};
  text-transform: capitalize;
`;

export const TitleFlexRow = styled(FlexRow)`
  align-items: center;
  gap: 24px;
  margin-bottom: ${margins.mini};
`;
