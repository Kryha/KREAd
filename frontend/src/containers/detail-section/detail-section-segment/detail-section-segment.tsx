import { FC } from "react";
import { DetailSectionSegmentTitle } from "../detail-section-segment-title";
import { DetailSectionSegmentWrap } from "./styles";

interface DetailSectionSegmentProps {
  children?: React.ReactNode;
  title: string;
  sectionIndex: number;
}

// TODO: Use props intead of hardcoded placeholder for image src
export const DetailSectionSegment: FC<DetailSectionSegmentProps> = ({ children, title, sectionIndex }) => {
  return (
    <DetailSectionSegmentWrap>
      <DetailSectionSegmentTitle sectionIndex={sectionIndex} title={title} />
      {children}
    </DetailSectionSegmentWrap>
  );
};
