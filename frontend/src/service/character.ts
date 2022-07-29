// TODO: Remove this, use ations + context instead
import { useMutation, useQuery, UseQueryResult } from "react-query";

import { Character, CharacterCreation, CharacterEquip, ExtendedCharacter } from "../interfaces";
import { FakeCharcters } from "./fake-characters";
import { useCharacterContext } from "../context/characters";
import { MAX_PRICE, MIN_PRICE } from "../constants";
import { useEffect, useMemo } from "react";
import { CharacterFilters, filterCharacters, sortCharacters } from "../util";
import { mintNfts } from "./character-actions";
import { useAgoricContext } from "../context/agoric";

export const useCharacters = (): UseQueryResult<Character[]> => {
  return useQuery(["characters", "all"], async () => {
    //  TODO: intergrate me

    return FakeCharcters;
  });
};

export const useCharacter = (id: string): UseQueryResult<Character> => {
  return useQuery(["characters", id], async () => {
    //  TODO: intergrate me

    return FakeCharcters.find((c) => c.id === id);
  });
};

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

export const useMyCharacters = (): [CharacterEquip[], boolean] => {
  const [{ owned, selected, fetched }] = useCharacterContext();

  const charactersWithEquip: CharacterEquip[] = useMemo(() => {
    return owned.map((character) => {
      if (character.nft.id === selected?.nft.id) return { ...character, isEquipped: true };
      return { ...character, isEquipped: false };
    });
  }, [owned, selected?.nft.id]);

  return [charactersWithEquip, !fetched];
};

export const useMyFilteredCharacters = (filters: CharacterFilters): [CharacterEquip[], boolean] => {
  const [characters, isLoading] = useMyCharacters();

  return useMemo(() => {
    if (!filters.category && !filters.sorting) return [characters, isLoading];

    return [filterCharacters(characters, filters), isLoading];
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

// TODO: make this hook for market only and define filter in util
export const useFilteredCharacters = (category: string, sorting: string, price: { min: number; max: number }): [Character[], boolean] => {
  const { data, isLoading } = useCharacters();
  const changedRange = price.min !== MIN_PRICE || price.max !== MAX_PRICE;

  const isInCategory = (character: Character, category: string) => (category ? character.type === category : true);
  return useMemo(() => {
    if (!data) return [[], isLoading];
    if (!category && !sorting && !changedRange) return [data, isLoading];

    const characters = data.map((character) => ({ ...character, isEquipped: false }));

    const filteredCharacters = characters.filter((character) => isInCategory(character, category));
    // const filteredPrice = filteredCharacters.filter((character) => character.price > price.min && character.price < price.max);
    // const sortedCharacters = sortCharacters(sorting, filteredPrice);

    return [/*sortedCharacters*/filteredCharacters, isLoading];
  }, [category, data, isLoading,/* price, */sorting, changedRange]);
};
