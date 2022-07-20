// TODO: Remove this, use ations + context instead
import { Character, CharacterCreation } from "../interfaces";
import { useMutation, useQuery, UseQueryResult } from "react-query";

import { FakeCharcters } from "./fake-characters";
import { useCharacterContext } from "../context/characters";
import { MAX_PRICE, MIN_PRICE } from "../constants";
import { useMemo } from "react";
import { sortCharacters } from "../util";
import { mintNfts } from "./character-actions";
import { useAgoricContext } from "../context/agoric";
import { CharacterDispatch } from "../interfaces/character-actions.interfaces";

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

// TODO: provide id as param and as query key
export const useMyCharacter = (): [{ selected: Character[]; isLoading: boolean }, CharacterDispatch] => {
  const [{ selected, fetched }, characterDispatch] = useCharacterContext();
  return [{ selected, isLoading: !fetched }, characterDispatch];
};

export const useMyCharacters = (): [{ owned: Character[]; isLoading: boolean }, CharacterDispatch] => {
  const [{ owned, fetched }, characterDispatch] = useCharacterContext();
  return [{ owned, isLoading: !fetched }, characterDispatch];
};

// TODO: actually implement filtering
export const useMyFilteredCharacters = (category: string, sorting: string): [Character[], boolean] => {
  const [{ owned, isLoading }] = useMyCharacters();

  const isInCategory = (character: Character, category: string) => (category ? character.type === category : true);

  return useMemo(() => {
    if (!owned) return [[], isLoading];
    if (!category && !sorting) return [owned, isLoading];

    const filteredCharacters = owned.filter((character) => isInCategory(character, category));
    const sortedCharacters = sortCharacters(sorting, filteredCharacters);
    return [sortedCharacters, isLoading];
  }, [category, owned, isLoading, sorting]);
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

export const useFilteredCharacters = (category: string, sorting: string, price: { min: number; max: number }): [Character[], boolean] => {
  const { data, isLoading } = useCharacters();
  const changedRange = price.min !== MIN_PRICE || price.max !== MAX_PRICE;

  const isInCategory = (character: Character, category: string) => (category ? character.type === category : true);
  return useMemo(() => {
    if (!data) return [[], isLoading];
    if (!category && !sorting && !changedRange) return [data, isLoading];
    const filteredCharacters = data.filter((character) => isInCategory(character, category));
    const filteredPrice = filteredCharacters.filter((character) => character.price > price.min && character.price < price.max);
    const sortedCharacters = sortCharacters(sorting, filteredPrice);

    return [sortedCharacters, isLoading];
  }, [category, data, isLoading, price, sorting, changedRange]);
};
