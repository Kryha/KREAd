import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { ItemBackend, ItemEquip, ItemInMarket } from "../interfaces";
import { filterItems, filterItemsMarket, ItemFilters, ItemsMarketFilters, mediate } from "../util";
import { useAgoricContext } from "../context/agoric";
import { buyItem, equipItem, sellItem, unequipItem } from "./item-actions";
import { useOffers } from "./offers";
import { ITEM_PURSE_NAME } from "../constants";
import { useItemMarketState } from "../context/item-shop";
import { useUserState } from "../context/user";
import { useWalletState } from "../context/wallet";
import { useSearchParams } from "react-router-dom";

// TODO: Fix this function used during buy and sell
export const useMyItem = (id: string): [ItemEquip | undefined, boolean] => {
  const [found, setFound] = useState<ItemEquip | undefined>(undefined);
  return [found, false];
};

export const useItemFromInventory = (id: string): [ItemEquip | undefined, boolean] => {
  const [items, isLoading] = useMyItems();

  const found = useMemo(() => items.find((item) => item.id === id), [id, items]);

  return [found, isLoading];
};

export function extractExistingParams(searchParams: URLSearchParams): Record<string, string[]> {
  const entries = Array.from(searchParams.entries());
  return entries.reduce((acc, [key, value]) => {
    acc[key] = acc[key] || [];
    acc[key].push(value);
    return acc;
  }, {} as Record<string, string[]>);
}

export function removeExistingParamsArrayValue(searchParams: URLSearchParams, key: string, value: string): Record<string, string[]> {
  const existingParams = extractExistingParams(searchParams);

  if (existingParams[key]) {
    existingParams[key] = existingParams[key].filter((v) => v !== value);
  }

  if (existingParams[key].length === 0) {
    delete existingParams[key];
  }

  return existingParams;
}

export const useMyItems = (filters?: ItemFilters): [ItemEquip[], boolean] => {
  const { equippedItems, fetched } = useUserState();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!filters) return [equippedItems, !fetched];

  useEffect(() => {
    const { categories, sorting, color } = filters;
    setSearchParams(
      {
        categories: categories.join(","),
        sorting,
        color,
      },
      {
        relative: "path",
      }
    );
  }, [setSearchParams, filters]);

  const filtered = !filters ? equippedItems : filterItems(equippedItems, filters);

  return [filtered, !fetched];
};

export const useMyItemsForSale = () => {
  const offers = useOffers({ description: "seller", status: "pending" });

  // filtering item offers
  const itemOffers = useMemo(
    () =>
      offers.filter((offer) => {
        try {
          return offer.proposalTemplate.give.Items.pursePetname[1] === ITEM_PURSE_NAME;
        } catch (error) {
          return false;
        }
      }),
    [offers]
  );

  // getting items from filtered offers
  const itemsForSale: ItemEquip[] = useMemo(() => {
    try {
      const itemsFromOffers: ItemBackend[] = itemOffers.map((offer: any) => {
        return offer.proposalTemplate.give.Items.value[0];
      });
      const itemsFromOffersFrontend: ItemEquip[] = mediate.items
        .toFront(itemsFromOffers)
        .map((item) => ({ ...item, isEquipped: false, isForSale: true }));
      return itemsFromOffersFrontend;
    } catch (error) {
      return [];
    }
  }, [itemOffers]);

  return itemsForSale;
};

export const useItemFromMarket = (id: string): [ItemInMarket | undefined, boolean] => {
  const [items, isLoading] = useItemsMarket();

  const found = useMemo(() => items.find((item) => item.id === id), [id, items]);

  return [found, isLoading];
};

export const useItemsMarket = (filters?: ItemsMarketFilters): [ItemInMarket[], boolean] => {
  const { items, fetched } = useItemMarketState();
  const filtered = useMemo(() => {
    if (!filters) return items;
    return filterItemsMarket(items, filters);
  }, [filters, items]);

  return [filtered, !fetched];
};

// TODO: consider removing if unneeded
export const useItemsMarketPage = (page: number, filters?: ItemsMarketFilters): [ItemInMarket[], boolean] => {
  const { items, fetched } = useItemMarketState();

  const filtered = useMemo(() => {
    if (!filters) return items;
    return filterItemsMarket(items, filters);
  }, [filters, items]);

  return [filtered, !fetched];
};

export const useSellItem = (itemId: string) => {
  const [service] = useAgoricContext();
  const wallet = useWalletState();
  const { items } = useUserState();
  const [isLoading, setIsLoading] = useState(false);
  // TODO: enable listening to offer approved

  const callback = useCallback(
    async (price: number) => {
      try {
        const found = items.find((item) => item.id === itemId);
        if (!found) return;
        const mediated = mediate.items.toBack([found])[0];
        setIsLoading(true);
        return await sellItem(service, wallet, mediated, BigInt(price));
      } catch (error) {
        console.warn(error);
        return false;
      }
    },
    [itemId, wallet, items, service]
  );

  return { callback, isLoading };
};

export const useBuyItem = (itemId: string) => {
  const [service] = useAgoricContext();
  const wallet = useWalletState();
  const [items] = useItemsMarket();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  // TODO: enable listening to offer approved

  const callback = useCallback(async () => {
    try {
      const found = items.find((item) => item.id === itemId);
      if (!found) return;

      const mediated = mediate.itemsMarket.toBack([found])[0];
      setIsLoading(true);
      return await buyItem(service, wallet, mediated.item, mediated.sell.price);
    } catch (error) {
      console.warn(error);
      setIsError(true);
    }
  }, [itemId, items, wallet, service]);

  return { callback, isLoading, isError };
};

export const useEquipItem = () => {
  const [service] = useAgoricContext();
  const wallet = useWalletState();
  const { items, selected: character } = useUserState();

  return useMutation(async (body: { itemId: string }) => {
    if (!character) return;

    const item = items.find((item) => item.id === body.itemId);

    if (!item) return;

    await equipItem(service, wallet, item, character.nft);
  });
};

export const useUnequipItem = () => {
  const [service] = useAgoricContext();
  const { equippedItems: equipped, selected: character } = useUserState();
  const wallet = useWalletState();

  return useMutation(async (body: { itemId: string }) => {
    if (!character) return;
    const sanitizedEquipped = equipped.filter((item) => item !== undefined);
    const item = sanitizedEquipped.find((item) => item.id === body.itemId);
    if (!item) return;
    await unequipItem(service, wallet, item, character);
  });
};
