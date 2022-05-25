import { useMemo } from "react";
import { useQuery, UseQueryResult } from "react-query";

import { Item } from "../interfaces";
import { Items } from "./fake-item-data";
import { sortItems } from "../util";
import { MAX_PRICE, MIN_PRICE } from "../constants";

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

export const useFilteredItems = (category: string, sorting: string, price: { min: number, max: number }, color: string): { data: Item[]; isLoading: boolean } => {
  const { data, isLoading } = useItems();
  const changedRange = price.min === MIN_PRICE && price.max === MAX_PRICE;

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
