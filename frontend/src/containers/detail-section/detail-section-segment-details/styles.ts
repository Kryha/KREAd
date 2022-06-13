import styled from "@emotion/styled";
import { FlexRow } from "../../../components";
import { color, fontSize, fontWeight, margins } from "../../../design";
import { DetailSectionBody } from "../detail-section-segment/styles";

export const DetailSectionSegmentDetailsWrap = styled.div`
  ${FlexRow} {
    gap: ${margins.mini};
  }
  ${DetailSectionBody} {
    text-transform: capitalize;
  }
`;

export const DetailSectionSegmentDetailsLink = styled.a`
  text-decoration: none;
  color: ${color.black};
  font-size: ${fontSize.small};
  font-weight: ${fontWeight.light};
`;
