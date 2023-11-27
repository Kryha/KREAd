import { useMutation } from "react-query";

import { AddOfferCallback, CharacterInMarket, ExtendedCharacter, HandleOfferResultBuilder, MarketMetrics } from "../interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { extendCharacters } from "./transform-character";
import { useAgoricContext, useAgoricState } from "../context/agoric";
import { ISTTouIST, useFilterCharacters, useFilterCharactersMarket } from "../util";

import { useUserState, useUserStateDispatch } from "../context/user";
import { useWalletState } from "../context/wallet";
import { mintCharacter } from "./character/mint";
import { marketService } from "./character/market";
import { useCharacterMarketState } from "../context/character-shop-context";
import { MAX_PRICE, MIN_PRICE } from "../constants";

export const useSelectedCharacter = (): [ExtendedCharacter | undefined, boolean] => {
  const { characters, selected, fetched } = useUserState();
  const userStateDispatch = useUserStateDispatch();

  useEffect(() => {
    const storedName = localStorage.getItem("selectedCharacter");

    if (selected) {
      if (selected.nft.name !== storedName) {
        localStorage.setItem("selectedCharacter", selected.nft.name);
      }
      const selectedCharacter = characters.find((char) => char.nft.name === selected.nft.name);
      if (selectedCharacter) {
        userStateDispatch({
          type: "SET_SELECTED",
          payload: selectedCharacter.nft.name,
        });
      }
    } else if (characters.length > 0) {
      if (storedName) {
        const matchingCharacter = characters.find((char) => char.nft.name === storedName);
        if (matchingCharacter) {
          userStateDispatch({
            type: "SET_SELECTED",
            payload: matchingCharacter.nft.name,
          });
        } else {
          const firstCharacter = characters[0];
          localStorage.setItem("selectedCharacter", firstCharacter.nft.name);
          userStateDispatch({
            type: "SET_SELECTED",
            payload: firstCharacter.nft.name,
          });
        }
      } else {
        const firstCharacterName = characters[0].nft.name;
        localStorage.setItem("selectedCharacter", firstCharacterName);
        userStateDispatch({
          type: "SET_SELECTED",
          payload: characters[0].nft.name,
        });
      }
    }
  }, [userStateDispatch, characters, selected]);

  return [selected, !fetched];
};

export const useMyCharactersForSale = () => {
  const [{ chainStorageWatcher }] = useAgoricContext();
  const wallet = useWalletState();

  // stringified ExtendedCharacterBackend[], for some reason the state goes wild if I make it an array
  const [offerCharacters, setOfferCharacters] = useState<string>("[]");

  // adding items to characters from offers
  useEffect(() => {
    const extend = async () => {
      const myCharactersForSale = wallet.characterProposals.map((proposal: any) => proposal.give.Character.value.payload[0]);
      const { extendedCharacters } = await extendCharacters(myCharactersForSale, chainStorageWatcher);
      setOfferCharacters(JSON.stringify(extendedCharacters));
    };
    extend();
  }, [wallet.characterProposals]);

  return useMemo(() => JSON.parse(offerCharacters) as ExtendedCharacter[], [offerCharacters]);
};

export const useMyCharacter = (id?: number): [ExtendedCharacter | undefined, boolean] => {
  const [owned, isLoading] = useMyCharacters();

  const found = useMemo(() => owned.find((c) => c.nft.id === id), [id, owned]);

  return [found, isLoading];
};

export const useGetCharacterByName = (name: string | null): [ExtendedCharacter | undefined, boolean] => {
  const [owned, isLoading] = useMyCharacters();

  const found = useMemo(() => owned.find((c) => c.nft.name === name), [name, owned]);

  return [found, isLoading];
};

export const useGetCharacterNames = (): [string[]] => {
  const [owned] = useMyCharacters();
  const names = useMemo(() => owned.map((c) => c.nft.name), [owned]);
  return [names];
};

export const useGetCharacterMarketMetrics = (): MarketMetrics => {
  const { metrics } = useCharacterMarketState();
  return metrics;
};

export const useGetCharacterMarketPrices = (): [number[], boolean] => {
  const { characters, fetched } = useCharacterMarketState();

  const prices = useMemo(
    () =>
      fetched
        ? characters.map((character) => Number(character.sell.price + character.sell.royalty + character.sell.platformFee))
        : [MIN_PRICE, MAX_PRICE],
    [characters, fetched],
  );
  return [prices, fetched];
};

export const useMyCharacters = (): [ExtendedCharacter[], boolean] => {
  const { characters, fetched } = useUserState();
  const charactersForSale = useMyCharactersForSale();

  const allCharacters = [...characters, ...charactersForSale];
  const filtered = useFilterCharacters(allCharacters);

  const isLoading = !fetched;
  return [filtered, isLoading];
};

export const useCharacterFromMarket = (id: string): [CharacterInMarket | undefined, boolean] => {
  const [characters, isLoading] = useCharactersMarket();

  const found = useMemo(() => characters.find((character) => character.id === id), [characters, id]);

  return [found, isLoading];
};

export const useCharactersMarket = (): [CharacterInMarket[], boolean] => {
  const { characters, fetched } = useCharacterMarketState();
  const filtered = useFilterCharactersMarket(characters);

  const isLoading = !fetched;
  return [filtered, isLoading];
};

// TODO: Add error management
export const useCreateCharacter = () => {
  const service = useAgoricState();
  const instance = service.contracts.kread.instance;
  const istBrand = service.tokenInfo.ist.brand;
  return useMutation(async (body: { name: string; callback: HandleOfferResultBuilder }): Promise<void> => {
    if (!body.name) throw new Error("Name not specified");
    await mintCharacter({
      name: body.name,
      service: {
        kreadInstance: instance,
        istBrand: istBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: body.callback.getHandleOfferResult(),
    });
  });
};

// TODO: test after merge with equip/unequip fix
export const useSellCharacter = (characterId: number) => {
  const [service] = useAgoricContext();
  const wallet = useWalletState();
  const [characters] = useMyCharacters();
  const userDispatch = useUserStateDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const instance = service.contracts.kread.instance;
  const charBrand = service.tokenInfo.character.brand;

  const sendOffer = useCallback(
    async (price: number, callback: AddOfferCallback) => {
      const found = characters.find((character) => character.nft.id === characterId);
      if (!found) return;
      const characterToSell = { ...found.nft, id: Number(found.nft.id) };
      const uISTPrice = ISTTouIST(price);

      // if needed can add common functionality here like so
      const makeOfferCallback: AddOfferCallback = {
        ...callback,
        settled: () => {
          if (callback.settled) callback.settled();
          userDispatch({ type: "SET_SELECTED", payload: "" });
          console.log("HOOK LOGIC")
        },
        setIsLoading: setIsLoading
      }

      // const originalSuccessCallbackFunction = callback.successCallbackFunction;
      // callback.successCallbackFunction = () => {
      //   if (originalSuccessCallbackFunction) originalSuccessCallbackFunction();
      //   console.info("SellCharacter call settled");
      //   setIsLoading(false);
      //   userDispatch({ type: "SET_SELECTED", payload: "" });
      // };
      // const originalRefundCallbackFunction = callback.refundCallbackFunction;
      // callback.refundCallbackFunction = () => {
      //   if (originalRefundCallbackFunction) originalRefundCallbackFunction();
      //   console.info("SellCharacter call settled");
      //   setIsLoading(false);
      //   userDispatch({ type: "SET_SELECTED", payload: "" });
      // };

      await marketService.sellCharacter({
        character: characterToSell,
        price: BigInt(uISTPrice),
        service: {
          kreadInstance: instance,
          characterBrand: charBrand,
          makeOffer: service.walletConnection.makeOffer,
          istBrand: service.tokenInfo.ist.brand,
        },
        callback: makeOfferCallback
      });
    },
    [characterId, characters, wallet, service],
  );

  return { sendOffer, isLoading };
};

export const useBuyCharacter = (characterId: string) => {
  const [service] = useAgoricContext();
  const wallet = useWalletState();
  const [characters] = useCharactersMarket();
  const [isLoading, setIsLoading] = useState(false);
  const instance = service.contracts.kread.instance;
  const charBrand = service.tokenInfo.character.brand;
  const istBrand = service.tokenInfo.ist.brand;

  useEffect(() => {
    setIsLoading(false);
  }, [characterId, service.offers]);

  const callback = useCallback(
    async (callback: HandleOfferResultBuilder) => {
      const found = characters.find((character) => character.id === characterId);
      if (!found) return;
      const characterToBuy = {
        ...found,
        character: found.character,
      };
      const originalSuccessCallbackFunction = callback.successCallbackFunction;
      callback.successCallbackFunction = () => {
        if (originalSuccessCallbackFunction) originalSuccessCallbackFunction();
        console.info("BuyCharacter call settled");
        setIsLoading(false);
      };
      const originalRefundCallbackFunction = callback.refundCallbackFunction;
      callback.refundCallbackFunction = () => {
        if (originalRefundCallbackFunction) originalRefundCallbackFunction();
        console.info("BuyCharacter call settled");
        setIsLoading(false);
      };

      setIsLoading(true);
      await marketService.buyCharacter({
        character: characterToBuy.character,
        price: BigInt(characterToBuy.sell.price + characterToBuy.sell.platformFee + characterToBuy.sell.royalty),
        service: {
          kreadInstance: instance,
          characterBrand: charBrand,
          makeOffer: service.walletConnection.makeOffer,
          istBrand,
        },
        callback: callback.getHandleOfferResult()
      });
    },
    [characterId, characters, wallet, service],
  );

  return { callback, isLoading };
};

export const useGetCharacterInShopById = (id: string): [CharacterInMarket | undefined, boolean] => {
  const [characters, isLoading] = useGetCharactersInShop();

  const found = useMemo(() => characters.find((character) => character.id === id), [id, characters]);

  return [found, isLoading];
};

export const useGetCharactersInShop = (): [CharacterInMarket[], boolean] => {
  const { characters, fetched } = useCharacterMarketState();
  const filtered = useFilterCharactersMarket(characters);
  return [filtered, !fetched];
};
