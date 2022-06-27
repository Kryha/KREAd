// TODO: Remove this, use ations + context instead
import { Character, CharacterCreation } from "../interfaces";
import { useMutation, useQuery, UseQueryResult } from "react-query";

import { FakeCharcters } from "./fake-characters";
import { api } from "./config";
import { MAX_PRICE, MIN_PRICE } from "../constants";
import { useMemo } from "react";
import { sortCharacters } from "../util";

export const useCharacters = (): UseQueryResult<Character[]> => {
  return useQuery(["characters", "all"], async () => {
    //  TODO: intergrate me

    return FakeCharcters;
  });
};

export const useCharacter = (id: string): UseQueryResult<Character> => {
  return useQuery(["characters", id], async () => {
    //  TODO: intergrate me

    return FakeCharcters.find((c) => c.characterId === id);
  });
};

// TODO: provide id as param and as query key
export const useMyCharacter = (): UseQueryResult<Character> => {
  return useQuery(["character"], async () => {
    //  TODO: intergrate me

    return FakeCharcters[0];
  });
};

export const useMyCharacters = (): UseQueryResult<Character[]> => {
  return useQuery(["characters", "my"], async () => {
    //  TODO: intergrate me

    return FakeCharcters;
  });
};

// TODO: actually implement filtering
export const useMyFilteredCharacters = (category: string, sorting: string): { data: Character[]; isLoading: boolean } => {
  const { data, isLoading } = useMyCharacters();

  const isInCategory = (character: Character, category: string) => (category ? character.type === category : true);

  return useMemo(() => {
    if (!data) return { data: [], isLoading };
    if (!category && !sorting) return { data, isLoading };

    const filteredCharacters = data.filter((character) => isInCategory(character, category));
    const sortedCharacters = sortCharacters(sorting, filteredCharacters);
    return { data: sortedCharacters, isLoading };
  }, [category, data, isLoading, sorting]);
};

// TODO: invalidate queries + intergrate me
export const useCreateCharacter = () => {
  return useMutation(async (body: CharacterCreation) => {
    if (!body.name) throw new Error("Name not specified");
    const res = await api.post("/character", body);
    return res.data.character;
  });
};

export const useEquipCharacter = () => {
  return useMutation(async (body: { id: string }) => {
    if (!body.id) throw new Error("Id not specified");
    // TODO: intergrate
  });
};

export const useFilteredCharacters = (
  category: string,
  sorting: string,
  price: { min: number; max: number }
): { data: Character[]; isLoading: boolean } => {
  const { data, isLoading } = useCharacters();
  const changedRange = price.min !== MIN_PRICE || price.max !== MAX_PRICE;

  const isInCategory = (character: Character, category: string) => (category ? character.type === category : true);
  return useMemo(() => {
    if (!data) return { data: [], isLoading };
    if (!category && !sorting && !changedRange) return { data, isLoading };
    const filteredCharacters = data.filter((character) => isInCategory(character, category));
    const filteredPrice = filteredCharacters.filter((character) => character.price > price.min && character.price < price.max);
    const sortedCharacters = sortCharacters(sorting, filteredPrice);

    return { data: sortedCharacters, isLoading };
  }, [category, data, isLoading, price, sorting, changedRange]);
};
