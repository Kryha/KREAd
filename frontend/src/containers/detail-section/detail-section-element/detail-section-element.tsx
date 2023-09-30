import React, { FC } from "react";

import { ButtonInfo } from "../../../components/button-info";
import { InfoPosition } from "../../../interfaces";
import { DetailSectionElemenTitle, DetailSectionElementWrap, TitleFlexRow } from "./styles";

interface DetailSectionElementProps {
  children?: React.ReactNode;
  title: string;
  info?: string;
  infoPosition?: InfoPosition;
}

export const DetailSectionElement: FC<DetailSectionElementProps> = ({ title, children, info, infoPosition }) => {
  return (
    <DetailSectionElementWrap>
      <TitleFlexRow>
        {!!info && <ButtonInfo title={title} info={info} infoPosition={infoPosition} />}
        <DetailSectionElemenTitle>{title}</DetailSectionElemenTitle>
      </TitleFlexRow>
      {children}
    </DetailSectionElementWrap>
  );
};
