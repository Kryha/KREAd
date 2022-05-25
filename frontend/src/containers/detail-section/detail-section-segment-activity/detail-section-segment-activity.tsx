import { FC } from "react";
import { Item } from "../../../interfaces";

import { DetailSectionSegmentActivityWrap } from "./styles";

interface DetailSectionSegmentActivityProps {
  item: Item;
}

export const DetailSectionSegmentActivity: FC<DetailSectionSegmentActivityProps> = ({ item }) => {
  return <DetailSectionSegmentActivityWrap>{item.name}</DetailSectionSegmentActivityWrap>;
};
