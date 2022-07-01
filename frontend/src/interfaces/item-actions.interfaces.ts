import { Item } from "./item.interfaces";

export type ItemState = {
  fetched: boolean;
  items: Item[];
  inventory: Item[];
  // TODO: use Item type enriched with instance and publicFacet instead of any
  market: any[];
};

interface SetItems {
  type: "SET_ITEMS";
  payload: Item[];
}

interface AddItems {
  type: "ADD_ITEMS";
  payload: Item[];
}

interface SetItemsInventory {
  type: "SET_ITEMS_INVENTORY";
  payload: Item[];
}

interface AddItemsInventory {
  type: "ADD_ITEMS_INVENTORY";
  payload: Item[];
}

interface SetItemsMarket {
  type: "SET_ITEMS_MARKET";
  payload: any[];
}

interface AddItemsMarket {
  type: "ADD_ITEMS_MARKET";
  payload: any[];
}

interface SetFetched {
  type: "SET_FETCHED";
  payload: boolean;
}

interface Reset {
  type: "RESET";
}

export type ItemStateActions =
  | Reset
  | SetFetched
  | SetItems
  | AddItems
  | SetItemsInventory
  | AddItemsInventory
  | SetItemsMarket
  | AddItemsMarket;

export type ItemDispatch = React.Dispatch<ItemStateActions>;
