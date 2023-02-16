import React, { createContext, useContext, useState, useEffect } from "react";
import { ItemInMarket, KreadItemInMarket } from "../interfaces";
import { useAgoricState } from "./agoric";
import { mediate } from "../util";
import { makeLeader, makeFollower, makeCastingSpec, iterateLatest } from "@agoric/casting";
import { LOCAL_DEVNET_RPC, STORAGE_NODE_SPEC_MARKET_ITEMS } from "../constants";

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
    const parseItemMarketUpdate = async (itemsInMarket: KreadItemInMarket[]) => {
      const items = await Promise.all(itemsInMarket.map((item) => formatMarketEntry(item)));
      console.log(items);
      marketDispatch((prevState) => ({ ...prevState, items, fetched: true }));
    };
    const formatMarketEntry = async(marketEntry: KreadItemInMarket): Promise<ItemInMarket> => {
      const item = {
        id: BigInt(marketEntry.id),
        item: marketEntry.item,
        sell: {
          price: marketEntry.askingPrice.value,
        },
      };

      const parsedItem = mediate.itemsMarket.toFront([item]);

      return parsedItem[0];
    };

    const watchNotifiers = async () => {
      console.count("🛍 UPDATING ITEM SHOP 🛍");

      const leader = makeLeader(LOCAL_DEVNET_RPC);
      const castingSpec = makeCastingSpec(STORAGE_NODE_SPEC_MARKET_ITEMS);
      const follower = makeFollower(castingSpec, leader);
      
      // Iterate over kread's storageNode follower on local-devnet
      for await (const { value } of iterateLatest(follower)) {
        parseItemMarketUpdate(value);
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

  return <Context.Provider value={marketState}>{props.children}</Context.Provider>;
};

export const useItemMarketState = (): ItemMarketContext => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("ItemMarketState can only be called inside ItemMarketStateProvider.");
  }
  return state;
};
