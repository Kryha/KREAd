import { FC } from "react";
import { text } from "../../../assets";
import { OverviewEmpty } from "../../../components";
import { ActivityTable } from "../../../components/activity-table/activity-table";

import { ActivityEvent } from "../../../interfaces";
import { DetailSectionSegmentActivityWrap } from "./styles";

interface Props {
  events?: ActivityEvent[];
}

export const DetailSectionSegmentActivity: FC<Props> = ({ events }) => {
  if (!events || !events.length) return <OverviewEmpty descriptionText={text.general.thereIsNoActity}/>;
  return <DetailSectionSegmentActivityWrap><ActivityTable events={events}/></DetailSectionSegmentActivityWrap>;
};
