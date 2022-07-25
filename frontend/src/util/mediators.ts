import {
  Character,
  CharacterBackend,
  CharacterInMarket,
  CharacterInMarketBackend,
  Item,
  ItemBackend,
  ItemInMarket,
  ItemInMarketBackend,
} from "../interfaces";

export const mediate = {
  items: {
    toFront: (backendItems: ItemBackend[]): Item[] => {
      return backendItems.map((backendItem) => {
        return { ...backendItem, id: String(backendItem.id) };
      });
    },
    toBack: (frontendItems: Item[]): ItemBackend[] => {
      return frontendItems.map((frontendItem) => {
        return { ...frontendItem, id: BigInt(frontendItem.id) };
      });
    },
  },
  itemsMarket: {
    toFront: (backendItems: ItemInMarketBackend[]): ItemInMarket[] => {
      return backendItems.map((backendItem) => {
        return { ...backendItem, id: String(backendItem.id), item: mediate.items.toFront([backendItem.item])[0] };
      });
    },
    toBack: (frontendItems: ItemInMarket[]): ItemInMarketBackend[] => {
      return frontendItems.map((frontendItem) => {
        return { ...frontendItem, id: BigInt(frontendItem.id), item: mediate.items.toBack([frontendItem.item])[0] };
      });
    },
  },
  characters: {
    toFront: (backendCharacters: CharacterBackend[]): Character[] => {
      return backendCharacters.map((backendCharacter) => {
        return { ...backendCharacter, id: String(backendCharacter.id) };
      });
    },
    toBack: (frontendCharacters: Character[]): CharacterBackend[] => {
      return frontendCharacters.map((frontendCharacter) => {
        return { ...frontendCharacter, id: BigInt(frontendCharacter.id) };
      });
    },
  },
  charactersMarket: {
    toFront: (backendCharacters: CharacterInMarketBackend[]): CharacterInMarket[] => {
      return backendCharacters.map((backendCharacter) => {
        return {
          ...backendCharacter,
          id: String(backendCharacter.id),
          character: mediate.characters.toFront([backendCharacter.character])[0],
        };
      });
    },
    toBack: (frontendCharacters: CharacterInMarket[]): CharacterInMarketBackend[] => {
      return frontendCharacters.map((frontendCharacter) => {
        return {
          ...frontendCharacter,
          id: BigInt(frontendCharacter.id),
          character: mediate.characters.toBack([frontendCharacter.character])[0],
        };
      });
    },
  },
};
