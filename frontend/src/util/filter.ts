import { MAX_PRICE, MIN_PRICE } from "../constants";
import { CharacterEquip, CharacterInMarket, ItemEquip, ItemInMarket } from "../interfaces";
import { sortCharacters, sortCharactersMarket, sortItems, sortItemsMarket } from "./sort";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export interface OfferFilters {
  description?: string;
  status?: string;
}

export interface ItemFilters {
  categories: string[];
  sort: string;
  color: string;
  price?: { min: number; max: number };
}

export interface ItemsMarketFilters {
  categories: string[];
  sort: string;
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

export const filterItems = (items: ItemEquip[], { categories, sort, color }: ItemFilters): ItemEquip[] => {
  if (items.length === 0) return []; // Return empty array if there are no items to filter

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(
      {
        categories: categories.join(","),
        sort,
        color,
      },
      {
        relative: "path",
      },
    );
  }, [categories, sort, color]);

  // TODO: ForSale and isEquipped to be moved from categories to separate filters?
  const isInCategory = (item: ItemEquip, selectedCategories: string[] | undefined) => {
    if (!selectedCategories || selectedCategories.length === 0) return true; // Return true if no categories are selected

    if (selectedCategories.includes("allCategories")) return true; // Return true if all categories are selected

    const isForSaleSelected = selectedCategories.includes("forSale");
    const isEquippedSelected = selectedCategories.includes("equipped");

    if (isForSaleSelected && !isEquippedSelected) {
      // If "forSale" is selected and other categories are listed
      const otherSelectedCategories = selectedCategories.filter((category) => category !== "forSale" && category !== "equipped");

      if (otherSelectedCategories.length > 0) {
        return otherSelectedCategories.includes(item.category) && item.isForSale;
      }

      // If only "forSale" is selected, return only for sale items
      return item.isForSale;
    }

    if (!isForSaleSelected && isEquippedSelected) {
      // If "equipped" is selected and other categories are listed
      const otherSelectedCategories = selectedCategories.filter((category) => category !== "forSale" && category !== "equipped");

      if (otherSelectedCategories.length > 0) {
        return otherSelectedCategories.includes(item.category) && item.isEquipped;
      }

      // If only "equipped" is selected, return only equipped items
      return item.isEquipped;
    }

    // If only specific categories are selected (excluding "forSale" and "equipped")
    const otherSelectedCategories = selectedCategories.filter((category) => category !== "forSale" && category !== "equipped");

    if (otherSelectedCategories.length > 0) {
      return otherSelectedCategories.includes(item.category);
    }

    return selectedCategories.includes(item.category);
  };
  const hasColor = (item: ItemEquip, selectedColor: string) =>
    selectedColor ? item.colors.some((colorElement) => colorElement === selectedColor) : true;
  const filteredItems = items.filter((item) => isInCategory(item, categories) && hasColor(item, color));

  return sortItems(sort, filteredItems);
};

export const filterItemsInShop = (items: ItemInMarket[], { categories, sort, price, color }: ItemFilters): ItemInMarket[] => {
  if (items.length === 0) return [];

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(
      {
        categories: categories?.join(",") || "",
        sort: sort || "",
        color: color || "",
      },
      {
        relative: "path",
      },
    );
  }, [categories, sort, color]);

  const isInCategory = ({ item }: ItemInMarket, selectedCategories: string[] | undefined) => {
    if (!selectedCategories || selectedCategories.length === 0) return true;
    if (selectedCategories.includes("allCategories")) return true;
    return selectedCategories.includes(item.category);
  };

  const hasColor = ({ item }: ItemInMarket, itemColor: string) => {
    return !itemColor || item.colors.includes(itemColor);
  };

  const filteredItems = items.filter((item) => isInCategory(item, categories) && hasColor(item, color));
  const filterItemsByPrice = filteredItems.filter(({ sell }) => {
    if (!price) return true;
    return Number(sell.price) > price.min && Number(sell.price) < price.max;
  });

  return sortItemsMarket(sort, filterItemsByPrice); // Make sure to define sortItemsMarket function
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
  return sortCharacters(sorting, filteredCharacters);
};

export const filterCharactersMarket = (
  characters: CharacterInMarket[],
  { category, sorting, price }: CharactersMarketFilters,
): CharacterInMarket[] => {
  const changedRange = price.min !== MIN_PRICE || price.max !== MAX_PRICE;

  const isInCategory = ({ character }: CharacterInMarket, category: string) => (category ? character.type === category : true);

  if (!category && !sorting && !changedRange) return characters;

  const filteredCharacters = characters.filter((character) => isInCategory(character, category));
  const filteredPrice = filteredCharacters.filter(({ sell }) => Number(sell.price) > price.min && Number(sell.price) < price.max);
  return sortCharactersMarket(sorting, filteredPrice);
};
