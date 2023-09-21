import { useMutation } from "react-query";

import { CharacterCreation, CharacterInMarket, ExtendedCharacter, ExtendedCharacterBackend } from "../interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { extendCharacters } from "./transform-character";
import { useAgoricContext, useAgoricState } from "../context/agoric";
import { CharacterFilters, filterCharactersMarket, useFilterCharacters } from "../util";

import { useUserState, useUserStateDispatch } from "../context/user";
import { useWalletState } from "../context/wallet";
import { mintCharacter } from "./character/mint";
import { marketService } from "./character/market";
import { useCharacterMarketState } from "../context/character-shop-context";

export const useSelectedCharacter = (): [ExtendedCharacter | undefined, boolean] => {
  const { characters, selected, fetched } = useUserState();

  const userStateDispatch = useUserStateDispatch();

  useEffect(() => {
    const storedName = localStorage.getItem("selectedCharacter");
    if (storedName) {
      const selectedCharacter = characters.find((char) => char.nft.name === storedName);
      if (selectedCharacter) {
        userStateDispatch({ type: "SET_SELECTED", payload: selectedCharacter });
      }
    } else if (!selected && characters.length > 0) {
      // If selected character is not found in localStorage and characters array is not empty, set the first character as selected
      userStateDispatch({ type: "SET_SELECTED", payload: characters[0] });
    }
  }, [userStateDispatch, characters, selected]);

  // Save the selected character's name to localStorage whenever it changes
  useEffect(() => {
    if (selected && selected.nft.name) {
      localStorage.setItem("selectedCharacter", selected.nft.name);
    }
  }, [selected]);

  return [selected, !fetched];
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

export const useMyCharacter = (id?: string): [ExtendedCharacter | undefined, boolean] => {
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

export const useCharactersMarket = (filters?: CharacterFilters): [CharacterInMarket[], boolean] => {
  const { characters, fetched } = useCharacterMarketState();
  const filtered = useMemo(() => {
    if (!filters) return characters;
    return filterCharactersMarket(characters, filters);
  }, [filters, characters]);

  const isLoading = !fetched;
  return [filtered, isLoading];
};

// TODO: consider whether fetching by range is necessary after implementing notifiers
export const useCharactersMarketPages = (page: number, filters?: CharacterFilters): [CharacterInMarket[], boolean, number] => {
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
  const istBrand = service.tokenInfo.ist.brand;
  return useMutation(async (body: CharacterCreation) => {
    if (!body.name) throw new Error("Name not specified");
    await mintCharacter({
      name: body.name,
      service: {
        kreadInstance: instance,
        istBrand: istBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => {
        console.info("MintCharacter call settled");
      },
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
      const characterToSell = { ...found.nft, id: Number(found.nft.id) };

      setIsLoading(true);
      const res = await marketService.sellCharacter({
        character: characterToSell,
        price: BigInt(price),
        service: {
          kreadInstance: instance,
          characterBrand: charBrand,
          makeOffer: service.walletConnection.makeOffer,
          istBrand: service.tokenInfo.ist.brand,
        },
        callback: async () => {
          console.info("SellCharacter call settled");
          setIsLoading(false);
          successCallback();
          userDispatch({ type: "SET_SELECTED", payload: undefined });
        },
      });

      return res;
    },
    [characterId, characters, wallet, service, userDispatch],
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
      character: found.character,
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
      callback: async () => {
        console.info("BuyCharacter call settled");
        setIsLoading(false);
      },
    });
  }, [characterId, characters, wallet, service]);

  return { callback, isLoading };
};

export const useGetCharacterInShopById = (id: string): [CharacterInMarket | undefined, boolean] => {
  const [characters, isLoading] = useGetCharactersInShop();

  const found = useMemo(() => characters.find((character) => character.id === id), [id, characters]);

  return [found, isLoading];
};

export const useGetCharactersInShop = (filters?: CharacterFilters): [CharacterInMarket[], boolean] => {
  const { characters, fetched } = useCharacterMarketState();
  if (!filters) return [characters, !fetched];
  const filtered = filterCharactersMarket(characters, filters);
  return [filtered, !fetched];
};
