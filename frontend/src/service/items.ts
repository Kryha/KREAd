import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { E } from "@endo/eventual-send";

import { Item, ItemBackend, ItemEquip, ItemInMarket, ItemInMarketBackend } from "../interfaces";
import { filterItems, filterItemsMarket, ItemFilters, ItemsMarketFilters, mediate } from "../util";
import { useItemContext } from "../context/items";
import { useAgoricContext } from "../context/agoric";
import { equipItem, unequipItem, sellItem, buyItem } from "./item-actions";
import { useSelectedCharacter } from "./character";
import { useOffers } from "./offers";
import { ITEM_PURSE_NAME } from "../constants";

export const useMyItem = (id: string): [ItemEquip | undefined, boolean] => {
  const [{ all }, isLoading] = useMyItems();

  const found = useMemo(() => all.find((item) => item.id === id), [all, id]);

  return [found, isLoading];
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

export const useMyItems = (filters?: ItemFilters): [{ owned: Item[]; equipped: Item[]; all: ItemEquip[] }, boolean] => {
  const [{ owned, equipped, fetched }] = useItemContext();
  const itemsForSale = useMyItemsForSale();

  const all = useMemo(
    () => [
      ...equipped.map((item) => ({ ...item, isEquipped: true, isForSale: false })),
      ...owned.map((item) => ({ ...item, isEquipped: false, isForSale: false })),
    ],
    [equipped, owned]
  );

  // mixing items from wallet to items from offers
  const allWithForSale: ItemEquip[] = useMemo(() => {
    try {
      return [...all, ...itemsForSale];
    } catch (error) {
      return all;
    }
  }, [all, itemsForSale]);

  // filtering all the items
  const filtered = useMemo(() => {
    if (!filters) return allWithForSale;
    return filterItems(allWithForSale, filters);
  }, [allWithForSale, filters]);

  return [{ owned, equipped, all: filtered }, !fetched];
};

// export const useMyItemsPage = (page: number, filters?: ItemFilters): [{ owned: Item[]; equipped: Item[]; all: ItemEquip[] }, boolean, number] => {
//   const [{ owned, equipped, fetched }] = useItemContext();
//   // TODO: get total pages
//   const totalPages = 20;
//   const all = useMemo(
//     () => [...equipped.map((item) => ({ ...item, isEquipped: true })), ...owned.map((item) => ({ ...item, isEquipped: false }))],
//     [equipped, owned]
//   );

//   const filtered = useMemo(() => {
//     if (!filters) return all;
//     return filterItems(all, filters);
//   }, [all, filters]);

//   return [{ owned, equipped, all: filtered }, !fetched, totalPages];
// };

export const useItemFromMarket = (id: string): [ItemInMarket | undefined, boolean] => {
  const [items, isLoading] = useItemsMarket();

  const found = useMemo(() => items.find((item) => item.id === id), [id, items]);

  return [found, isLoading];
};

export const useItemsMarket = (filters?: ItemsMarketFilters): [ItemInMarket[], boolean] => {
  const [{ market, marketFetched }] = useItemContext();

  const filtered = useMemo(() => {
    if (!filters) return market;
    return filterItemsMarket(market, filters);
  }, [filters, market]);

  return [filtered, !marketFetched];
};

export const useItemsMarketPage = (page: number, filters?: ItemsMarketFilters): [ItemInMarket[], boolean] => {
  const [{ market, marketFetched }] = useItemContext();

  const filtered = useMemo(() => {
    if (!filters) return market;
    return filterItemsMarket(market, filters);
  }, [filters, market]);

  return [filtered, !marketFetched];
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
