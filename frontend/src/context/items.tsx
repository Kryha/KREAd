import React, { createContext, useReducer, useContext } from "react";
import { ItemDispatch, ItemState, ItemStateActions } from "../interfaces/item-actions.interfaces";

const initialState: ItemState = {
  items: [],
  owned: [],
  equipped: [],
  market: [],
  fetched: false,
};

const Context = createContext<ItemState | undefined>(undefined);
const DispatchContext = createContext<ItemDispatch | undefined>(undefined);

const Reducer = (state: ItemState, action: ItemStateActions): ItemState => {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, fetched: true, items: action.payload };

    case "ADD_ITEMS":
      return { ...state, fetched: true, items: [...state.items, ...action.payload] };

    case "SET_ITEMS_MARKET":
      return { ...state, market: action.payload };

    case "ADD_ITEMS_MARKET":
      return { ...state, fetched: true, market: [...state.market, ...action.payload] };

    case "SET_OWNED_ITEMS":
      return { ...state, owned: action.payload };

    case "ADD_OWNED_ITEMS":
      return { ...state, fetched: true, owned: [...state.owned, ...action.payload] };

    case "SET_FETCHED":
      return { ...state, fetched: action.payload };

    case "RESET":
      return initialState;

    default:
      throw new Error("Only defined action types can be handled;");
  }
};

type ProviderProps = Omit<React.ProviderProps<ItemState>, "value">;

export const ItemStateProvider = (props: ProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{props.children}</DispatchContext.Provider>
    </Context.Provider>
  );
};

export const useItemState = (): ItemState => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("useItemState can only be called inside ItemStateProvider.");
  }
  return state;
};

export const useItemStateDispatch = (): React.Dispatch<ItemStateActions> => {
  const dispatch = useContext(DispatchContext);
  if (dispatch === undefined) {
    throw new Error("useItemDispatch can only be called inside a ItemProvider.");
  }
  return dispatch;
};

export const useItemContext = (): [ItemState, ItemDispatch] => [useItemState(), useItemStateDispatch()];
