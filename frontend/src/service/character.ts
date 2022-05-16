import { Character } from "../interfaces";
import { useQuery, UseQueryResult } from "react-query";

import { FakeCharcters } from "./fake-characters";


export const useMyCharacter = (): UseQueryResult<Character> => {
  return useQuery(["character"], async () => {
    //  TODO: intergrate me

    return FakeCharcters[0];
  });
};
