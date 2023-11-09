import { CharacterInMarket, ExtendedCharacter, Item, ItemInMarket, Origin, Title } from "../interfaces";
import { sortCharacters, sortCharactersMarket, sortItems, sortItemsMarket } from "./sort";
import { getRarityString } from "../service";
import { useFilters } from "../context/filter-context";
import { ISTTouIST } from "./math";

export interface OfferFilters {
  description?: string;
  status?: string;
}

export const useFilterItems = (items: Item[]): Item[] => {
  const { origin, categories, rarity, colors, sort, equippedTo, forSale } = useFilters();
  if (items.length === 0) return [];

  const filteredOrigins = origin.length > 0 ? items.filter((item) => item && origin.includes(<Origin>item.origin.toLowerCase())) : items;
  const filteredCategories = categories.length > 0 ? items.filter((item) => item && categories.includes(item.category)) : items;
  const filteredRarity = rarity.length > 0 ? items.filter((item) => item && rarity.includes(getRarityString(item.rarity))) : items;
  const filteredColors = colors ? items.filter((item) => item && item.colors.includes(colors)) : items;
  const equipped = equippedTo ? items.filter((item) => item && item.equippedTo === equippedTo) : items;
  const itemsForSale = forSale ? items.filter((item) => item && item.forSale) : items;

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
  const { origin, categories, rarity, itemPrice, colors, sort } = useFilters();
  if (items.length === 0) return [];
  const priceFilterRange = {
    max: ISTTouIST(itemPrice.max),
    min: ISTTouIST(itemPrice.min)
  }
  const filteredOrigins = origin.length > 0 ? items.filter((item) => origin.includes(<Origin>item.item.origin.toLowerCase())) : items;
  const filteredCategories = categories.length > 0 ? items.filter((item) => categories.includes(item.item.category)) : items;
  const filteredRarity = rarity.length > 0 ? items.filter((item) => rarity.includes(getRarityString(item.item.rarity))) : items;
  const filteredColors = colors ? items.filter((item) => item.item.colors.includes(colors)) : items;
  const filteredPrice = itemPrice
    ? items.filter(({ sell }) => {
        const priceValue = Number(sell.price + sell.royalty + sell.platformFee);
        return priceValue >= priceFilterRange.min && priceValue <= priceFilterRange.max;
      })
    : items;

  const filteredItems = items.filter(
    (item) =>
      filteredOrigins.includes(item) &&
      filteredCategories.includes(item) &&
      filteredRarity.includes(item) &&
      filteredPrice.includes(item) &&
      filteredColors.includes(item),
  );

  return sortItemsMarket(sort, filteredItems); // Make sure to define sortItemsMarket function
};

export const useFilterCharacters = (characters: ExtendedCharacter[]): ExtendedCharacter[] => {
  const { origin, title, sort } = useFilters();
  if (characters.length === 0) return []; // Return empty array if there are no items to filter

  const filteredOrigins =
    origin.length > 0 ? characters.filter((character) => origin.includes(<Origin>character.nft.origin.toLowerCase())) : characters;
  const filteredTitles =
    title.length > 0 ? characters.filter((character) => title.includes(<Title>character.nft.title.toLowerCase())) : characters;
  const filteredCharacters = characters.filter((character) => filteredOrigins.includes(character) && filteredTitles.includes(character));

  return sortCharacters(sort, filteredCharacters);
};

export const useFilterCharactersMarket = (characters: CharacterInMarket[]): CharacterInMarket[] => {
  const { origin, title, sort, characterPrice } = useFilters();
  if (characters.length === 0) return [];

  const priceFilterRange = {
    max: ISTTouIST(characterPrice.max),
    min: ISTTouIST(characterPrice.min)
  }
  const filteredOrigins =
  origin.length > 0 ? characters.filter((character) => origin.includes(<Origin>character.character.origin.toLowerCase())) : characters;
  const filteredTitles = title.length > 0 ? characters.filter((character) => title.includes(character.character.title)) : characters;
  const filteredPrice = characterPrice
  ? characters.filter(({ sell }) => {
    const priceValue = Number(sell.price + sell.royalty + sell.platformFee);
    return priceValue >= priceFilterRange.min && priceValue <= priceFilterRange.max;
      })
    : characters;

  const filteredCharacters = characters.filter(
    (character) => filteredOrigins.includes(character) && filteredTitles.includes(character) && filteredPrice.includes(character),
  );

  return sortCharactersMarket(sort, filteredCharacters);
};
