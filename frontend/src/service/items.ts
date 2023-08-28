import { useCallback, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { Item, ItemBackend, ItemEquip, ItemInMarket } from "../interfaces";
import { filterItems, filterItemsMarket, ItemFilters, ItemsMarketFilters, mediate } from "../util";
import { useAgoricContext } from "../context/agoric";
// import { equipItem, unequipItem, sellItem, buyItem } from "./item-actions";
import { useOffers } from "./offers";
import { ITEM_PURSE_NAME } from "../constants";
import { useItemMarketState } from "../context/item-shop";
import { useUserState } from "../context/user";
import { useWalletState } from "../context/wallet";
import { marketService } from "./character/market";
import { inventoryService } from "./character/inventory";

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
  const { items: owned, equippedItems: equipped, fetched } = useUserState();
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
        const itemToSell = {...found, id: Number(found.id)}
        const instance = service.contracts.kread.instance;
        const itemBrand = service.tokenInfo.item.brand;

        setIsLoading(true);
        
        marketService.sellItem({
          item: itemToSell,
          price: BigInt(price),
          service: {
            kreadInstance: instance,
            itemBrand,
            makeOffer: service.walletConnection.makeOffer,
            istBrand: service.tokenInfo.ist.brand
          },
          callback: async () => {
            console.info("SellItem call settled");
          }
        })
        return true;
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

  const instance = service.contracts.kread.instance;
  const itemBrand = service.tokenInfo.item.brand;
  const istBrand = service.tokenInfo.ist.brand;
  // TODO: enable listening to offer approved

  const callback = useCallback(async () => {
    try {
      const found = items.find((item) => item.id === itemId);
      if (!found) return;
      const itemToBuy = { ...found, id: Number(found.id), item: { ...found.item, id: Number(found.item.id) }};
      
      setIsLoading(true);
      
      console.log({
        item: itemToBuy,
        price: BigInt(itemToBuy.sell.price),
        service: {
          kreadInstance: instance,
          itemBrand,
          makeOffer: service.walletConnection.makeOffer,
          istBrand
    }});
      return await marketService.buyItem({
        item: itemToBuy.item,
        price: BigInt(itemToBuy.sell.price),
        service: {
          kreadInstance: instance,
          itemBrand,
          makeOffer: service.walletConnection.makeOffer,
          istBrand
        },
        callback: async () => {
          console.info("BuyItem call settled");
          setIsLoading(false);
        }
      })
    } catch (error) {
      console.warn(error);
      setIsError(true);
    }
  }, [itemId, items, wallet, service]);

  return { callback, isLoading, isError };
};

export const useEquipItem = () => {
  const [service] = useAgoricContext();
  const { items, selected: character } = useUserState();
  const kreadInstance = service.contracts.kread.instance;
  const characterBrand = service.tokenInfo.character.brand;
  const itemBrand = service.tokenInfo.item.brand;

  
  
  return useMutation(async (body: { itemId: string }) => {
    if (!character) return;
    const characterToEquipTo = { ...character.nft, id: Number(character.nft.id) };
    const item = items.find((item) => item.id === body.itemId);
    
    if (!item) return;
    const itemToEquip = { ...item, id: Number(item.id)}

    await inventoryService.equipItem({
      character: characterToEquipTo,
      item: itemToEquip,
      service: {
        kreadInstance,
        characterBrand,
        itemBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => {
        console.info("Equip call settled");
      }
    })
  });
};

export const useUnequipItem = () => {
  const [service] = useAgoricContext();
  const { equippedItems: equipped, selected: character } = useUserState();
  const instance = service.contracts.kread.instance;
  const charBrand = service.tokenInfo.character.brand;
  const itemBrand = service.tokenInfo.item.brand;

  return useMutation(async (body: { itemId: string }) => {
    if (!character) return;
    const sanitizedEquipped = equipped.filter((item) => item !== undefined);
    const item = sanitizedEquipped.find((item) => item.id === body.itemId);
    
    if (!item) return;
    const itemToUnEquip = { ...item, id: Number(item.id)}
    const characterToUnequipFrom = { ...character.nft, id: Number(character.nft.id) };
    
    await inventoryService.unequipItem({
      item: itemToUnEquip,
      character: characterToUnequipFrom,
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        itemBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => {
        console.info("Unequip call settled");
      }
    });
  });
};
