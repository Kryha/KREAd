import { FC } from "react";
import { ActivityTable } from "../../../components/activity-table/activity-table";
import { Item } from "../../../interfaces";

import { DetailSectionSegmentActivityWrap } from "./styles";

interface DetailSectionSegmentActivityProps {
  item: Item;
}

export const DetailSectionSegmentActivity: FC<DetailSectionSegmentActivityProps> = ({ item }) => {
  return (
    <DetailSectionSegmentActivityWrap>
      <ActivityTable item={item} />
    </DetailSectionSegmentActivityWrap>
  );
};
