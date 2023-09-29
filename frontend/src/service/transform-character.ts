/// <reference types="ses"/>
import { Character, ExtendedCharacter, Item } from "../interfaces";
import { AgoricChainStoragePathKind as Kind } from "@agoric/rpc";
import { CATEGORY } from "../constants";
import { cidToUrl } from "../util/other";

export const extendCharacters = async (
  characters: Character[],
  chainStorageWatcher: any,
): Promise<{
  extendedCharacters: ExtendedCharacter[];
  equippedItems: Item[];
}> => {
  const equippedCharacterItems: Item[] = [];

  const charactersWithItems: ExtendedCharacter[] = await Promise.all(
    characters.map(async (character) => {
      const result = await chainStorageWatcher.queryOnce([Kind.Data, `published.kread.character.inventory-${character.name}`]);
      const frontendEquippedItems: Item[] = result.map((copyBag: [Item, bigint]) => ({
        ...copyBag[0],
        image: cidToUrl(copyBag[0].image),
        thumbnail: cidToUrl(copyBag[0].thumbnail),
        equippedTo: character.name,
        forSale: false,
      }));
      equippedCharacterItems.push(...frontendEquippedItems);
      const equipped: { [key: string]: Item | undefined } = {};
      for (const category of Object.keys(CATEGORY)) {
        equipped[category] = frontendEquippedItems.find((item: Item) => item.category === category);
      }

      return {
        nft: { ...character, image: cidToUrl(character.image) },
        equippedItems: equipped,
      };
    }),
  );

  return {
    extendedCharacters: charactersWithItems,
    equippedItems: equippedCharacterItems,
  };
};
