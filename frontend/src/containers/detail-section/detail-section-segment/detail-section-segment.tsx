import { FC } from "react";
import { DetailSectionSegmentWrap } from "./styles";

interface DetailSectionSegmentProps {
  children?: React.ReactNode;
  title: string;
  index: number;
  image?: string;
}

// TODO: Use props intead of hardcoded placeholder for image src
export const DetailSectionSegment: FC<DetailSectionSegmentProps> = ({children, title, index, image}) => {
  return (
    <DetailSectionSegmentWrap>
      <header>{index} - {title}</header>
      {children}
      {image && <img src="https://via.placeholder.com/300.png" title={title} alt={title}/>}
    </DetailSectionSegmentWrap>
  );
};
