import React, { createContext, useContext, useState, useEffect } from "react";
import { ItemInMarket, KreadItemInMarket } from "../interfaces";
import { useAgoricState } from "./agoric";
import { mediate } from "../util";
import { makeLeader, makeFollower, makeCastingSpec, iterateLatest } from "@agoric/casting";
import { LOCAL_DEVNET_RPC, STORAGE_NODE_SPEC_MARKET } from "../constants";

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
    const parseItemMarketUpdate = async (itemsInMarket: any) => {
      console.log("NEW ITEMS", itemsInMarket);
      const items = await Promise.all(itemsInMarket.map((item: any) => formatMarketEntry(item)));
      marketDispatch((prevState) => ({...prevState, items, fetched: true }));
    };
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
      // Iterate over kread's storageNode follower on local-devnet
      console.log(LOCAL_DEVNET_RPC, STORAGE_NODE_SPEC_MARKET);
      const leader = makeLeader(LOCAL_DEVNET_RPC);
      const castingSpec = makeCastingSpec(STORAGE_NODE_SPEC_MARKET);
      const follower = makeFollower(castingSpec, leader);
      for await (const value of iterateLatest(follower)) {
        console.log(value);
        parseItemMarketUpdate(value.value.items);
      }
    };
    if (kreadPublicFacet) {
      watchNotifiers().catch((err) => {
        console.error("got watchNotifiers err", err);
      });
      marketDispatch((prevState) => ({ ...prevState, fetched: true }));
      console.info("✅ LISTENING TO ITEM SHOP NOTIFIER");
    }
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
