import styled from "@emotion/styled";
import { ArrowUpRightIcon } from "../../../assets";
import { FlexRow } from "../../../components";
import { color, margins } from "../../../design";
import { DetailSectionBody } from "../detail-section-segment/styles";

export const DetailSectionSegmentDetailsWrap = styled.div`
  ${FlexRow} {
    gap: ${margins.mini};
  }
  ${DetailSectionBody} {
    text-transform: capitalize;
  }
`;

export const ArrowUpRight = styled(ArrowUpRightIcon)`
  margin: 0px 0px 0px 13px !important;
`;

export const DetailSectionSegmentDetailsLink = styled.a`
  text-decoration: none;
  color: ${color.black};
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  &: hover {
    color: ${color.darkGrey};
    ${ArrowUpRight} {
      path {
        stroke: ${color.darkGrey};
      }
    }
  }
  &: focus {
    border: 1px solid ${color.darkGrey};
    border-radius: ${margins.medium};
    box-sizing: border-box;
    padding: ${margins.mini} ${margins.small} ${margins.mini} ${margins.small};
  }
`;
