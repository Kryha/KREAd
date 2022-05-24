import { FC } from "react";
import { text } from "../../../assets";

import { DetailSectionSegmentIndex, DetailSectionSegmentTitleWrap, DetailSectionSegmentHeader } from "./styles";

interface DetailSectionSegmentTitleProps {
  title: string;
  sectionIndex: number;
}

export const DetailSectionSegmentTitle: FC<DetailSectionSegmentTitleProps> = ({ title, sectionIndex }) => {
  return (
    <DetailSectionSegmentTitleWrap>
      <DetailSectionSegmentIndex>{text.param.withZeroPrefix(sectionIndex)}</DetailSectionSegmentIndex>
      <DetailSectionSegmentHeader>{title}</DetailSectionSegmentHeader>
    </DetailSectionSegmentTitleWrap>
  );
};
