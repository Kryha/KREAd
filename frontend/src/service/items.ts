import { Item } from "../interfaces";
import { useQuery, UseQueryResult } from "react-query";

import { Items } from "./fake-item-data";
import { useMemo } from "react";
import { sortItems } from "../util";

export const useItems = (): UseQueryResult<Item[]> => {
  return useQuery(["items"], async () => {
    //  TODO: intergrate me

    return Items;
  });
};

export const useMyItems = (): UseQueryResult<Item[]> => {
  return useQuery(["items"], async () => {
    //  TODO: intergrate me

    return Items;
  });
};

export const useFilteredItems = (category: string, sorting: string, price: { min: number, max: number }, color: string): { data: Item[]; isLoading: boolean } => {
  const { data, isLoading } = useItems();
  const changedRange = price.min === 0 && price.max === 10000;

  return useMemo(() => {
    if (!data) return { data: [], isLoading };
    if (!category && !sorting && !color && changedRange) return { data, isLoading };

    const categoryItems = data.filter((item) => item.category === category);
    const colorItems = data.filter((item) => item.colors.some((colorElement) => colorElement === color));
    const sortingItems = sortItems(sorting, data);
    const priceItems = changedRange ? [] : data.filter((item) => (item.price > price.min && item.price < price.max));

    const combinedItemsOne = categoryItems.concat(colorItems.filter((item) => categoryItems.indexOf(item) < 0));
    const combinedItemsTwo = sortingItems.concat(priceItems.filter((item) => sortingItems.indexOf(item) < 0));
    const items = combinedItemsOne.concat(combinedItemsTwo.filter((item) => combinedItemsOne.indexOf(item) < 0));

    return { data: items, isLoading };
  }, [category, changedRange, color, data, isLoading, price.max, price.min, sorting]);
};
