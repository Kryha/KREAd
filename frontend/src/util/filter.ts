import { MAX_PRICE, MIN_PRICE } from "../constants";
import { CharacterEquip, CharacterInMarket, ItemEquip, ItemInMarket } from "../interfaces";
import { sortCharacters, sortCharactersMarket, sortItems, sortItemsMarket } from "./sort";

export interface OfferFilters {
  description?: string;
  status?: string;
}

export interface ItemFilters {
  category: string;
  sorting: string;
  color: string;
}

export interface ItemsMarketFilters {
  category: string;
  sorting: string;
  price: { min: number; max: number };
  color: string;
}

export interface CharacterFilters {
  category: string;
  sorting: string;
}

export interface CharactersMarketFilters {
  category: string;
  sorting: string;
  price: { min: number; max: number };
}

export const filterItems = (items: ItemEquip[], { category, sorting, color }: ItemFilters): ItemEquip[] => {
  if (!category && !sorting && !color && items.length) return items;

  const isInCategory = (item: ItemEquip, category: string) => {
    switch (category) {
      case "forSale":
        return item.isForSale;
      case "equipped":
        return item.isEquipped;
      default:
        return category ? item.category === category : true;
    }
  };

  const hasColor = (item: ItemEquip, color: string) => (color ? item.colors.some((colorElement) => colorElement === color) : true);

  const filteredItems = items.filter((item) => isInCategory(item, category) && hasColor(item, color));
  const sortedItems = sortItems(sorting, filteredItems);

  return sortedItems;
};

export const filterItemsMarket = (items: ItemInMarket[], { category, sorting, price, color }: ItemsMarketFilters): ItemInMarket[] => {
  const changedRange = price.min !== MIN_PRICE || price.max !== MAX_PRICE;

  if (!category && !sorting && !color && !changedRange && items.length) return items;

  const isInCategory = ({ item }: ItemInMarket, category: string) => (category ? item.category === category : true);
  const hasColor = ({ item }: ItemInMarket, color: string) => (color ? item.colors.some((colorElement) => colorElement === color) : true);

  const filteredItems = items.filter((item) => isInCategory(item, category) && hasColor(item, color));
  const filteredPrice = filteredItems.filter(({ sell }) => Number(sell.price) > price.min && Number(sell.price) < price.max);
  const sortedItems = sortItemsMarket(sorting, filteredPrice);

  return sortedItems;
};

export const filterCharacters = (characters: CharacterEquip[], { category, sorting }: CharacterFilters): CharacterEquip[] => {
  const isInCategory = (character: CharacterEquip, category: string) => {
    switch (category) {
      case "forSale":
        return character.isForSale;
      case "equipped":
        return character.isEquipped;
      default:
        return character.nft.type === category;
    }
  };

  if (!category && !sorting) return characters;

  const filteredCharacters = characters.filter((character) => isInCategory(character, category));
  const sortedCharacters = sortCharacters(sorting, filteredCharacters);

  return sortedCharacters;
};

export const filterCharactersMarket = (
  characters: CharacterInMarket[],
  { category, sorting, price }: CharactersMarketFilters
): CharacterInMarket[] => {
  const changedRange = price.min !== MIN_PRICE || price.max !== MAX_PRICE;

  const isInCategory = ({ character }: CharacterInMarket, category: string) => (category ? character.type === category : true);

  if (!category && !sorting && !changedRange) return characters;

  const filteredCharacters = characters.filter((character) => isInCategory(character, category));
  const filteredPrice = filteredCharacters.filter(({ sell }) => Number(sell.price) > price.min && Number(sell.price) < price.max);
  const sortedCharacters = sortCharactersMarket(sorting, filteredPrice);

  return sortedCharacters;
};
