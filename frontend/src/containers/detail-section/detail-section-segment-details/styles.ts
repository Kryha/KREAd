import styled from "styled-components";
import { FlexRow } from "../../../components";
import { color, fontSize, fontWeight, margins } from "../../../design";
import { DetailSectionBody } from "../detail-section-segment/styles";

export const DetailSectionSegmentDetailsWrap = styled.div`
  ${FlexRow} {
    gap: ${margins.mini};
  }
  a {
    text-decoration: none;
    color: ${color.black};
    font-size: ${fontSize.small};
    font-weight: ${fontWeight.light};
  }
  ${DetailSectionBody} {
    text-transform: capitalize;
  }
`;
