import React, { createContext, useContext, useEffect, useState } from "react";
import { CharacterInMarket, KreadCharacterInMarket } from "../interfaces";
import { useAgoricState } from "./agoric";
import { extendCharacters } from "../service/transform-character";
import { itemArrayToObject } from "../util";
import { watchCharacterMarketPaths, parseCharacterMarket } from "../service/storage-node/watch-market";

interface CharacterMarketContext {
  characters: CharacterInMarket[];
  characterPaths: string[];
  fetched: boolean;
}
const initialState: CharacterMarketContext = {
  characters: [],
  characterPaths: [],
  fetched: false,
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
    // TO-DO: consider including inventory directly in sell record
    const formatMarketEntry = async (marketEntry: KreadCharacterInMarket): Promise<CharacterInMarket> => {
      const extendedCharacter = await extendCharacters([marketEntry.asset], chainStorageWatcher.marshaller);
      const equippedItems = itemArrayToObject(extendedCharacter.equippedItems);
      const character = extendedCharacter.extendedCharacters[0].nft;

      return {
        id: character.id.toString(),
        character: { ...marketEntry.asset, id: marketEntry.asset.id },
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
