import {
  CharacterInMarket,
  CharacterInMarketBackend,
  CharacterItems,
  ExtendedCharacter,
  ExtendedCharacterBackend,
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
    toFront: (backendItems: { item: ItemBackend; sell: { price: bigint }; id: number }[]): ItemInMarket[] => {
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
    toFront: (backendCharacters: ExtendedCharacterBackend[]): ExtendedCharacter[] => {
      return backendCharacters.map((backendCharacter) => {
        return { ...backendCharacter, nft: { ...backendCharacter.nft, id: String(backendCharacter.nft.id) } };
      });
    },
    toBack: (frontendCharacters: ExtendedCharacter[]): ExtendedCharacterBackend[] => {
      return frontendCharacters.map((frontendCharacter) => {
        return { ...frontendCharacter, nft: { ...frontendCharacter.nft, id: BigInt(frontendCharacter.nft.id) } };
      });
    },
  },
  charactersMarket: {
    toFront: (backendCharacters: { character: CharacterInMarketBackend; equippedItems: CharacterItems }[]): CharacterInMarket[] => {
      return backendCharacters.map(({ character, equippedItems }) => {
        return {
          ...character,
          id: String(character.id),
          character: { ...character.character, id: String(character.id) },
          equippedItems,
        };
      });
    },
    toBack: (frontendCharacters: CharacterInMarket[]): CharacterInMarketBackend[] => {
      return frontendCharacters.map((frontendCharacter) => {
        const { equippedItems: _, ...rest } = frontendCharacter;

        return {
          ...rest,
          id: BigInt(rest.id),
          character: { ...rest.character, id: BigInt(rest.id) },
        };
      });
    },
  },
};

export const itemArrayToObject = (itemsArray: Item[]): CharacterItems => {
  return {
    noseline: itemsArray.find((i) => i.category === "noseline"),
    midBackground: itemsArray.find((i) => i.category === "midBackground"),
    mask: itemsArray.find((i) => i.category === "mask"),
    headPiece: itemsArray.find((i) => i.category === "headPiece"),
    hair: itemsArray.find((i) => i.category === "hair"),
    airReservoir: itemsArray.find((i) => i.category === "airReservoir"),
    liquid: itemsArray.find((i) => i.category === "liquid"),
    background: itemsArray.find((i) => i.category === "background"),
    frontMask: itemsArray.find((i) => i.category === "frontMask"),
    clothing: itemsArray.find((i) => i.category === "clothing"),
  };
};
