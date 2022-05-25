import { FC } from "react";
import { ActivityTableWrap } from "./styles";

import { ActivityEvent, Item } from "../../interfaces";
import { text } from "../../assets";
import { SecondaryButton } from "../atoms";

interface ActivityTableProps {
  item: Item;
}

interface ActivityEventProps {
  event: ActivityEvent;
}

const ActivityEventTableRow: FC<ActivityEventProps> = ({ event }) => {
  return (
    <tr>
      <td>{event.type}</td>
      <td>{event.price}</td>
      <td>{event.from}</td>
      <td>{event.to}</td>
      <td>{event.date}</td>
    </tr>
  );
};

export const ActivityTable: FC<ActivityTableProps> = ({ item }) => {
  return (
    <ActivityTableWrap>
      <thead>
        <tr>
          <th>{text.item.event}</th>
          <th>{text.item.price}</th>
          <th>{text.item.from}</th>
          <th>{text.item.to}</th>
          <th>{text.item.date}</th>
        </tr>
      </thead>
      <tbody>
        {item.activity.map((event) => (
          <ActivityEventTableRow key={event.date} event={event} />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={5}>
            <SecondaryButton>{"Load More"}</SecondaryButton>
          </td>
        </tr>
      </tfoot>
    </ActivityTableWrap>
  );
};
