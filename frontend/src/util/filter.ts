import { Character, CharacterInMarket, ExtendedCharacter, Item, ItemCategory, ItemInMarket } from "../interfaces";
import { sortCharacters, sortCharactersMarket, sortItems, sortItemsMarket } from "./sort";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export interface OfferFilters {
  description?: string;
  status?: string;
}

export interface ItemFilters {
  categories: ItemCategory[];
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
  titles: string[];
  origins: string[];
  sort: string;
  price?: { min: number; max: number };
}

export interface CharactersMarketFilters {
  category: string;
  sorting: string;
  price: { min: number; max: number };
}

// TODO: @Privilege will fix this train wreck
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
        return otherSelectedCategories.includes(item.category) && item.equippedTo;
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

export const filterCharacters = (characters: ExtendedCharacter[], { origins, sort, titles }: CharacterFilters): ExtendedCharacter[] => {
  if (characters.length === 0) return []; // Return empty array if there are no items to filter

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(
      {
        titles: titles.join(","),
        origins: origins.join(","),
        sort,
      },
      {
        relative: "path",
      },
    );
  }, [titles, origins, sort]);

  const isInTitle = (character: Character, selectedTitles: string[] | undefined) => {
    if (!selectedTitles || selectedTitles.length === 0) return true; // Return true if no categories are selected
    return selectedTitles.includes(character.title);
  };

  const isInOrigin = (character: Character, selectedOrigins: string[] | undefined) => {
    if (!selectedOrigins || selectedOrigins.length === 0) return true; // Return true if no categories are selected
    return selectedOrigins.includes(character.origin);
  };

  const filteredCharacters = characters.filter((character) => isInTitle(character.nft, titles) || isInOrigin(character.nft, origins));

  return sortCharacters(sort, filteredCharacters);
};

// TODO: to update
export const filterCharactersMarket = (
  characters: CharacterInMarket[],
  { titles, origins, sort, price }: CharacterFilters,
): CharacterInMarket[] => {
  if (characters.length === 0) return [];

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(
      {
        titles: titles?.join(",") || "",
        origins: origins?.join(",") || "",
        sort: sort || "",
      },
      {
        relative: "path",
      },
    );
  }, [titles, origins, sort]);

  const isInTitle = (character: Character, selectedTitles: string[] | undefined) => {
    if (!selectedTitles || selectedTitles.length === 0) return true; // Return true if no categories are selected
    return selectedTitles.includes(character.title);
  };

  const isInOrigin = (character: Character, selectedOrigins: string[] | undefined) => {
    if (!selectedOrigins || selectedOrigins.length === 0) return true; // Return true if no categories are selected
    return selectedOrigins.includes(character.origin);
  };

  const filteredCharacters = characters.filter(
    (character) => isInTitle(character.character, titles) || isInOrigin(character.character, origins),
  );

  const filterCharactersByPrice = filteredCharacters.filter(({ sell }) => {
    if (!price) return true;
    return Number(sell.price) > price.min && Number(sell.price) < price.max;
  });

  return sortCharactersMarket(sort, filterCharactersByPrice);
};
