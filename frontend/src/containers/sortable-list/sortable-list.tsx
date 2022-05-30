import { FC } from "react";
import { MenuItem } from "../../components";
import { Item } from "../../interfaces";
import { SortableListWrap } from "./styles";

interface SortableListProps {
  items: Item[];
}

// TODO: Add filter & sortyng Hooks and components

export const SortableList: FC<SortableListProps> = ({ items }) => {
  return (
    <SortableListWrap>
      {/* TODO: add filters nav header */}
      {items.map((item) => (
        <MenuItem item={item} key={item.id} />
      ))}
    </SortableListWrap>
  );
};
