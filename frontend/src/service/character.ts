import { Character, CharacterCreation } from "../interfaces";
import { useMutation, useQuery, UseQueryResult } from "react-query";

import { FakeCharcters } from "./fake-characters";
import { api } from "./config";

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
export const useMyFilteredCharacters = () => {
  return useMyCharacters();
};

// TODO: invalidate queries + intergrate me
export const useCreateCharacter = () => {
  return useMutation(async (body: CharacterCreation) => {
    if (!body.title) throw new Error("Title not specified");
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
