import { FC } from "react";
import { ActivityTableWrap, BodyWrap, Cell, FooterWrap, HeaderWrap, RowWrap } from "./styles";

import { ActivityEvent, Item } from "../../interfaces";
import { RefreshIcon, text } from "../../assets";
import { SecondaryButton } from "../atoms";
import { CategoryButton } from "../../containers/detail-section/detail-section-header/styles";

import { getDatefromEpoch } from "../../util";

interface ActivityTableProps {
  item: Item;
}

interface RowProps {
  event: ActivityEvent;
}

interface HeaderProps {
  text: {
    event: string;
    price: string;
    from: string;
    to: string;
    date: string;
  };
}

const Header: FC<HeaderProps> = ({ text }) => {
  return (
    <>
      <Cell>{text.event}</Cell>
      <Cell>{text.price}</Cell>
      <Cell>{text.from}</Cell>
      <Cell>{text.to}</Cell>
      <Cell>{text.date}</Cell>
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
        <b>{!!event.price && text.param.runPrice(event.price)}</b>
      </Cell>
      <Cell>{event.from}</Cell>
      <Cell>{event.to}</Cell>
      <Cell>{getDatefromEpoch(event.date)}</Cell>
    </>
  );
};

export const ActivityTable: FC<ActivityTableProps> = ({ item }) => {
  return (
    <ActivityTableWrap>
      <HeaderWrap>
        <Header text={text.item} />
      </HeaderWrap>
      <BodyWrap>
        {item.activity.map((event) => (
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
