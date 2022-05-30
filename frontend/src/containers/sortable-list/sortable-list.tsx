import { FC } from "react";
import { Item } from "../../interfaces";
import { SortableListWrap } from "./styles";

interface SortableListProps {
  items: Item[];
}

export const SortableList: FC<SortableListProps> = ({ items }) => {
  return <SortableListWrap>{items.length}</SortableListWrap>;
};
