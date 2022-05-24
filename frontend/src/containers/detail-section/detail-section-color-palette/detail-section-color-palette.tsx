import React, { FC } from "react";
import { DetailSectionColorPaletteWrap } from "./styles";

interface DetailSectionColorPaletteProps {
  hexCodeList: string[];
  hexCode?: string;
}

// TODO: remove maybe once changed
interface ColorPaletteProps {
  hexCode?: string;
}

export const ColorPalette: FC<ColorPaletteProps> = ({ hexCode }) => {
  return (
    <DetailSectionColorPaletteWrap>
      <svg key={hexCode} width="50px" height="50px">
        <circle cx="25" cy="25" r="25" stroke="transparent" strokeWidth="4" fill={hexCode} />
      </svg>
    </DetailSectionColorPaletteWrap>
  );
};

export const DetailSectionColorPalette: FC<DetailSectionColorPaletteProps> = ({ hexCodeList }) => {
  return (
    <DetailSectionColorPaletteWrap>
      {hexCodeList.map((hexCode) => {
        return (
          <ColorPalette key={hexCode} hexCode={hexCode} />
        );
      })}
    </DetailSectionColorPaletteWrap>
  );
};
