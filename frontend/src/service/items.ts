import { Item } from "../interfaces";
import { useQuery, UseQueryResult } from "react-query";

import { Items } from "./fake-item-data";


export const useItems = (): UseQueryResult<Item[]> => {
  return useQuery(["character"], async () => {
    //  TODO: intergrate me

    return Items[0];
  });
};
