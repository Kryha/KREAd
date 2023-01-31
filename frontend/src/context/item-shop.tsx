import { E } from "@endo/eventual-send";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ItemInMarket, KreadItemInMarket } from "../interfaces";
import { useAgoricState } from "./agoric";
import { mediate } from "../util";
import { observeIteration } from "@agoric/notifier";

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
    const observer = harden({
      updateState: async (itemsInMarket: any) => {
        const items = await Promise.all(itemsInMarket.map((item: any) => formatMarketEntry(item)));
        marketDispatch((prevState) => ({ ...prevState, items, fetched: true }));
      },
      finish: (completion: unknown) => console.info("ITEM SHOP NOTIFIER FINISHED", completion),
      fail: (reason: unknown) => console.info("ITEM SHOP NOTIFIER ERROR", reason),
    });
    const formatMarketEntry = async (marketEntry: KreadItemInMarket): Promise<ItemInMarket> => {
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
      const shopNotifier = E(kreadPublicFacet).getItemShopNotifier();
      observeIteration(shopNotifier, observer);
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
