import React, { FC } from "react";
import { FlexRow } from "../../../components";
import { ButtonInfo } from "../../../components/button-info";
import { InfoPosition } from "../../../interfaces/layout.types";
import { DetailSectionElemenTitle, DetailSectionElementWrap } from "./styles";

interface DetailSectionElementProps {
  children?: React.ReactNode;
  title: string;
  info?: string;
  infoPosition?: InfoPosition;
}

export const DetailSectionElement: FC<DetailSectionElementProps> = ({ title, children, info, infoPosition }) => {
  return (
    <DetailSectionElementWrap>
      <FlexRow>
        <DetailSectionElemenTitle>{title}</DetailSectionElemenTitle>
        {!!info && <ButtonInfo title={title} info={info} infoPosition={infoPosition} />}
      </FlexRow>
      {children}
    </DetailSectionElementWrap>
  );
};
