import { FC } from "react";
import { DetailSectionSegmentWrap } from "./styles";

interface DetailSectionSegmentProps {
  title: string,
  index: number,
  image?: string
}

export const DetailSectionSegment: FC<DetailSectionSegmentProps> = ({children, title, index, image}) => {
  return (
    <DetailSectionSegmentWrap>
      <header>{index} - {title}</header>
      {children}
      {image && <img src="https://via.placeholder.com/300.png" title={title} alt={title}/>}
    </DetailSectionSegmentWrap>
  );
};
