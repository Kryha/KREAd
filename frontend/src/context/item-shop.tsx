import React, { createContext, useContext, useState, useEffect } from "react";
import { ItemInMarket, KreadItemInMarket } from "../interfaces";
import { useAgoricState } from "./agoric";
import { mediate } from "../util";
import { watchItemMarket } from "../service/storage-node/watch-market";
import { useDataMode } from "../hooks";
import { mockItemsInMarket } from "../service/mock-data/mockItems";

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
  fetched: false,
};

const Context = createContext<ItemMarketContext | undefined>(undefined);

type ProviderProps = Omit<React.ProviderProps<ItemMarketContext>, "value">;

export const ItemMarketContextProvider = (props: ProviderProps): React.ReactElement => {
  const { isMockData } = useDataMode();
  const [marketState, marketDispatch] = useState(isMockData ? initialMockState : initialState);
  const agoric = useAgoricState();
  const kreadPublicFacet = agoric.contracts.kread.publicFacet;

  useEffect(() => {
    const parseItemMarketUpdate = async (itemsInMarket: KreadItemInMarket[]) => {
      const items = await Promise.all(itemsInMarket.map((item) => formatMarketEntry(item)));
      marketDispatch((prevState: any) => ({ ...prevState, items, fetched: true }));
    };
    const formatMarketEntry = async (marketEntry: KreadItemInMarket): Promise<ItemInMarket> => {
      const item = {
        id: Number(marketEntry.id),
        item: marketEntry.item,
        sell: {
          price: marketEntry.askingPrice.value,
        },
      };

      const parsedItem = mediate.itemsMarket.toFront([item]);

      return parsedItem[0];
    };

    if (agoric.chainStorageWatcher) {
      watchItemMarket(agoric.chainStorageWatcher, parseItemMarketUpdate);
      console.info("✅ LISTENING TO ITEM SHOP NOTIFIER");
    }
  }, [agoric]);

  return <Context.Provider value={marketState}>{props.children}</Context.Provider>;
};

export const useItemMarketState = (): ItemMarketContext => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("ItemMarketState can only be called inside ItemMarketStateProvider.");
  }
  return state;
};
