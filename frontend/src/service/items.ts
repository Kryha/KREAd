import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";

import { Item, ItemEquip, ItemInMarket, ItemInMarketBackend } from "../interfaces";
import { filterItems, filterItemsMarket, ItemFilters, mediate } from "../util";
import { useItemContext } from "../context/items";
import { useAgoricContext } from "../context/agoric";
import { equipItem, unequipItem, sellItem, buyItem } from "./item-actions";
import { useSelectedCharacter } from "./character";
import { E } from "@endo/eventual-send";

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

export const useSellItem = (itemId: string) => {
  const [service] = useAgoricContext();
  const [{ owned }] = useMyItems();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [itemInMarket, setItemInMarket] = useState<ItemInMarketBackend>();

  useEffect(() => {
    const addToMarket = async () => {
      try {
        if (!itemInMarket || !service.offers.length) return;

        const latestOffer = service.offers[service.offers.length - 1];
        if (latestOffer.invitationDetails.description !== "seller") return;
        if (!latestOffer.status || latestOffer.status !== "pending") return;

        const itemFromProposal = latestOffer.proposalTemplate.give.Items.value[0];
        if (!itemFromProposal || String(itemFromProposal.id) !== itemId) return;

        await E(service.contracts.characterBuilder.publicFacet).storeItemInMarket(itemInMarket);
        setIsSuccess(true);
      } catch (error) {
        console.warn(error);
        setIsError(true);
      }
      setIsLoading(false);
    };
    addToMarket();
  }, [itemId, itemInMarket, service.contracts.characterBuilder.publicFacet, service.offers]);

  const callback = useCallback(
    async (price: number) => {
      try {
        const found = owned.find((item) => item.id === itemId);
        if (!found) return;

        const mediated = mediate.items.toBack([found])[0];
        setIsLoading(true);
        const toStore = await sellItem(service, mediated, BigInt(price));
        setItemInMarket(toStore);
      } catch (error) {
        console.warn(error);
        setIsError(true);
      }
    },
    [itemId, owned, service]
  );

  return { callback, isLoading, isError, isSuccess };
};

export const useBuyItem = (itemId: string) => {
  const [service] = useAgoricContext();
  const [items] = useItemsMarket();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const removeFromMarket = async () => {
      try {
        if (!service.offers.length) return;

        const latestOffer = service.offers[service.offers.length - 1];
        if (latestOffer.invitationDetails.description !== "buyer") return;
        if (!latestOffer.status || latestOffer.status !== "accept") return;

        const itemFromProposal = latestOffer.proposalTemplate.want.Items.value[0];
        if (!itemFromProposal || String(itemFromProposal.id) !== itemId) return;

        await E(service.contracts.characterBuilder.publicFacet).removeItemFromMarket(BigInt(itemId));
        setIsSuccess(true);
      } catch (error) {
        console.warn(error);
        setIsError(true);
      }
      setIsLoading(false);
    };
    removeFromMarket();
  }, [itemId, service.contracts.characterBuilder.publicFacet, service.offers]);

  const callback = useCallback(async () => {
    try {
      const found = items.find((item) => item.id === itemId);
      if (!found) return;

      const mediated = mediate.itemsMarket.toBack([found])[0];
      setIsLoading(true);
      await buyItem(service, mediated);
    } catch (error) {
      console.warn(error);
      setIsError(true);
    }
  }, [itemId, items, service]);

  return { callback, isLoading, isError, isSuccess };
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
