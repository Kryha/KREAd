import { Character, CharacterBackend, ExtendedCharacter, ExtendedCharacterBackend, Item, ItemBackend } from "../interfaces";

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
    toFront: (backendCharacters: ExtendedCharacterBackend[]): ExtendedCharacter[] => {
      return backendCharacters.map((backendCharacter) => {
        return { ...backendCharacter, nft: { ...backendCharacter.nft, id: String(backendCharacter.nft.id) } };
      });
    },
    toback: (frontendCharacters: ExtendedCharacter[]): ExtendedCharacterBackend[] => {
      return frontendCharacters.map((frontendCharacter) => {
        return { ...frontendCharacter, nft: { ...frontendCharacter.nft, id: BigInt(frontendCharacter.nft.id) } };
      });
    },
  },
};
