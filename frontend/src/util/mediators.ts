import { Character, CharacterBackend, Item, ItemBackend } from "../interfaces";

export const mediate = {
  items: {
    toFront: (backendItems: ItemBackend[]): Item[] => {
      return backendItems.map((backendItem) => {
        return { ...backendItem, id: String(backendItem.id) };
      });
    },
    toback: (frontendItems: Item[]): ItemBackend[] => {
      return frontendItems.map((frontendItem) => {
        return { ...frontendItem, id: BigInt(frontendItem.id) };
      });
    },
  },
  characters: {
    toFront: (backendCharacters: CharacterBackend[]): Character[] => {
      return backendCharacters.map((backendCharacter) => {
        return { ...backendCharacter, id: String(backendCharacter.id) };
      });
    },
    toback: (frontendCharacters: Character[]): CharacterBackend[] => {
      return frontendCharacters.map((frontendCharacter) => {
        return { ...frontendCharacter, id: BigInt(frontendCharacter.id) };
      });
    },
  },
};
