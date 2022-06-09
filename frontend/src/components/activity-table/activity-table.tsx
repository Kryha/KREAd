import { FC } from "react";

import { ActivityTableWrap, BodyWrap, Cell, FooterWrap, HeaderWrap, RowWrap } from "./styles";
import { ActivityEvent } from "../../interfaces";
import { RefreshIcon, text } from "../../assets";
import { SecondaryButton } from "../atoms";
import { CategoryButton } from "../../containers/detail-section/detail-section-header/styles";
import { getDatefromEpoch } from "../../util";

interface ActivityTableProps {
  events: ActivityEvent[];
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
        <b>{!!event.price && text.param.runPrice(event.price)}</b>
      </Cell>
      <Cell>{event.from}</Cell>
      <Cell>{event.to}</Cell>
      <Cell>{getDatefromEpoch(event.date)}</Cell>
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
          <RowWrap key={event.date}>
            <Row event={event} />
          </RowWrap>
        ))}
      </BodyWrap>
      <FooterWrap>
        <SecondaryButton>
          {text.general.loadMore} <RefreshIcon />
        </SecondaryButton>
      </FooterWrap>
    </ActivityTableWrap>
  );
};
