import React, { createContext, useContext, useEffect, useState } from "react";
import { Item, ItemInMarket, MarketMetrics } from "../interfaces";
import { useAgoricState } from "./agoric";
import { parseItemMarket, watchItemMarketMetrics, watchItemMarketPaths } from "../service/storage-node/watch-market";
import { cidToUrl } from "../util/other";

interface ItemMarketContext {
  items: ItemInMarket[];
  itemMarketPaths: string[];
  fetched: boolean;
  metrics: MarketMetrics;
}
const initialState: ItemMarketContext = {
  items: [],
  itemMarketPaths: [],
  fetched: false,
  metrics: {
    amountSold: 0,
    collectionSize: 0,
    averageLevel: 0,
    marketplaceAverageLevel: 0,
    putForSaleCount: 0,
    latestSalePrice: BigInt(0),
  },
};

const Context = createContext<ItemMarketContext | undefined>(undefined);

type ProviderProps = Omit<React.ProviderProps<ItemMarketContext>, "value">;

export const ItemMarketContextProvider = (props: ProviderProps): React.ReactElement => {
  const [marketState, marketDispatch] = useState(initialState);
  const agoric = useAgoricState();
  const [watchingStore, setWatchingStore] = useState(false);

  type ContractMarketEntry = {
    id: number;
    asset: Item;
    askingPrice: { value: bigint };
    platformFee: { value: bigint };
    royalty: { value: bigint };
  };
  useEffect(() => {
    const addMarketItemPaths = async (paths: string[]) => {
      const merged = marketState.itemMarketPaths.concat(paths);
      const unique = Array.from(new Set(merged));
      marketDispatch((prevState: ItemMarketContext) => ({ ...prevState, itemMarketPaths: unique }));
      await parseItemMarket(agoric.chainStorageWatcher, unique, parseItemMarketUpdate);
    };
    const parseItemMarketUpdate = async (itemsInMarket: ContractMarketEntry[]) => {
      const items = await Promise.all(itemsInMarket.map((item) => formatMarketEntry(item)));
      marketDispatch((prevState: ItemMarketContext) => ({ ...prevState, items, fetched: true }));
    };
    const parseItemMarketMetricsUpdate = async (metrics: MarketMetrics) => {
      marketDispatch((prevState: ItemMarketContext) => ({
        ...prevState,
        metrics,
      }));
    };
    const formatMarketEntry = async (marketEntry: ContractMarketEntry): Promise<ItemInMarket> => {
      const item = marketEntry.asset;
      return {
        id: marketEntry.id.toString(),
        item: { ...item, image: cidToUrl(item.image), thumbnail: cidToUrl(item.thumbnail) },
        sell: {
          price: marketEntry.askingPrice.value,
          platformFee: marketEntry.platformFee.value,
          royalty: marketEntry.royalty.value,
        },
      };
    };

    if (agoric.chainStorageWatcher && !watchingStore) {
      watchItemMarketPaths(agoric.chainStorageWatcher, addMarketItemPaths);
      watchItemMarketMetrics(agoric.chainStorageWatcher, parseItemMarketMetricsUpdate);
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
