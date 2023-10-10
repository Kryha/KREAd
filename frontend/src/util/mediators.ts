import { CharacterItems, ExtendedCharacter, Item, ItemInMarket } from "../interfaces";

//TODO: ARE WE STILL USING THIS FOR ITEMS?

export const mediate = {
  items: {
    toFront: (backendItems: Item[]): Item[] => {
      return backendItems.map((backendItem) => {
        return { ...backendItem, id: String(backendItem.name) };
      });
    },
    toBack: (frontendItems: Item[]): Item[] => {
      return frontendItems.map((frontendItem) => {
        return { ...frontendItem, id: BigInt(frontendItem.name) };
      });
    },
  },
  itemsMarket: {
    toFront: (
      backendItems: {
        item: Item;
        sell: { price: bigint };
      }[],
    ): ItemInMarket[] => {
      return [];
      // backendItems.map((backendItem) => {
      //   return {
      //     ...backendItem,
      //     id: String(backendItem.name),
      //     item: mediate.items.toFront([backendItem.item])[0],
      //   };
      // });
    },
    toBack: (frontendItems: ItemInMarket[]): ItemInMarket[] => {
      return [];
      // frontendItems.map((frontendItem) => {
      //   return {
      //     ...frontendItem,
      //     id: BigInt(frontendItem.id),
      //     item: mediate.items.toBack([frontendItem.item])[0],
      //   };
      // });
    },
  },
  characters: {
    toFront: (backendCharacters: ExtendedCharacter[]): ExtendedCharacter[] => {
      return backendCharacters.map((backendCharacter) => {
        return {
          ...backendCharacter,
          nft: { ...backendCharacter.nft, id: backendCharacter.nft.id },
        };
      });
    },
    toBack: (frontendCharacters: ExtendedCharacter[]): ExtendedCharacter[] => {
      return frontendCharacters.map((frontendCharacter) => {
        return {
          ...frontendCharacter,
          nft: {
            ...frontendCharacter.nft,
            id: Number(frontendCharacter.nft.id),
          },
        };
      });
    },
  },
  // charactersMarket: {
  //   toFront: (
  //     backendCharacters: {
  //       character: KreadCharacterInMarket;
  //       equippedItems: CharacterItems;
  //     }[],
  //   ): CharacterInMarket[] => {
  //     return backendCharacters.map(({ character, equippedItems }) => {
  //       return {
  //         ...character,
  //         id: String(character.id),
  //         character: { ...character.object, id: String(character.object.id) },
  //         equippedItems,
  //         sell: {
  //           ask:
  //         }
  //       };
  //     });
  //   },
  //   toBack: (frontendCharacters: CharacterInMarket[]): CharacterInMarketBackend[] => {
  //     return frontendCharacters.map((frontendCharacter) => {
  //       const { equippedItems: _, ...rest } = frontendCharacter;

  //       return {
  //         ...rest,
  //         id: BigInt(rest.id),
  //         character: { ...rest.character, id: BigInt(rest.id) },
  //       };
  //     });
  //   },
  // },
};

export const itemArrayToObject = (itemsArray: Item[]): CharacterItems => {
  return {
    perk1: itemsArray.find((i) => i.category === "perk1"),
    patch: itemsArray.find((i) => i.category === "patch"),
    mask: itemsArray.find((i) => i.category === "mask"),
    headPiece: itemsArray.find((i) => i.category === "headPiece"),
    hair: itemsArray.find((i) => i.category === "hair"),
    filter1: itemsArray.find((i) => i.category === "filter1"),
    filter2: itemsArray.find((i) => i.category === "filter2"),
    background: itemsArray.find((i) => i.category === "background"),
    perk2: itemsArray.find((i) => i.category === "perk2"),
    garment: itemsArray.find((i) => i.category === "garment"),
  };
};
