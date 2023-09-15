import React, { createContext, useContext, useEffect, useState } from "react";
import { ItemInMarket, KreadItemInMarket } from "../interfaces";
import { useAgoricState } from "./agoric";
import { watchItemMarket } from "../service/storage-node/watch-market";
import { useDataMode } from "../hooks";
import { mockItemsInMarket } from "../service/mock-data/mock-items";

interface ItemMarketContext {
  items: ItemInMarket[];
  fetched: boolean;
}
const initialState: ItemMarketContext = {
  items: [],
  fetched: false,
};

const initialMockState: ItemMarketContext = {
  items: mockItemsInMarket,
  fetched: true,
};

const Context = createContext<ItemMarketContext | undefined>(undefined);

type ProviderProps = Omit<React.ProviderProps<ItemMarketContext>, "value">;

export const ItemMarketContextProvider = (props: ProviderProps): React.ReactElement => {
  const { isMockData } = useDataMode();
  const [marketState, marketDispatch] = useState(isMockData ? initialMockState : initialState);
  const agoric = useAgoricState();
  const [watchingStore, setWatchingStore] = useState(false);

  useEffect(() => {
    const parseItemMarketUpdate = async (itemsInMarket: KreadItemInMarket[]) => {
      const items = await Promise.all(itemsInMarket.map((item) => formatMarketEntry(item)));
      marketDispatch((prevState: any) => ({ ...prevState, items, fetched: true }));
    };
    const formatMarketEntry = async (marketEntry: KreadItemInMarket): Promise<ItemInMarket> => {
      const item = marketEntry.object;

      const itemMarketEntry = {
        id: marketEntry.id.toString(),
        item,
        sell: {
          price: marketEntry.askingPrice.value,
          platformFee: marketEntry.platformFee.value,
          royalty: marketEntry.royalty.value,
        },
      };

      return itemMarketEntry;
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
