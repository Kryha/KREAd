import { FC } from "react";

import { ActivityTableWrap, BodyWrap, Cell, HeaderWrap, RowWrap } from "./styles";
import { ActivityEvent } from "../../interfaces";
import { text } from "../../assets";
import { CategoryButton } from "../../containers/detail-section/detail-section-header/styles";
import { getDatefromEpoch } from "../../util";
import { color } from "../../design";
import { BoldLabel } from "../atoms";
import json5 from "json5";

interface ActivityTableProps {
  events?: ActivityEvent[];
}

interface RowProps {
  event: ActivityEvent;
}

const Header: FC = () => {
  return (
    <>
      <Cell>{text.item.event}</Cell>
      <Cell>{text.item.price}</Cell>
      <Cell>{text.item.from}</Cell>
      <Cell>{text.item.to}</Cell>
      <Cell>{text.item.date}</Cell>
    </>
  );
};

const Row: FC<RowProps> = ({ event }) => {
  return (
    <>
      <Cell>
        <CategoryButton>{event.name}</CategoryButton>
      </Cell>
      <Cell>
        <BoldLabel customColor={color.black}>{!!event.price && text.param.runPrice(event.price)}</BoldLabel>
      </Cell>
      <Cell>{event.from}</Cell>
      <Cell>{event.to}</Cell>
      <Cell>{getDatefromEpoch(event.date)}</Cell>
    </>
  );
};

// TODO: Define how we'll construct the Events since they'll not be a property of the Character NFT directly
export const ActivityTable: FC<ActivityTableProps> = ({ events }) => {
  return (
    <ActivityTableWrap>
      <HeaderWrap>
        <Header />
      </HeaderWrap>
      <BodyWrap>
        {/* {events?.map((event) => (
          <RowWrap key={event.date}>
            <Row event={event} />
          </RowWrap>
        ))} */}
      </BodyWrap>
    </ActivityTableWrap>
  );
};
