import { E } from "@endo/eventual-send";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ItemInMarket, KreadItemInMarket } from "../interfaces";
import { makeAsyncIterableFromNotifier as iterateNotifier } from "@agoric/notifier";
import { useAgoricState } from "./agoric";
import { mediate } from "../util";

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
  const kreadPublicFacet = agoric.contracts.characterBuilder.publicFacet; 
  
  useEffect(() => {
    const formatMarketEntry = async(marketEntry: KreadItemInMarket): Promise<ItemInMarket> => {
      const item = {
        id: BigInt(marketEntry.id),
        item: marketEntry.item,
        sell: {
          price: marketEntry.askingPrice.value
        }
      };
      
      const parsedItem =  mediate.itemsMarket.toFront([item]);
      
      return parsedItem[0];
    };
    const watchNotifiers = async () => {
      console.count("🛍 UPDATING ITEM SHOP 🛍");
      const notifier = E(kreadPublicFacet).getItemShopNotifier();
      for await (const itemsInMarket of iterateNotifier(
        notifier,
      )) {
        const items = await Promise.all(itemsInMarket.map((item: any) => formatMarketEntry(item)));
        marketDispatch((prevState) => ({...prevState, items, fetched: true }));
      }
    };
    if (kreadPublicFacet) {
      watchNotifiers().catch((err) => {
        console.error("got watchNotifiers err", err);
      });
      marketDispatch((prevState) => ({ ...prevState, fetched: true }));
      console.info("✅ LISTENING TO ITEM SHOP NOTIFIER");
    }
    return () => {
      marketDispatch(initialState);
    };
  }, [kreadPublicFacet]);
  
  return (
    <Context.Provider value={marketState}>
      {props.children}
    </Context.Provider>
  );
};

export const useItemMarketState = (): ItemMarketContext => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("ItemMarketState can only be called inside ItemMarketStateProvider.");
  }
  return state;
};