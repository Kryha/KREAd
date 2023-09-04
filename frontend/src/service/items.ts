import { useCallback, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { Character, Item, ItemBackend, ItemCategory, ItemEquip, ItemInMarket } from "../interfaces";
import { filterItems, filterItemsInShop, ItemFilters, ItemsMarketFilters, mediate } from "../util";
import { useAgoricContext } from "../context/agoric";
import { useOffers } from "./offers";
import { ITEM_PURSE_NAME } from "../constants";
import { useItemMarketState } from "../context/item-shop";
import { useUserState, useUserStateDispatch } from "../context/user";
import { useWalletState } from "../context/wallet";
import { marketService } from "./character/market";
import { inventoryService } from "./character/inventory";

// TODO: Fix this function used during buy and sell
export const useMyItem = (id: string): [ItemEquip | undefined, boolean] => {
  const [found, setFound] = useState<ItemEquip | undefined>(undefined);
  return [found, false];
};

export const useGetItemInInventoryById = (id: string): [ItemEquip | undefined, boolean] => {
  const [items, isLoading] = useGetItemsInInventory();

  const found = useMemo(() => items.find((item) => item.id === id), [id, items]);

  return [found, isLoading];
};

export const useGetItemsInInventory = (filters?: ItemFilters): [ItemEquip[], boolean] => {
  const { equippedItems, fetched } = useUserState();

  if (!filters) return [equippedItems, !fetched];

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
    [offers],
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

export const useGetItemInShopById = (id: string): [ItemInMarket | undefined, boolean] => {
  const { items, fetched } = useItemMarketState();

  const found = useMemo(() => items.find((item) => item.id === id), [id, items]);

  return [found, !fetched];
};

export const useGetItemsInShop = (filters?: ItemsMarketFilters): [ItemInMarket[], boolean] => {
  const { items, fetched } = useItemMarketState();
  if (!filters) return [items, !fetched];

  const filtered = !filters ? items : filterItemsInShop(items, filters);

  return [filtered, !fetched];
};

export const useSellItem = (itemName: string | undefined, itemCategory: ItemCategory | undefined) => {
  const [service] = useAgoricContext();
  const wallet = useWalletState();
  const { items } = useUserState();
  const [isLoading, setIsLoading] = useState(false);
  // TODO: enable listening to offer approved

  const callback = useCallback(
    async (price: number, setPlacedInShop: () => void) => {
      try {
        const found = items.find((item) => (item.name === itemName && item.category===itemCategory));
        if (!found) return;
        const { forSale, isEquipped, activity, ...itemToSell } = found;
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
            istBrand: service.tokenInfo.ist.brand,
          },
          callback: async () => {
            console.info("SellItem call settled");
            setPlacedInShop();
          },
        });
        return true;
      } catch (error) {
        console.warn(error);
        return false;
      }
    },
    [itemName, itemCategory, wallet, items, service],
  );

  return { callback, isLoading };
};

export const useBuyItem = (itemToBuy: ItemInMarket) => {
  console.log("helo?")
  const [service] = useAgoricContext();
  const wallet = useWalletState();
  const [items] = useGetItemsInShop();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const instance = service.contracts.kread.instance;
  const itemBrand = service.tokenInfo.item.brand;
  const istBrand = service.tokenInfo.ist.brand;
  // TODO: enable listening to offer approved

  const callback = useCallback(async (setIsAwaitingApprovalToFalse: () => void) => {
    try {
      if (!itemToBuy) return;
      const { forSale, isEquipped, activity, ...itemObject } = itemToBuy.item;
      itemToBuy.item = itemObject;

      setIsLoading(true);

      return await marketService.buyItem({
        item: itemToBuy.item,
        price: BigInt(itemToBuy.sell.price),
        service: {
          kreadInstance: instance,
          itemBrand,
          makeOffer: service.walletConnection.makeOffer,
          istBrand,
        },
        callback: async () => {
          console.info("BuyItem call settled");
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.warn(error);
      setIsError(true);
      setIsAwaitingApprovalToFalse();
    }
  }, [itemToBuy, items, wallet, service]);

  return { callback, isLoading, isError };
};

export const useEquipItem = (callback?: React.Dispatch<React.SetStateAction<Item | undefined>>) => {
  const [service] = useAgoricContext();
  const { items, selected: character } = useUserState();
  const { character: charactersInWallet } = useWalletState();
  const userStateDispatch = useUserStateDispatch();
  const kreadInstance = service.contracts.kread.instance;
  const characterBrand = service.tokenInfo.character.brand;
  const itemBrand = service.tokenInfo.item.brand;
  
  return useMutation(async (body: { item: Item }) => {
    if (!character) return;
    // FIXME: add character type
    const characterInWallet = charactersInWallet.find((walletEntry: any) => walletEntry.nft.id === character.nft.id);
    const characterToEquipTo = { ...characterInWallet.nft, id: Number(character.nft.id) };
    // const item = items.find((item) => item.name === body.itemName);
    if (!body.item) return;

    userStateDispatch({ type: "START_INVENTORY_CALL" });

    const { forSale, isEquipped, activity, ...itemToEquip } = body.item;
    console.log(itemToEquip);

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
        userStateDispatch({ type: "END_INVENTORY_CALL" });
        if (callback) callback(body.item);
      },
    });
  });
};

export const useUnequipItem = (callback?: () => void) => {
  const [service] = useAgoricContext();
  const { equippedItems, selected: character } = useUserState();
  const userStateDispatch = useUserStateDispatch();
  const instance = service.contracts.kread.instance;
  const charBrand = service.tokenInfo.character.brand;
  const itemBrand = service.tokenInfo.item.brand;

  return useMutation(async (body: { item: Item }) => {
    if (!character) return;
    // const sanitizedEquipped = equippedItems.filter((item) => item !== undefined);
    // const item = sanitizedEquipped.find((item) => item.name === body.itemName);
    
    if (!body.item) return;

    userStateDispatch({ type: "START_INVENTORY_CALL" });

    const { forSale, isEquipped, activity, ...itemToUnequip } = body.item;
    
    console.log(itemToUnequip);
    const characterToUnequipFrom = { ...character.nft, id: Number(character.nft.id) };

    await inventoryService.unequipItem({
      item: itemToUnequip,
      character: characterToUnequipFrom,
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        itemBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => {
        console.info("Unequip call settled");
        userStateDispatch({ type: "END_INVENTORY_CALL" });
        if (callback) callback();
      },
    });
  });
};
