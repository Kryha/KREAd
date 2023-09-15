import { FC } from "react";

import { ActivityTableWrap, BodyWrap, Cell, HeaderWrap, RowWrap } from "./styles";
import { ActivityEvent } from "../../interfaces";
import { text } from "../../assets";
import { CategoryButton } from "../../containers/detail-section/detail-section-header/styles";
import { getDatefromEpoch } from "../../util";
import { color } from "../../design";
import { BoldLabel } from "../atoms";

interface ActivityTableProps {
  events: ActivityEvent[];
}

interface RowProps {
  event: ActivityEvent;
}

// TODO: implement to and from if/when possible
const Header: FC = () => {
  return (
    <>
      <Cell>{text.item.event}</Cell>
      <Cell>{text.item.price}</Cell>
      {/* <Cell>{text.item.from}</Cell>
      <Cell>{text.item.to}</Cell> */}
      <Cell>{text.item.date}</Cell>
    </>
  );
};

const Row: FC<RowProps> = ({ event }) => {
  return (
    <>
      <Cell>
        <CategoryButton>{event.type}</CategoryButton>
      </Cell>
      <Cell>
        <BoldLabel customColor={color.black}>{!!event.price && text.param.istPrice(event.price)}</BoldLabel>
      </Cell>
      {/* <Cell>{event.from}</Cell>
      <Cell>{event.to}</Cell> */}
      <Cell>{getDatefromEpoch(Number(event.date))}</Cell>
    </>
  );
};

export const ActivityTable: FC<ActivityTableProps> = ({ events }) => {
  return (
    <ActivityTableWrap>
      <HeaderWrap>
        <Header />
      </HeaderWrap>
      <BodyWrap>
        {events.map((event) => (
          <RowWrap key={Number(event.date)}>
            <Row event={event} />
          </RowWrap>
        ))}
      </BodyWrap>
    </ActivityTableWrap>
  );
};
