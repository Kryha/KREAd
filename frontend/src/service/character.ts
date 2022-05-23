import { Character } from "../interfaces";
import { useQuery, UseQueryResult } from "react-query";

import { FakeCharcters } from "./fake-characters";

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
