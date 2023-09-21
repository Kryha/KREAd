import { CharacterInMarket, ExtendedCharacter, Item, ItemInMarket } from "../interfaces";
import { getRarityString } from "../service";

export const sortItems = (sorting: string, items: Item[]): Item[] => {
  switch (sorting) {
    case "atoz":
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case "origin_sort":
      return items.sort((a, b) => a.origin.localeCompare(b.origin));
    case "category_sort":
      return items.sort((a, b) => a.category.localeCompare(b.category));
    case "rarity_sort":
      return items.sort((a, b) => getRarityString(a.rarity).localeCompare(getRarityString(b.rarity)));
    case "level":
      return items.sort((a, b) => b.level - a.level);
    default:
      return items;
  }
};

export const sortItemsMarket = (sorting: string, items: ItemInMarket[]): ItemInMarket[] => {
  switch (sorting) {
    case "atoz":
      return items.sort((a, b) => a.item.name.localeCompare(b.item.name));
    case "category_sort":
      return items.sort((a, b) => a.item.category.localeCompare(b.item.category));
    case "rarity_sort":
      return items.sort((a, b) => getRarityString(a.item.rarity).localeCompare(getRarityString(b.item.rarity)));
    case "lowestPrice":
      return items.sort((a, b) => Number(a.sell.price) - Number(b.sell.price));
    case "highestPrice":
      return items.sort((a, b) => Number(b.sell.price) - Number(a.sell.price));
    case "level":
      return items.sort((a, b) => b.item.level - a.item.level);
    default:
      return items;
  }
};

export const sortCharacters = (sorting: string, characters: (ExtendedCharacter | ExtendedCharacter)[]): ExtendedCharacter[] => {
  switch (sorting) {
    case "atoz":
      return characters.sort((a, b) => a.nft.name.localeCompare(b.nft.name));
    case "level":
      return characters.sort((a, b) => b.nft.level - a.nft.level);
    case "title_sort":
      return characters.sort((a, b) => a.nft.title.localeCompare(b.nft.title));
    case "origin_sort":
      return characters.sort((a, b) => a.nft.origin.localeCompare(b.nft.origin));
    case "latest":
      return characters.sort((a, b) => b.nft.date - a.nft.date);
    default:
      return characters;
  }
};

export const sortCharactersMarket = (sorting: string, characters: CharacterInMarket[]): CharacterInMarket[] => {
  switch (sorting) {
    case "atoz":
      return characters.sort((a, b) => a.character.name.localeCompare(b.character.name));
    case "lowestPrice":
      return characters.sort((a, b) => Number(a.sell.price) - Number(b.sell.price));
    case "highestPrice":
      return characters.sort((a, b) => Number(b.sell.price) - Number(a.sell.price));
    case "level":
      return characters.sort((a, b) => b.character.level - a.character.level);
    case "latest":
      return characters.sort((a, b) => b.character.date - a.character.date);
    default:
      return characters;
  }
};
