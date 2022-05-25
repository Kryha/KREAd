import { FC } from "react";
import { ActivityTableWrap, BodyWrap, FooterWrap, HeaderWrap, RowWrap } from "./styles";

import { ActivityEvent, Item } from "../../interfaces";
import { RefreshIcon, text } from "../../assets";
import { SecondaryButton } from "../atoms";
import { CategoryButton } from "../../containers/detail-section/detail-section-header/styles";

interface ActivityTableProps {
  item: Item;
}

interface RowProps {
  event: ActivityEvent;
}

interface HeadertProps {
  text: {
    event: string;
    price: string;
    from: string;
    to: string;
    date: string;
  };
}

const Header: FC<HeadertProps> = ({ text }) => {
  return (
    <>
      <div>{text.event}</div>
      <div>{text.price}</div>
      <div>{text.from}</div>
      <div>{text.to}</div>
      <div>{text.date}</div>
    </>
  );
};

const Row: FC<RowProps> = ({ event }) => {
  return (
    <>
      <div>
        <CategoryButton>{event.type}</CategoryButton>
      </div>
      <div>{!!event.price && text.param.runPrice(event.price)}</div>
      <div>{event.from}</div>
      <div>{event.to}</div>
      <div>{event.date}</div>
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
