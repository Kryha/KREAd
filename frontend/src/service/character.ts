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
import { CharacterFilters, filterCharacters, filterCharactersMarket, mediate } from "../util";
import { buyCharacter, extendCharacters, mintNfts, sellCharacter } from "./character-actions";
import { useAgoricContext } from "../context/agoric";
import { useOffers } from "./offers";
import { CHARACTER_PURSE_NAME } from "../constants";
import { useCharacterMarketState } from "../context/character-shop";
import { useUserState, useUserStateDispatch } from "../context/user";
import { useWalletState } from "../context/wallet";

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
    },
  ] = useAgoricContext();
  const offers = useOffers({ description: "seller", status: "pending" });

  // stringified ExtendedCharacterBackend[], for some reason the state goes wild if I make it an array
  const [offerCharacters, setOfferCharacters] = useState<string>("[]"); // TODO: ideally use the commented line underneath
  // const [offerCharacters, setOfferCharacters] = useState<ExtendedCharacterBackend[]>([]);

  // filtering character offers
  const characterOffers = useMemo(
    () =>
      offers.filter((offer) => {
        try {
          return offer.proposalTemplate.give.Items.pursePetname[1] === CHARACTER_PURSE_NAME;
        } catch (error) {
          return false;
        }
      }),
    [offers]
  );

  // retrieving characters from offers
  const charactersFromOffers: CharacterBackend[] = useMemo(() => {
    try {
      const fromOffers: CharacterBackend[] = characterOffers.map((offer: any) => {
        return offer.proposalTemplate.give.Items.value[0];
      });
      return fromOffers;
    } catch (error) {
      return [];
    }
  }, [characterOffers]);

  // adding items to characters from offers
  useEffect(() => {
    const extend = async () => {
      const { extendedCharacters } = await extendCharacters(publicFacet, charactersFromOffers);
      setOfferCharacters(JSON.stringify(extendedCharacters));
    };
    extend();
  }, [charactersFromOffers, publicFacet]);

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
  const [agoricState] = useAgoricContext();
  const wallet = useWalletState();
  return useMutation(async (body: CharacterCreation) => {
    if (!body.name) throw new Error("Name not specified");
    await mintNfts(agoricState, wallet, body.name);
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
  const callback = useCallback(
    async (price: number) => {
      const found = characters.find((character) => character.nft.id === characterId);
      if (!found) return;

      const backendCharacter = mediate.characters.toBack([found])[0];

      setIsLoading(true);
      const res = await sellCharacter(service, wallet, backendCharacter.nft, BigInt(price));
      setIsLoading(false);
      userDispatch({ type: "SET_SELECTED", payload: undefined });
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

  useEffect(() => {
    setIsLoading(false);
  }, [characterId, service.contracts.kread.publicFacet, service.offers]);

  const callback = useCallback(async () => {
    const found = characters.find((character) => character.id === characterId);
    if (!found) return;

    const mediated = mediate.charactersMarket.toBack([found])[0];
    setIsLoading(true);
    await buyCharacter(service, wallet, mediated.character, mediated.sell.price);
    setIsLoading(false);
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

  const filtered = !filters ? characters : filterCharactersMarket(characters, filters);

  return [filtered, !fetched];
};
