import { Item, ItemInMarket } from "./item.interfaces";

// TODO: add fetched flag for each array
export type ItemState = {
  items: Item[];
  owned: Item[];
  equipped: Item[];
  market: ItemInMarket[];

  fetched: boolean;
  marketFetched: boolean;
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

interface SetEquippedItems {
  type: "SET_EQUIPPED_ITEMS";
  payload: Item[];
}

interface SetItemsMarket {
  type: "SET_ITEMS_MARKET";
  payload: ItemInMarket[];
}

interface AddItemsMarket {
  type: "ADD_ITEMS_MARKET";
  payload: ItemInMarket[];
}

interface SetFetched {
  type: "SET_FETCHED";
  payload: boolean;
}

interface SetMarketFetched {
  type: "SET_MARKET_FETCHED";
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
  | SetOwnedItems
  | AddOwnedItems
  | SetItemsMarket
  | AddItemsMarket
  | SetEquippedItems
  | SetMarketFetched;

export type ItemDispatch = React.Dispatch<ItemStateActions>;
