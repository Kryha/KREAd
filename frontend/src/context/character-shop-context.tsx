import React, { createContext, useContext, useEffect, useState } from "react";
import { CharacterInMarket, KreadCharacterInMarket, MarketMetrics } from "../interfaces";
import { useAgoricState } from "./agoric";
import { extendCharacters } from "../service/transform-character";
import { itemArrayToObject } from "../util";
import { parseCharacterMarket, watchCharacterMarketMetrics, watchCharacterMarketPaths } from "../service/storage-node/watch-market";
import { cidToUrl } from "../util/other";

interface CharacterMarketContext {
  characters: CharacterInMarket[];
  characterPaths: string[];
  fetched: boolean;
  metrics: MarketMetrics;
}
const initialState: CharacterMarketContext = {
  characters: [],
  characterPaths: [],
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

const Context = createContext<CharacterMarketContext | undefined>(undefined);

type ProviderProps = Omit<React.ProviderProps<CharacterMarketContext>, "value">;

export const CharacterMarketContextProvider = (props: ProviderProps): React.ReactElement => {
  const [marketState, marketDispatch] = useState(initialState);
  const { chainStorageWatcher } = useAgoricState();

  useEffect(() => {
    const addMarketCharacterPaths = async (paths: string[]) => {
      const merged = marketState.characterPaths.concat(paths);
      const unique = Array.from(new Set(merged));
      marketDispatch((prevState: CharacterMarketContext) => ({ ...prevState, itemMarketPaths: unique }));
      await parseCharacterMarket(chainStorageWatcher, unique, parseCharacterMarketUpdate);
    };
    const parseCharacterMarketUpdate = async (charactersInMarket: KreadCharacterInMarket[]) => {
      const characters = await Promise.all(charactersInMarket.map((character) => formatMarketEntry(character)));
      if (characters.length) marketDispatch((prevState: CharacterMarketContext) => ({ ...prevState, characters, fetched: true }));
    };
    const parseCharacterMarketMetricsUpdate = async (metrics: MarketMetrics) => {
      marketDispatch((prevState: CharacterMarketContext) => ({
        ...prevState,
        metrics,
      }));
    };
    // TO-DO: consider including inventory directly in sell record
    const formatMarketEntry = async (marketEntry: KreadCharacterInMarket): Promise<CharacterInMarket> => {
      const extendedCharacter = await extendCharacters([marketEntry.asset], chainStorageWatcher);
      const equippedItems = itemArrayToObject(extendedCharacter.equippedItems);
      const character = extendedCharacter.extendedCharacters[0].nft;

      return {
        id: character.id.toString(),
        character: { ...marketEntry.asset, id: marketEntry.asset.id, image: cidToUrl(marketEntry.asset.image) },
        equippedItems,
        sell: {
          price: marketEntry.askingPrice.value,
          platformFee: marketEntry.platformFee.value,
          royalty: marketEntry.royalty.value,
        },
      };
    };
    if (chainStorageWatcher) {
      watchCharacterMarketPaths(chainStorageWatcher, addMarketCharacterPaths);
      watchCharacterMarketMetrics(chainStorageWatcher, parseCharacterMarketMetricsUpdate);
      console.info("✅ LISTENING TO CHARACTER SHOP NOTIFIER");
    }
  }, [chainStorageWatcher]);

  return <Context.Provider value={marketState}>{props.children}</Context.Provider>;
};

export const useCharacterMarketState = (): CharacterMarketContext => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("CharacterMarketState can only be called inside CharacterMarketStateProvider.");
  }
  return state;
};
