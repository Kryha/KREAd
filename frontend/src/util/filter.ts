import { MAX_PRICE, MIN_PRICE } from "../constants";
import { CharacterEquip, CharacterInMarket, Item, ItemInMarket } from "../interfaces";
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
  categories: string[];
  sort: string;
  price?: { min: number; max: number };
}

export interface CharactersMarketFilters {
  category: string;
  sorting: string;
  price: { min: number; max: number };
}

export const filterItems = (items: Item[], { categories, sort, color }: ItemFilters): Item[] => {
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
  const isInCategory = (item: Item, selectedCategories: string[] | undefined) => {
    if (!selectedCategories || selectedCategories.length === 0) return true; // Return true if no categories are selected

    if (selectedCategories.includes("allCategories")) return true; // Return true if all categories are selected

    const isForSaleSelected = selectedCategories.includes("forSale");
    const isEquippedSelected = selectedCategories.includes("equipped");

    if (isForSaleSelected && !isEquippedSelected) {
      // If "forSale" is selected and other categories are listed
      const otherSelectedCategories = selectedCategories.filter((category) => category !== "forSale" && category !== "equipped");

      if (otherSelectedCategories.length > 0) {
        return otherSelectedCategories.includes(item.category) && item.forSale;
      }

      // If only "forSale" is selected, return only for sale items
      return item.forSale;
    }

    if (!isForSaleSelected && isEquippedSelected) {
      // If "equipped" is selected and other categories are listed
      const otherSelectedCategories = selectedCategories.filter((category) => category !== "forSale" && category !== "equipped");

      if (otherSelectedCategories.length > 0) {
        return otherSelectedCategories.includes(item.category) && item.equippedTo1  ;
      }

      // If only "equipped" is selected, return only equipped items
      return item.equippedTo;
    }

    // If only specific categories are selected (excluding "forSale" and "equipped")
    const otherSelectedCategories = selectedCategories.filter((category) => category !== "forSale" && category !== "equipped");

    if (otherSelectedCategories.length > 0) {
      return otherSelectedCategories.includes(item.category);
    }

    return selectedCategories.includes(item.category);
  };
  const hasColor = (item: Item, selectedColor: string) =>
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

export const filterCharacters = (characters: CharacterEquip[], { categories, sort }: CharacterFilters): CharacterEquip[] => {
  if (characters.length === 0) return []; // Return empty array if there are no items to filter

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(
      {
        categories: categories.join(","),
        sort,
      },
      {
        relative: "path",
      }
    );
  }, [categories, sort]);

  const isInCategory = (character: CharacterEquip, selectedCategories: string[] | undefined) => {
    if (!selectedCategories || selectedCategories.length === 0) return true; // Return true if no categories are selected

    if (selectedCategories.includes("allCategories")) return true; // Return true if all categories are selected

    const isForSaleSelected = selectedCategories.includes("forSale");
    const isEquippedSelected = selectedCategories.includes("equipped");

    if (isForSaleSelected && !isEquippedSelected) {
      // If "forSale" is selected and other categories are listed
      const otherSelectedCategories = selectedCategories.filter((category) => category !== "forSale" && category !== "equipped");

      if (otherSelectedCategories.length > 0) {
        return otherSelectedCategories.includes(character.nft.type) && character.isForSale;
      }

      // If only "forSale" is selected, return only for sale items
      return character.isForSale;
    }

    if (!isForSaleSelected && isEquippedSelected) {
      // If "equipped" is selected and other categories are listed
      const otherSelectedCategories = selectedCategories.filter((category) => category !== "forSale" && category !== "equipped");

      if (otherSelectedCategories.length > 0) {
        return otherSelectedCategories.includes(character.nft.type) && character.isEquipped;
      }

      // If only "equipped" is selected, return only equipped items
      return character.isEquipped;
    }

    // If only specific categories are selected (excluding "forSale" and "equipped")
    const otherSelectedCategories = selectedCategories.filter((category) => category !== "forSale" && category !== "equipped");

    if (otherSelectedCategories.length > 0) {
      return otherSelectedCategories.includes(character.nft.type);
    }

    return selectedCategories.includes(character.nft.type);
  };

  const filteredCharacters = characters.filter((character) => isInCategory(character, categories));

  return sortCharacters(sort, filteredCharacters);
};

export const filterCharactersMarket = (
  characters: CharacterInMarket[],
  { categories, sort, price }: CharacterFilters
): CharacterInMarket[] => {
  if (characters.length === 0) return [];

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(
      {
        categories: categories?.join(",") || "",
        sort: sort || "",
      },
      {
        relative: "path",
      }
    );
  }, [categories, sort]);

  const isInCategory = ({ character }: CharacterInMarket, selectedCategories: string[] | undefined) => {
    if (!character || !selectedCategories || selectedCategories.length === 0) return true;
    if (selectedCategories.includes("allCategories")) return true;
    return selectedCategories.includes(character.type);
  };

  const filteredCharacters = characters.filter((character) => isInCategory(character, categories));
  const filterCharactersByPrice = filteredCharacters.filter(({ sell }) => {
    if (!price) return true;
    return Number(sell.price) > price.min && Number(sell.price) < price.max;
  });

  return sortCharactersMarket(sort, filterCharactersByPrice);
};
