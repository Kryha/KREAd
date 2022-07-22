import { MAX_PRICE, MIN_PRICE } from "../constants";
import { ItemEquip } from "../interfaces";
import { sortItems } from "./sort";

export interface ItemFilters {
  category: string;
  sorting: string;
  price: { min: number; max: number };
  color: string;
}

export const filterItems = (items: ItemEquip[], { category, sorting, price, color }: ItemFilters) => {
  const changedRange = price.min !== MIN_PRICE || price.max !== MAX_PRICE;

  if (!category && !sorting && !color && !changedRange && items.length) return [];

  const isInCategory = (item: ItemEquip, category: string) => (category ? item.category === category : true);
  const hasColor = (item: ItemEquip, color: string) => (color ? item.colors.some((colorElement) => colorElement === color) : true);

  const filteredItems = items.filter((item) => isInCategory(item, category) && hasColor(item, color));
  const filteredPrice = filteredItems.filter((item) => item.price > price.min && item.price < price.max);
  const sortedItems = sortItems(sorting, filteredPrice);

  return sortedItems;
};
