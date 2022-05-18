import { FC } from "react";
import { text } from "../../assets";

import { color } from "../../design";
import { toTwoDecimals } from "../../util";
import { BoldLabel } from "../atoms";
import { Diamond, PriceContainer } from "./styles";

interface PriceInRunProps {
  price: number;
}

export const PriceInRun: FC<PriceInRunProps> = ({ price }) => {
  return (
    <PriceContainer>
      <Diamond />
      <BoldLabel customColor={color.black}>{text.param.runPrice(toTwoDecimals(price))}</BoldLabel>
    </PriceContainer>
  );
};
