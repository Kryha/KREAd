import { FC } from "react";
import { text } from "../../assets";

import { color } from "../../design";
import { toTwoDecimals, uISTToIST } from "../../util";
import { AssetTag } from "../asset-card/styles";
import { BoldLabel, LevelBoldLabel } from "../atoms";
import { Diamond } from "./styles";

interface PriceInIstProps {
  price: number;
}

export const PriceInIst: FC<PriceInIstProps> = ({ price }) => {
  return (
    <>
      <Diamond />
      <AssetTag>
        <BoldLabel customColor={color.black}>{text.param.istPrice}</BoldLabel>
        <LevelBoldLabel customColor={color.black}>{toTwoDecimals(Number(uISTToIST(price)))}</LevelBoldLabel>
      </AssetTag>
    </>
  );
};
