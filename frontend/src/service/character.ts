import { useMutation } from "react-query";

import {
  CharacterBackend,
  CharacterCreation,
  CharacterEquip,
  CharacterInMarket,
  ExtendedCharacter,
  ExtendedCharacterBackend,
} from "../interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CharacterFilters, CharactersMarketFilters, filterCharacters, filterCharactersMarket, mediate } from "../util";
import { buyCharacter, extendCharacters } from "./transform-character";
import { useAgoricContext, useAgoricState } from "../context/agoric";
import { useOffers } from "./offers";
import { CHARACTER_PURSE_NAME } from "../constants";
import { useCharacterMarketState } from "../context/character-shop";
import { useUserState, useUserStateDispatch } from "../context/user";
import { useWalletState } from "../context/wallet";
import { mintCharacter } from "./character/mint";
import { marketService } from "./character/market";

export const useSelectedCharacter = (): [ExtendedCharacter | undefined, boolean] => {
  const { characters, selected, fetched } = useUserState();
  const userStateDispatch = useUserStateDispatch();
  useEffect(() => {
    if (!selected) {
      characters[0] && userStateDispatch({ type: "SET_SELECTED", payload: characters[0] });
    }
  }, [userStateDispatch, characters, selected]);

  const isLoading = !fetched;
  return [selected, isLoading];
};

export const useMyCharactersForSale = () => {
  const [
    {
      contracts: {
        kread: { publicFacet },
      },
      chainStorageWatcher: { marshaller },
    },
  ] = useAgoricContext();
  const offers = useOffers({ description: "seller", status: "pending" });
  const wallet = useWalletState();

  // stringified ExtendedCharacterBackend[], for some reason the state goes wild if I make it an array
  const [offerCharacters, setOfferCharacters] = useState<string>("[]"); // TODO: ideally use the commented line underneath

  // adding items to characters from offers
  useEffect(() => {
    const extend = async () => {
      const myCharactersForSale = wallet.characterProposals.map((proposal: any) => proposal.give.Character.value.payload[0]);
      const { extendedCharacters } = await extendCharacters(myCharactersForSale, marshaller);
      setOfferCharacters(JSON.stringify(extendedCharacters));
    };
    extend();
  }, [wallet.characterProposals, publicFacet]);

  const parsedCharacters = useMemo(() => JSON.parse(offerCharacters) as ExtendedCharacterBackend[], [offerCharacters]);

  return parsedCharacters;
};

export const useMyCharacter = (id?: string): [CharacterEquip | undefined, boolean] => {
  const [owned, isLoading] = useMyCharacters();

  const found = useMemo(() => owned.find((c) => c.nft.id === id), [id, owned]);

  return [found, isLoading];
};

export const useMyCharacters = (filters?: CharacterFilters): [CharacterEquip[], boolean] => {
  const { characters, selected, fetched } = useUserState();
  const charactersForSale = useMyCharactersForSale();
  const charactersWithEquip: CharacterEquip[] = useMemo(() => {
    return characters.map((character) => {
      if (character.nft.id === selected?.nft.id) return { ...character, isEquipped: true, isForSale: false };
      return { ...character, isEquipped: false, isForSale: false };
    });
  }, [characters, selected?.nft.id]);

  // mixing characters from wallet with characters from shop
  const charactersWithForSale: CharacterEquip[] = useMemo(() => {
    try {
      const offerCharactersFrontend: CharacterEquip[] = mediate.characters
        .toFront(charactersForSale)
        .map((item) => ({ ...item, isEquipped: false, isForSale: true }));
      return [...charactersWithEquip, ...offerCharactersFrontend];
    } catch (error) {
      return charactersWithEquip;
    }
  }, [charactersForSale, charactersWithEquip]);

  // filtering all the characters
  const filtered = useMemo(() => {
    if (!filters) return charactersWithForSale;
    return filterCharacters(charactersWithForSale, filters);
  }, [charactersWithForSale, filters]);

  const isLoading = !fetched;
  return [filtered, isLoading];
};

export const useCharacterFromMarket = (id: string): [CharacterInMarket | undefined, boolean] => {
  const [characters, isLoading] = useCharactersMarket();

  const found = useMemo(() => characters.find((character) => character.id === id), [characters, id]);

  return [found, isLoading];
};

export const useCharactersMarket = (filters?: CharactersMarketFilters): [CharacterInMarket[], boolean] => {
  const { characters, fetched } = useCharacterMarketState();
  const filtered = useMemo(() => {
    if (!filters) return characters;
    return filterCharactersMarket(characters, filters);
  }, [filters, characters]);

  const isLoading = !fetched;
  return [filtered, isLoading];
};

// TODO: consider whether fetching by range is necessary after implementing notifiers
export const useCharactersMarketPages = (page: number, filters?: CharactersMarketFilters): [CharacterInMarket[], boolean, number] => {
  const { characters, fetched } = useCharacterMarketState();
  // TODO: get total pages
  const totalPages = 20;

  const filtered = useMemo(() => {
    if (!filters) return characters;
    return filterCharactersMarket(characters, filters);
  }, [filters, characters]);

  const isLoading = !fetched;
  return [filtered, isLoading, totalPages];
};

// TODO: Add error management
export const useCreateCharacter = () => {
  const service = useAgoricState();
  const instance = service.contracts.kread.instance;
  const charBrand = service.tokenInfo.character.brand;
  return useMutation(async (body: CharacterCreation) => {
    if (!body.name) throw new Error("Name not specified");
    await mintCharacter({
      name: body.name,
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => {
        console.info("MintCharacter call settled");
      }
    });
  });
};

export const useEquipCharacter = () => {
  return useMutation(async (body: { id: string }) => {
    if (!body.id) throw new Error("Id not specified");
    // TODO: intergrate
  });
};

// TODO: test after merge with equip/unequip fix
export const useSellCharacter = (characterId: string) => {
  const [service] = useAgoricContext();
  const wallet = useWalletState();
  const [characters] = useMyCharacters();
  const userDispatch = useUserStateDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const instance = service.contracts.kread.instance;
  const charBrand = service.tokenInfo.character.brand;

  const callback = useCallback(
    async (price: number, successCallback: () => void) => {
      const found = characters.find((character) => character.nft.id === characterId);
      if (!found) return;
      const characterToSell = {...found.nft, id: Number(found.nft.id)};

      setIsLoading(true);
      const res = await marketService.sellCharacter({
        character: characterToSell,
        price: BigInt(price),
        service: {
          kreadInstance: instance,
          characterBrand: charBrand,
          makeOffer: service.walletConnection.makeOffer,
          istBrand: service.tokenInfo.ist.brand
        },
        callback: async () => {
          console.info("SellCharacter call settled");
          setIsLoading(false);
          successCallback();
          userDispatch({ type: "SET_SELECTED", payload: undefined });
        }
      });
      
      return res;
    },
    [characterId, characters, wallet, service, userDispatch]
  );

  return { callback, isLoading };
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
  }, [characterId, service.contracts.kread.publicFacet, service.offers]);

  const callback = useCallback(async () => {
    const found = characters.find((character) => character.id === characterId);
    if (!found) return;
    const characterToBuy = { 
      ...found, 
      character: {
        ...found.character,
        id: Number(found.id) 
      }
    };

    setIsLoading(true);
    await marketService.buyCharacter({
      character: characterToBuy.character,
      price: characterToBuy.sell.price,
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        makeOffer: service.walletConnection.makeOffer,
        istBrand,
      },
      callback: async () => {
        console.info("BuyCharacter call settled");
        setIsLoading(false);
      }
    });
  }, [characterId, characters, wallet, service]);

  return { callback, isLoading };
};
