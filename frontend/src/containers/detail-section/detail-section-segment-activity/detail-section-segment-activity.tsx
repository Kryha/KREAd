import { FC } from "react";

import { ActivityTable } from "../../../components/activity-table/activity-table";
import { ActivityEvent } from "../../../interfaces";
import { DetailSectionSegmentActivityWrap } from "./styles";

interface Props {
  events: ActivityEvent[];
}

// TODO: Fis missing activity
export const DetailSectionSegmentActivity: FC<Props> = ({ events }) => {
  return <DetailSectionSegmentActivityWrap>{/* <ActivityTable events={events} /> */}</DetailSectionSegmentActivityWrap>;
};
