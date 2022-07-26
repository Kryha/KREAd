// TODO: Remove this, use ations + context instead
import { useMutation } from "react-query";

import { Character, CharacterCreation, CharacterEquip, CharacterInMarket } from "../interfaces";
import { useCharacterContext } from "../context/characters";
import { useEffect, useMemo } from "react";
import { CharacterFilters, CharactersMarketFilters, filterCharacters, filterCharactersMarket, mediate } from "../util";
import { buyCharacter, mintNfts, sellCharacter } from "./character-actions";
import { useAgoricContext } from "../context/agoric";

export const useSelectedCharacter = (): [Character | undefined, boolean] => {
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

  const found = useMemo(() => owned.find((c) => c.id === id), [id, owned]);

  return [found, isLoading];
};

export const useMyCharacters = (): [CharacterEquip[], boolean] => {
  const [{ owned, selected, fetched }] = useCharacterContext();

  const charactersWithEquip: CharacterEquip[] = useMemo(() => {
    return owned.map((character) => {
      if (character.id === selected?.id) return { ...character, isEquipped: true };
      return { ...character, isEquipped: false };
    });
  }, [owned, selected?.id]);

  return [charactersWithEquip, !fetched];
};

export const useMyCharactersFiltered = (filters: CharacterFilters): [CharacterEquip[], boolean] => {
  const [characters, isLoading] = useMyCharacters();

  return useMemo(() => {
    if (!filters.category && !filters.sorting) return [characters, isLoading];

    return [filterCharacters(characters, filters), isLoading];
  }, [characters, filters, isLoading]);
};

export const useCharacterFromMarket = (id: string): [CharacterInMarket | undefined, boolean] => {
  const [characters, isLoading] = useCharactersMarket();

  const found = useMemo(() => characters.find((character) => character.id === id), [characters, id]);

  return [found, isLoading];
};

export const useCharactersMarket = (): [CharacterInMarket[], boolean] => {
  const [{ market, marketFetched }] = useCharacterContext();
  return [market, !marketFetched];
};

export const useCharactersMarketFiltered = (filters: CharactersMarketFilters): [CharacterInMarket[], boolean] => {
  const [characters, isLoading] = useCharactersMarket();

  return useMemo(() => {
    return [filterCharactersMarket(characters, filters), isLoading];
  }, [characters, filters, isLoading]);
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

export const useSellCharacter = () => {
  const [service] = useAgoricContext();
  const [characters] = useMyCharacters();

  return useMutation(async (body: { characterId: string; price: number }) => {
    const { characterId, price } = body;
    const found = characters.find((character) => character.id === characterId);
    if (!found) return;

    const { isEquipped: _, ...rest } = found;
    const backendCharacter = mediate.characters.toBack([rest])[0];

    await sellCharacter(service, backendCharacter, BigInt(price));
  });
};

export const useBuyCharacter = () => {
  const [service] = useAgoricContext();
  const [characters] = useCharactersMarket();

  return useMutation(async (body: { characterId: string }) => {
    const found = characters.find((character) => character.id === body.characterId);
    if (!found) return;

    const mediated = mediate.charactersMarket.toBack([found])[0];
    await buyCharacter(service, mediated);
  });
};
