import React, { FC } from "react";
import { FlexRow } from "../../../components";
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
      <FlexRow>
        <DetailSectionElemenTitle>{title}</DetailSectionElemenTitle>
        {info && <ButtonInfo title={title} info={info} />}
      </FlexRow>
      {children}
    </DetailSectionElementWrap>
  );
};
