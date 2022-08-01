import { useMemo } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";

import { Item, ItemEquip } from "../interfaces";
import { Items } from "./fake-item-data";
import { filterItems, ItemFilters } from "../util";
import { useItemContext } from "../context/items";
import { useAgoricContext } from "../context/agoric";
import { equipItem, unequipItem } from "./item-actions";
import { useSelectedCharacter } from "./character";

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

export const useMyItem = (id: string): [ItemEquip | undefined, boolean] => {
  const [{ all }, isLoading] = useMyItems();

  const found = useMemo(() => all.find((item) => item.id === id), [all, id]);

  return [found, isLoading];
};

export const useMyItems = (): [{ owned: Item[]; equipped: Item[]; all: ItemEquip[] }, boolean] => {
  const [{ owned, equipped, fetched }] = useItemContext();

  const all = useMemo(
    () => [...equipped.map((item) => ({ ...item, isEquipped: true })), ...owned.map((item) => ({ ...item, isEquipped: false }))],
    [equipped, owned]
  );

  return [{ owned, equipped, all }, !fetched];
};

export const useMyFilteredItems = (filters: ItemFilters): [ItemEquip[], boolean] => {
  const [{ all: allItems }, isLoading] = useMyItems();

  return useMemo(() => [filterItems(allItems, filters), isLoading], [allItems, filters, isLoading]);
};

// TODO: implement
export const useMarketFilteredItems = (filters: ItemFilters): [ItemEquip[], boolean] => {
  return [[], true];
};

export const useSellItem = () => {
  // TODO: invalidate queries
  return useMutation(async (body: { price: number }) => {
    if (!body.price) throw new Error("Id not specified");
    // TODO: intergrate
  });
};

export const useEquipItem = () => {
  const [service] = useAgoricContext();
  const [{ owned }] = useMyItems();
  const [character] = useSelectedCharacter();

  return useMutation(async (body: { itemId: string }) => {
    if (!character) return;

    const item = owned.find((item) => item.id === body.itemId);

    if (!item) return;

    // TODO: check if unequip gets performed before
    await equipItem(service, item, character.nft);
  });
};

export const useUnequipItem = () => {
  const [service] = useAgoricContext();
  const [{ equipped }] = useMyItems();
  const [character] = useSelectedCharacter();

  // TODO: check why tx offer gets rejected
  return useMutation(async (body: { itemId: string }) => {
    if (!character) return;

    const item = equipped.find((item) => item.id === body.itemId);

    if (!item) return;

    await unequipItem(service, item, character.nft.name);
  });
};
