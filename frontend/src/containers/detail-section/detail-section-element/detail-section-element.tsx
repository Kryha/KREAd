import React, { FC } from "react";

import { ButtonInfo } from "../../../components/button-info";
import { InfoPosition } from "../../../interfaces/layout.types";
import {
  DetailSectionElemenTitle,
  DetailSectionElementWrap,
  TitleFlexRow,
} from "./styles";

interface DetailSectionElementProps {
  children?: React.ReactNode;
  title: string;
  info?: string;
  infoPosition?: InfoPosition;
}

export const DetailSectionElement: FC<DetailSectionElementProps> = ({
  title,
  children,
  info,
  infoPosition,
}) => {
  return (
    <DetailSectionElementWrap>
      <TitleFlexRow>
        <DetailSectionElemenTitle>{title}</DetailSectionElemenTitle>
        {!!info && (
          <ButtonInfo title={title} info={info} infoPosition={infoPosition} />
        )}
      </TitleFlexRow>
      {children}
    </DetailSectionElementWrap>
  );
};
