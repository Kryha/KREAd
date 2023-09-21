import {
  Category,
  Character,
  CharacterInMarket,
  ExtendedCharacter,
  ExtendedCharacterBackend,
  Item,
  ItemInMarket,
  Origin,
  Rarity,
} from "../interfaces";
import { sortCharacters, sortCharactersMarket, sortItems, sortItemsMarket } from "./sort";
import { getRarityString } from "../service";
import { useFilters } from "../context/filter-context";

export interface OfferFilters {
  description?: string;
  status?: string;
}

export interface ItemFilters {
  categories: Category[];
  rarity: Rarity[];
  origins: Origin[];
  sort: string;
  colors: string;
  price?: { min: number; max: number };
  equippedTo?: string;
  forSale?: boolean;
}

export interface ItemsMarketFilters {
  categories: string[];
  origins: string[];
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
export const useFilterItems = (items: Item[]): Item[] => {
  const { origin, categories, rarity, colors, sort, equippedTo, forSale } = useFilters();
  if (items.length === 0) return [];

  const filteredOrigins = origin.length > 0 ? items.filter((item) => origin.includes(<Origin>item.origin.toLowerCase())) : items;
  const filteredCategories = categories.length > 0 ? items.filter((item) => categories.includes(item.category)) : items;
  const filteredRarity = rarity.length > 0 ? items.filter((item) => rarity.includes(getRarityString(item.rarity))) : items;
  const filteredColors = colors ? items.filter((item) => item.colors.includes(colors)) : items;
  const equipped = equippedTo ? items.filter((item) => item.equippedTo === equippedTo) : items;
  const itemsForSale = forSale ? items.filter((item) => item.forSale) : items;

  const filteredItems = items.filter(
    (item) =>
      filteredOrigins.includes(item) &&
      filteredCategories.includes(item) &&
      filteredRarity.includes(item) &&
      filteredColors.includes(item) &&
      equipped.includes(item) &&
      itemsForSale.includes(item),
  );

  // Sorting the filtered items
  return sortItems(sort, filteredItems);
};

export const useFilterItemsInShop = (items: ItemInMarket[]): ItemInMarket[] => {
  const { origin, categories, rarity, price, colors, sort, equippedTo, forSale } = useFilters();
  if (items.length === 0) return [];

  const filteredOrigins = origin.length > 0 ? items.filter((item) => origin.includes(<Origin>item.item.origin.toLowerCase())) : items;
  const filteredCategories = categories.length > 0 ? items.filter((item) => categories.includes(item.item.category)) : items;
  const filteredRarity = rarity.length > 0 ? items.filter((item) => rarity.includes(getRarityString(item.item.rarity))) : items;
  const filteredColors = colors ? items.filter((item) => item.item.colors.includes(colors)) : items;
  const filteredPrice = price ? items.filter(({ sell }) => Number(sell.price) > price.min && Number(sell.price) < price.max) : items;
  const equipped = equippedTo ? items.filter((item) => item.item.equippedTo === equippedTo) : items;
  const itemsForSale = forSale ? items.filter((item) => item.item.forSale) : items;

  const filteredItems = items.filter(
    (item) =>
      filteredOrigins.includes(item) &&
      filteredCategories.includes(item) &&
      filteredRarity.includes(item) &&
      filteredPrice.includes(item) &&
      filteredColors.includes(item) &&
      equipped.includes(item) &&
      itemsForSale.includes(item),
  );

  return sortItemsMarket(sort, filteredItems); // Make sure to define sortItemsMarket function
};

export const useFilterCharacters = (characters: (ExtendedCharacter | ExtendedCharacterBackend)[]): ExtendedCharacter[] => {
  const { origin, title, sort } = useFilters();
  if (characters.length === 0) return []; // Return empty array if there are no items to filter

  const filteredOrigins =
    origin.length > 0 ? characters.filter((character) => origin.includes(<Origin>character.nft.origin.toLowerCase())) : characters;
  const filteredTitles = title.length > 0 ? characters.filter((character) => title.includes(character.nft.title)) : characters;

  const filteredCharacters = characters.filter((character) => filteredOrigins.includes(character) && filteredTitles.includes(character));

  return sortCharacters(sort, filteredCharacters);
};

// TODO: to update
export const filterCharactersMarket = (
  characters: CharacterInMarket[],
  { titles, origins, sort, price }: CharacterFilters,
): CharacterInMarket[] => {
  if (characters.length === 0) return [];

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
