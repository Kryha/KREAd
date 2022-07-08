import { useMemo } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";

import { Item } from "../interfaces";
import { Items } from "./fake-item-data";
import { sortItems } from "../util";
import { MAX_PRICE, MIN_PRICE } from "../constants";
import { useItemContext } from "../context/items";

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

export const useMyItems = (): [Item[], boolean] => {
  const [{ owned, fetched }] = useItemContext();
  const myItems = owned;
  const isLoading = !fetched;
  return [Items, false];
};

export const useFilteredItems = (
  category: string,
  sorting: string,
  price: { min: number; max: number },
  color: string
): { data: Item[]; isLoading: boolean } => {
  // TODO: Refactor so we can reuse filteredItems with different source (myItemx vs shopItems)
  const [data, isLoading] = useMyItems();
  const changedRange = price.min !== MIN_PRICE || price.max !== MAX_PRICE;

  const isInCategory = (item: Item, category: string) => (category ? item.category === category : true);
  const hasColor = (item: Item, color: string) => (color ? item.colors.some((colorElement) => colorElement === color) : true);

  return useMemo(() => {
    if (!data) return { data: [], isLoading };
    if (!category && !sorting && !color && !changedRange) return { data, isLoading };

    const filteredItems = data.filter((item) => isInCategory(item, category) && hasColor(item, color));
    const filteredPrice = filteredItems.filter((item) => item.price > price.min && item.price < price.max);
    const sortedItems = sortItems(sorting, filteredPrice);

    return { data: sortedItems, isLoading };
  }, [category, color, data, isLoading, price, sorting, changedRange]);
};

export const useSellItem = () => {
  // TODO: invalidate queries
  return useMutation(async (body: { price: number }) => {
    if (!body.price) throw new Error("Id not specified");
    // TODO: intergrate
  });
};
