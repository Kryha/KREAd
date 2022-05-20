import React, { FC } from "react";
import { DetailSectionElemenTitle, DetailSectionElementWrap } from "./styles";

interface DetailSectionElementProps {
  children?: React.ReactNode;
  title: string;
}

export const DetailSectionElement: FC<DetailSectionElementProps> = ({ title, children }) => {
  return (
    <DetailSectionElementWrap>
      <DetailSectionElemenTitle>{title}</DetailSectionElemenTitle>
      {children}
    </DetailSectionElementWrap>
  );
};
