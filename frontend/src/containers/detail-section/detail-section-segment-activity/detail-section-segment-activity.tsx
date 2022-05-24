import { FC } from "react";
import { Item } from "../../../interfaces";

import { DetailSectionSegmentActivityWrap } from "./styles";

interface DetailSectionSegmentActivityProps {
  item: Item;
}

// TODO: Use props intead of hardcoded placeholder for image src
export const DetailSectionSegmentActivity: FC<DetailSectionSegmentActivityProps> = ({ item }) => {
  return <DetailSectionSegmentActivityWrap>{item.name}</DetailSectionSegmentActivityWrap>;
};
