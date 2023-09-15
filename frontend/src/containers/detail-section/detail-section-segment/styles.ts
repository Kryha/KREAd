import styled from "@emotion/styled";
import { OverviewWrapper } from "../../../components/overview-empty/styles";
import { color, fontSize, fontWeight } from "../../../design";

interface DetailSectionProps {
  isActivity: boolean;
}

export const DetailSectionSegmentWrap = styled.div<DetailSectionProps>`
  display: flex;
  flex-flow: column nowrap;
  ${({ isActivity }): string => {
    return isActivity
      ? `
        `
      : `
        margin-bottom: 150px;
      `;
  }};
  ${OverviewWrapper} {
    padding-left: 0px;
  }
`;

export const DetailSectionBody = styled.p`
  color: ${color.black};
  font-size: ${fontSize.title};
  font-weight: ${fontWeight.regular};
`;

export const DetailSectionBodyBigBold = styled.p`
  color: ${color.black};
  font-size: ${fontSize.large};
  font-weight: ${fontWeight.medium};
`;
