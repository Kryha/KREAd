import { Character, CharacterCreation } from "../interfaces";
import { useMutation, useQuery, UseQueryResult } from "react-query";

import { FakeCharcters } from "./fake-characters";
import { api } from "./config";

export const useCharacters = (): UseQueryResult<Character[]> => {
  return useQuery(["characters"], async () => {
    //  TODO: intergrate me

    return FakeCharcters;
  });
};

export const useMyCharacter = (): UseQueryResult<Character> => {
  return useQuery(["character"], async () => {
    //  TODO: intergrate me

    return FakeCharcters[0];
  });
};

export const useMyCharacters = (): UseQueryResult<Character[]> => {
  return useQuery(["characters"], async () => {
    //  TODO: intergrate me

    return FakeCharcters;
  });
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
