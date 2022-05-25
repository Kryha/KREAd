import { Item } from "../interfaces";
import { useQuery, UseQueryResult } from "react-query";

import { Items } from "./fake-item-data";

export const useItems = (): UseQueryResult<Item[]> => {
  return useQuery(["items", "all"], async () => {
    //  TODO: intergrate me

    return Items;
  });
};

export const useItem = (id: string): UseQueryResult<Item> => {
  return useQuery(["item", id], async () => {
    //  TODO: intergrate me
    const item = Items.find((item) => item.id === id);
    return item;
  });
};

export const useMyItems = (): UseQueryResult<Item[]> => {
  return useQuery(["items"], async () => {
    //  TODO: intergrate me

    return Items;
  });
};
