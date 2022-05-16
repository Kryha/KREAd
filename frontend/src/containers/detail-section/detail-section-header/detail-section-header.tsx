import { FC } from "react";

import { DetailSectionHeaderWrap } from "./styles";
import { Item } from "../../../interfaces";

interface DetailSectionHeaderProps {
  item: Item
};

export const DetailSectionHeader: FC<DetailSectionHeaderProps> = ({ item }) => {
  return (
    <DetailSectionHeaderWrap>
      <h1>{item.name}</h1>
    </DetailSectionHeaderWrap>
  )
}
