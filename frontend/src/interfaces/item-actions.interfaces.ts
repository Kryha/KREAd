import { Item } from "./item.interfaces";

export type ItemState = {
  items: Item[];
  owned: Item[];
  fetched: boolean;
};

interface SetItems {
  type: "SET_ITEMS";
  payload: Item[];
}
interface AddItems {
  type: "ADD_ITEMS";
  payload: Item[];
}
interface SetOwnedItems {
  type: "SET_OWNED_ITEMS";
  payload: Item[];
}
interface AddOwnedItems {
  type: "ADD_OWNED_ITEMS";
  payload: Item[];
}
interface SetFetched {
  type: "SET_FETCHED";
  payload: boolean;
}
interface Reset {
  type: "RESET";
}

export type ItemStateActions = Reset | SetFetched | SetItems | AddItems | SetOwnedItems | AddOwnedItems;

export type ItemDispatch = React.Dispatch<ItemStateActions>;
