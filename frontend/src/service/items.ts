import { useMemo } from "react";
import { useMutation } from "react-query";

import { Item, ItemEquip, ItemInMarket } from "../interfaces";
import { filterItems, filterItemsMarket, ItemFilters, mediate } from "../util";
import { useItemContext } from "../context/items";
import { useAgoricContext } from "../context/agoric";
import { equipItem, unequipItem, sellItem, buyItem } from "./item-actions";
import { useSelectedCharacter } from "./character";

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

export const useMyItemsFiltered = (filters: ItemFilters): [ItemEquip[], boolean] => {
  const [{ all: allItems }, isLoading] = useMyItems();

  return useMemo(() => [filterItems(allItems, filters), isLoading], [allItems, filters, isLoading]);
};

export const useItemFromMarket = (id: string): [ItemInMarket | undefined, boolean] => {
  const [items, isLoading] = useItemsMarket();

  const found = useMemo(() => items.find((item) => item.id === id), [id, items]);

  return [found, isLoading];
};

export const useItemsMarket = (): [ItemInMarket[], boolean] => {
  const [{ market, marketFetched }] = useItemContext();

  return [market, !marketFetched];
};

export const useItemsMarketFiltered = (filters: ItemFilters): [ItemInMarket[], boolean] => {
  const [items, isLoading] = useItemsMarket();

  return useMemo(() => [filterItemsMarket(items, filters), isLoading], [filters, isLoading, items]);
};

export const useSellItem = () => {
  const [service] = useAgoricContext();
  const [{ owned }] = useMyItems();

  return useMutation(async (body: { itemId: string; price: number }) => {
    const { itemId, price } = body;
    const found = owned.find((item) => item.id === itemId);
    if (!found) return;

    const mediated = mediate.items.toBack([found])[0];
    await sellItem(service, mediated, BigInt(price));
  });
};

export const useBuyItem = () => {
  const [service] = useAgoricContext();
  const [items] = useItemsMarket();

  return useMutation(async (body: { itemId: string }) => {
    const found = items.find((item) => item.id === body.itemId);
    if (!found) return;

    const mediated = mediate.itemsMarket.toBack([found])[0];
    await buyItem(service, mediated);
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
    await equipItem(service, item, character);
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

    await unequipItem(service, item, character);
  });
};
