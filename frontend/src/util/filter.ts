import { MAX_PRICE, MIN_PRICE } from "../constants";
import { CharacterEquip, ItemEquip } from "../interfaces";
import { sortCharacters, sortItems } from "./sort";

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

export const filterCharacters = (characters: CharacterEquip[], { category, sorting }: CharacterFilters): CharacterEquip[] => {
  const isInCategory = (character: CharacterEquip, category: string) => (category ? character.nft.type === category : true);

  if (!category && !sorting) return characters;

  const filteredCharacters = characters.filter((character) => isInCategory(character, category));
  const sortedCharacters = sortCharacters(sorting, filteredCharacters);

  return sortedCharacters;
};
