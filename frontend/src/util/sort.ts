import { CharacterEquip, ItemEquip } from "../interfaces";

export const sortItems = (sorting: string, items: ItemEquip[]): ItemEquip[] => {
  switch (sorting) {
    case "atoz":
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case "lowestPrice":
      return items.sort((a, b) => a.price - b.price);
    case "highestPrice":
      return items.sort((a, b) => b.price - a.price);
    case "rarity":
      return items.sort((a, b) => b.rarity - a.rarity);
    case "latest":
      return items;
    default:
      return items;
  }
};

// TODO: check character sorting
export const sortCharacters = (sorting: string, characters: CharacterEquip[]): CharacterEquip[] => {
  switch (sorting) {
    case "atoz":
      return characters.sort((a, b) => a.nft.name.localeCompare(b.nft.name));
    // case "lowestPrice":
    //   return items.sort((a, b) => a.price - b.price);
    // case "highestPrice":
    //   return items.sort((a, b) => b.price - a.price);
    case "rarity":
      return characters.sort((a, b) => b.nft.level - a.nft.level);
    case "latest":
      return characters;
    default:
      return characters;
  }
};
