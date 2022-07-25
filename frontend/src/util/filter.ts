import { MAX_PRICE, MIN_PRICE } from "../constants";
import { CharacterEquip, CharacterInMarket, ItemEquip, ItemInMarket } from "../interfaces";
import { sortCharacters, sortCharactersMarket, sortItems, sortItemsMarket } from "./sort";

export interface ItemFilters {
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

export const filterItems = (items: ItemEquip[], { category, sorting, price, color }: ItemFilters): ItemEquip[] => {
  const changedRange = price.min !== MIN_PRICE || price.max !== MAX_PRICE;

  if (!category && !sorting && !color && !changedRange && items.length) return [];

  const isInCategory = (item: ItemEquip, category: string) => (category ? item.category === category : true);
  const hasColor = (item: ItemEquip, color: string) => (color ? item.colors.some((colorElement) => colorElement === color) : true);

  const filteredItems = items.filter((item) => isInCategory(item, category) && hasColor(item, color));
  const filteredPrice = filteredItems.filter((item) => item.price > price.min && item.price < price.max);
  const sortedItems = sortItems(sorting, filteredPrice);

  return sortedItems;
};

export const filterItemsMarket = (items: ItemInMarket[], { category, sorting, price, color }: ItemFilters): ItemInMarket[] => {
  const changedRange = price.min !== MIN_PRICE || price.max !== MAX_PRICE;

  if (!category && !sorting && !color && !changedRange && items.length) return [];

  const isInCategory = ({ item }: ItemInMarket, category: string) => (category ? item.category === category : true);
  const hasColor = ({ item }: ItemInMarket, color: string) => (color ? item.colors.some((colorElement) => colorElement === color) : true);

  const filteredItems = items.filter((item) => isInCategory(item, category) && hasColor(item, color));
  const filteredPrice = filteredItems.filter(({ item }) => item.price > price.min && item.price < price.max);
  const sortedItems = sortItemsMarket(sorting, filteredPrice);

  return sortedItems;
};

export const filterCharacters = (characters: CharacterEquip[], { category, sorting }: CharacterFilters): CharacterEquip[] => {
  const isInCategory = (character: CharacterEquip, category: string) => (category ? character.type === category : true);

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
  const filteredPrice = filteredCharacters.filter(({ character }) => character.price > price.min && character.price < price.max);
  const sortedCharacters = sortCharactersMarket(sorting, filteredPrice);

  return sortedCharacters;
};
