import { FC } from "react";

import { color } from "../../design";
import { toTwoDecimals, uISTToIST } from "../../util";
import { AssetTag, IST } from "../asset-card/styles";
import { LevelBoldLabel } from "../atoms";

interface PriceInIstProps {
  price: number;
}

export const PriceInIst: FC<PriceInIstProps> = ({ price }) => {
  return (
    <>
      <IST />
      <AssetTag>
        <LevelBoldLabel customColor={color.black}>{toTwoDecimals(Number(uISTToIST(price)))}</LevelBoldLabel>
      </AssetTag>
    </>
  );
};
