import React, { FC } from "react";
import { ButtonInfo } from "../../../components/button-info";
import { DetailSectionElemenTitle, DetailSectionElementWrap } from "./styles";

interface DetailSectionElementProps {
  children?: React.ReactNode;
  title: string;
  info?: string;
}

export const DetailSectionElement: FC<DetailSectionElementProps> = ({ title, children, info }) => {
  return (
    <DetailSectionElementWrap>
      <div>
        <DetailSectionElemenTitle>{title}</DetailSectionElemenTitle>
        {info && <ButtonInfo title={title} info={info} />}
      </div>
      {children}
    </DetailSectionElementWrap>
  );
};
