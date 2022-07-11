import { Item } from "./item.interfaces";

export type ItemState = {
  items: Item[];
  owned: Item[];
  equipped: Item[];
  // TODO: use Item type enriched with instance and publicFacet instead of any
  market: any[];
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

export type ItemStateActions = Reset | SetFetched | SetItems | AddItems | SetOwnedItems | AddOwnedItems | SetItemsMarket | AddItemsMarket;

export type ItemDispatch = React.Dispatch<ItemStateActions>;
