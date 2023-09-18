import React, { createContext, useContext, useEffect, useState } from "react";
import { ItemInMarket } from "../interfaces";
import { useAgoricState } from "./agoric";
import { watchItemMarket } from "../service/storage-node/watch-market";

interface ItemMarketContext {
  items: ItemInMarket[];
  fetched: boolean;
}
const initialState: ItemMarketContext = {
  items: [],
  fetched: false,
};

const Context = createContext<ItemMarketContext | undefined>(undefined);

type ProviderProps = Omit<React.ProviderProps<ItemMarketContext>, "value">;

export const ItemMarketContextProvider = (props: ProviderProps): React.ReactElement => {
  const [marketState, marketDispatch] = useState(initialState);
  const agoric = useAgoricState();
  const [watchingStore, setWatchingStore] = useState(false);

  useEffect(() => {
    const parseItemMarketUpdate = async (itemsInMarket: ItemInMarket[]) => {
      const items = await Promise.all(itemsInMarket.map((item) => formatMarketEntry(item)));
      marketDispatch((prevState: any) => ({ ...prevState, items, fetched: true }));
    };
    const formatMarketEntry = async (marketEntry: ItemInMarket): Promise<ItemInMarket> => {
      const item = marketEntry.object;

      return {
        id: marketEntry.id.toString(),
        item,
        sell: {
          price: marketEntry.askingPrice.value,
        },
      };
    };

    if (agoric.chainStorageWatcher && !watchingStore) {
      watchItemMarket(agoric.chainStorageWatcher, parseItemMarketUpdate);
      setWatchingStore(true);
      console.count("✅ LISTENING TO ITEM SHOP NOTIFIER");
    }
  }, [agoric, watchingStore]);

  return <Context.Provider value={marketState}>{props.children}</Context.Provider>;
};

export const useItemMarketState = (): ItemMarketContext => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("ItemMarketState can only be called inside ItemMarketStateProvider.");
  }
  return state;
};
