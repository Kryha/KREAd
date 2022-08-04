// TODO: Remove this, use ations + context instead
import { useMutation } from "react-query";

import { CharacterCreation, CharacterEquip, CharacterInMarket, CharacterInMarketBackend, ExtendedCharacter } from "../interfaces";
import { useCharacterContext } from "../context/characters";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CharacterFilters, CharactersMarketFilters, filterCharacters, filterCharactersMarket, mediate } from "../util";
import { buyCharacter, mintNfts, sellCharacter } from "./character-actions";
import { useAgoricContext } from "../context/agoric";
import { E } from "@endo/eventual-send";

export const useSelectedCharacter = (): [ExtendedCharacter | undefined, boolean] => {
  const [{ owned, selected, fetched }, dispatch] = useCharacterContext();

  useEffect(() => {
    if (!selected) {
      owned[0] && dispatch({ type: "SET_SELECTED_CHARACTER", payload: owned[0] });
    }
  }, [dispatch, owned, selected]);

  return [selected, !fetched];
};

export const useMyCharacter = (id?: string): [CharacterEquip | undefined, boolean] => {
  const [owned, isLoading] = useMyCharacters();

  const found = useMemo(() => owned.find((c) => c.nft.id === id), [id, owned]);

  return [found, isLoading];
};

export const useMyCharacters = (filters?: CharacterFilters): [CharacterEquip[], boolean] => {
  const [{ owned, selected, fetched }] = useCharacterContext();

  const charactersWithEquip: CharacterEquip[] = useMemo(() => {
    return owned.map((character) => {
      if (character.nft.id === selected?.nft.id) return { ...character, isEquipped: true };
      return { ...character, isEquipped: false };
    });
  }, [owned, selected?.nft.id]);

  const filtered = useMemo(() => {
    if (!filters) return charactersWithEquip;
    return filterCharacters(charactersWithEquip, filters);
  }, [charactersWithEquip, filters]);

  return [filtered, !fetched];
};

export const useMyCharactersPage = (page: number, filters?: CharacterFilters): [CharacterEquip[], boolean, number] => {
  const [{ owned, selected, fetched }] = useCharacterContext();

  // TODO: get total pages
  const totalPages = 20;

  const charactersWithEquip: CharacterEquip[] = useMemo(() => {
    return owned.map((character) => {
      if (character.nft.id === selected?.nft.id) return { ...character, isEquipped: true };
      return { ...character, isEquipped: false };
    });
  }, [owned, selected?.nft.id]);

  const filtered = useMemo(() => {
    if (!filters) return charactersWithEquip;
    return filterCharacters(charactersWithEquip, filters);
  }, [charactersWithEquip, filters]);

  return [filtered, !fetched, totalPages];
};

export const useCharacterFromMarket = (id: string): [CharacterInMarket | undefined, boolean] => {
  const [characters, isLoading] = useCharactersMarket();

  const found = useMemo(() => characters.find((character) => character.id === id), [characters, id]);

  return [found, isLoading];
};

export const useCharactersMarket = (filters?: CharactersMarketFilters): [CharacterInMarket[], boolean] => {
  const [{ market, marketFetched }] = useCharacterContext();

  const filtered = useMemo(() => {
    if (!filters) return market;
    return filterCharactersMarket(market, filters);
  }, [filters, market]);

  return [filtered, !marketFetched];
};

export const useCharactersMarketPages = (page: number, filters?: CharactersMarketFilters): [CharacterInMarket[], boolean, number] => {
  const [{ market, marketFetched }] = useCharacterContext();
  // TODO: get total pages
  const totalPages = 20;

  const filtered = useMemo(() => {
    if (!filters) return market;
    return filterCharactersMarket(market, filters);
  }, [filters, market]);

  return [filtered, !marketFetched, totalPages];
};

// TODO: Add error management
export const useCreateCharacter = () => {
  const [agoricState] = useAgoricContext();
  return useMutation(async (body: CharacterCreation) => {
    if (!body.name) throw new Error("Name not specified");
    await mintNfts(agoricState, body.name);
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
  const [characters] = useMyCharacters();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [characterInMarket, setCharacterInMarket] = useState<CharacterInMarketBackend>();

  useEffect(() => {
    const addToMarket = async () => {
      try {
        if (!characterInMarket || !service.offers.length) return;

        const latestOffer = service.offers[service.offers.length - 1];
        if (latestOffer.invitationDetails.description !== "seller") return;
        if (!latestOffer.status || latestOffer.status !== "pending") return;

        const characterFromProposal = latestOffer.proposalTemplate.give.Items.value[0];
        if (!characterFromProposal || String(characterFromProposal.id) !== characterId) return;

        await E(service.contracts.characterBuilder.publicFacet).storeCharacterInMarket(characterInMarket);
        setIsSuccess(true);
      } catch (error) {
        console.warn(error);
        setIsError(true);
      }
      setIsLoading(false);
    };
    addToMarket();
  }, [characterId, characterInMarket, service.contracts.characterBuilder.publicFacet, service.offers]);

  const callback = useCallback(
    async (price: number) => {
      const found = characters.find((character) => character.nft.id === characterId);
      if (!found) return;

      const backendCharacter = mediate.characters.toBack([found])[0];

      setIsLoading(true);

      const toStore = await sellCharacter(service, backendCharacter.nft, BigInt(price));
      setCharacterInMarket(toStore);
    },
    [characterId, characters, service]
  );

  return { callback, isLoading, isError, isSuccess };
};

// TODO: test after merge with equip/unequip fix
export const useBuyCharacter = (characterId: string) => {
  const [service] = useAgoricContext();
  const [characters] = useCharactersMarket();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const removeFromMarket = async () => {
      try {
        if (!service.offers.length) return;

        const latestOffer = service.offers[service.offers.length - 1];
        if (latestOffer.invitationDetails.description !== "buyer") return;
        if (!latestOffer.status || latestOffer.status !== "accept") return;

        const characterFromProposal = latestOffer.proposalTemplate.want.Items.value[0];
        if (!characterFromProposal || String(characterFromProposal.id) !== characterId) return;

        await E(service.contracts.characterBuilder.publicFacet).removeCharacterFromMarket(BigInt(characterId));
        setIsSuccess(true);
      } catch (error) {
        console.warn(error);
        setIsError(true);
      }
      setIsLoading(false);
    };
    removeFromMarket();
  }, [characterId, service.contracts.characterBuilder.publicFacet, service.offers]);

  const callback = useCallback(async () => {
    const found = characters.find((character) => character.id === characterId);
    if (!found) return;

    const mediated = mediate.charactersMarket.toBack([found])[0];
    setIsLoading(true);
    await buyCharacter(service, mediated);
  }, [characterId, characters, service]);

  return { callback, isLoading, isError, isSuccess };
};
