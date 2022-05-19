import { FC } from "react";

import { DetailSectionSegmentIndex, DetailSectionSegmentTitleWrap } from "./styles";

interface DetailSectionSegmentTitleProps {
  title: string;
  sectionIndex: number;
}

export const DetailSectionSegmentTitle: FC<DetailSectionSegmentTitleProps> = ({ title, sectionIndex }) => {
  return (
    <DetailSectionSegmentTitleWrap>
      <DetailSectionSegmentIndex>0{sectionIndex}</DetailSectionSegmentIndex>
      <h2>{title}</h2>
    </DetailSectionSegmentTitleWrap>
  );
};
