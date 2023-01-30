import { E } from "@endo/eventual-send";
import React, { createContext, useContext, useState, useEffect } from "react";
import { CharacterInMarket, KreadCharacterInMarket } from "../interfaces";
import { observeIteration } from "@agoric/notifier";
import { useAgoricState } from "./agoric";
import { extendCharacters } from "../service/character-actions";
import { itemArrayToObject } from "../util";

interface CharacterMarketContext {
  characters: CharacterInMarket[];
  notifierUpdateCount: any;
  fetched: boolean;
}
const initialState: CharacterMarketContext = {
  characters: [],
  notifierUpdateCount: undefined,
  fetched: false,
};

const Context = createContext<CharacterMarketContext | undefined>(undefined);

type ProviderProps = Omit<React.ProviderProps<CharacterMarketContext>, "value">;

export const CharacterMarketContextProvider = (props: ProviderProps): React.ReactElement => {
  const [marketState, marketDispatch] = useState(initialState);
  const agoric = useAgoricState();
  const kreadPublicFacet = agoric.contracts.characterBuilder.publicFacet;

  useEffect(() => {
    const observer = harden({
      updateState: async (charactersInMarket: any) => {
        const characters = await Promise.all(charactersInMarket.map((character: any) => formatMarketEntry(character)));
        marketDispatch((prevState) => ({ ...prevState, characters, fetched: true }));
      },
      finish: (completion: unknown) => console.info("CHARACTER SHOP NOTIFIER FINISHED", completion),
      fail: (reason: unknown) => console.info("CHARACTER SHOP NOTIFIER ERROR", reason),
    });
    const formatMarketEntry = async (marketEntry: KreadCharacterInMarket): Promise<CharacterInMarket> => {
      const extendedCharacter = await extendCharacters(kreadPublicFacet, [marketEntry.character]);
      const equippedItems = itemArrayToObject(extendedCharacter.equippedItems);
      const character = extendedCharacter.extendedCharacters[0].nft;

      return {
        id: character.id.toString(),
        character: { ...character, id: character.id.toString() },
        equippedItems,
        sell: {
          price: marketEntry.askingPrice.value,
        },
      };
    };
    const watchNotifiers = async () => {
      console.count("🛍 UPDATING CHARACTER SHOP 🛍");
      const shopNotifier = E(kreadPublicFacet).getCharacterShopNotifier();
      observeIteration(shopNotifier, observer);
    };
    if (kreadPublicFacet) {
      watchNotifiers().catch((err) => {
        console.error("got watchNotifiers err", err);
      });
      marketDispatch((prevState) => ({ ...prevState, fetched: true }));
      console.info("✅ LISTENING TO CHARACTER SHOP NOTIFIER");
    }
  }, [kreadPublicFacet]);

  return <Context.Provider value={marketState}>{props.children}</Context.Provider>;
};

export const useCharacterMarketState = (): CharacterMarketContext => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("CharacterMarketState can only be called inside CharacterMarketStateProvider.");
  }
  return state;
};
