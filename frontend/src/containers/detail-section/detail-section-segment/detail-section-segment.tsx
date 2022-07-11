import { FC } from "react";
import { DetailSectionSegmentTitle } from "../detail-section-segment-title";
import { DetailSectionSegmentWrap } from "./styles";

interface DetailSectionSegmentProps {
  children?: React.ReactNode;
  title: string;
  sectionIndex: number;
  isActivity?: boolean;
}

// TODO: Use props intead of hardcoded placeholder for image src
export const DetailSectionSegment: FC<DetailSectionSegmentProps> = ({ children, title, sectionIndex, isActivity = false }) => {
  return (
    <DetailSectionSegmentWrap isActivity={isActivity}>
      <DetailSectionSegmentTitle sectionIndex={sectionIndex} title={title} />
      {children}
    </DetailSectionSegmentWrap>
  );
};
