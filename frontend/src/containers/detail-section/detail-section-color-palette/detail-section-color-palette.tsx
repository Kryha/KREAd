import React, { FC } from "react";
import { DetailSectionColorPaletteWrap } from "./styles";

interface DetailSectionColorPaletteProps {
  hexCodeList: string[];
  amount?: number;
}

export const DetailSectionColorPalette: FC<DetailSectionColorPaletteProps> = ({ hexCodeList }) => {
  return (
    <DetailSectionColorPaletteWrap>
      {hexCodeList.map((hexCode) => {
        return (
          <svg key={hexCode} width="50px" height="50px">
            <circle cx="25" cy="25" r="25" stroke="transparent" strokeWidth="4" fill={hexCode} />
          </svg>
        );
      })}
    </DetailSectionColorPaletteWrap>
  );
};
