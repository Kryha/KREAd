/// <reference types="ses"/>
import { mediate } from "../util";
import { CharacterBackend, ExtendedCharacterBackend, Item } from "../interfaces";
import { itemCategories } from "./util";
import { fetchFromVStorage } from "./storage-node/fetch-from-vstorage";

export const extendCharacters = async (
  characters: CharacterBackend[],
  marshaller: any
): Promise<{ extendedCharacters: ExtendedCharacterBackend[]; equippedItems: Item[] }> => {
  const equippedCharacterItems: Item[] = [];

  const charactersWithItems: ExtendedCharacterBackend[] = await Promise.all(
    characters.map(async (character) => {
      const result = await fetchFromVStorage(marshaller, `data/published.kread.inventory-${character.name}`);

      const frontendEquippedItems = mediate.items.toFront(result.map((i: any) => i[0]));

      equippedCharacterItems.push(...frontendEquippedItems);
      const equipped: { [key: string]: Item | undefined } = {};
      itemCategories.forEach((category) => {
        equipped[category] = frontendEquippedItems.find((item: Item) => item.category === category);
      });

      return {
        nft: character,
        equippedItems: equipped,
      };
    })
  );

  return { extendedCharacters: charactersWithItems, equippedItems: equippedCharacterItems };
};
