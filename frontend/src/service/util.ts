import { AmountMath } from "@agoric/ertp";
import { Character, ExtendedCharacter, Item, ItemCategory } from "../interfaces";
import { Purses } from "../interfaces/agoric.interfaces";

export const formOfferForItem = (purses: Purses, item: any) => ({
  want: {
    Item: {
      pursePetname: purses.character[0].pursePetname,
      value: item,
    },
  },
  // give: {
  //   Price: {
  //     pursePetname: purses.money[0].pursePetname,
  //     value: 10,
  //   },
  // },
});
export const formOfferForCharacter = (characterBrand: any, character: any, moneyBrand: any, price: bigint) => ({
  want: {
    Asset: AmountMath.make(characterBrand, [character]),
  },
  // give: {
  //   Price: AmountMath.make(moneyBrand, price),
  // },
});

export const formatIdAsNumber = (obj: Character | Item) => ({ ...obj, id: BigInt(obj.id) });

export const itemCategories: ItemCategory[] = ["noseline", "midBackground", "mask", "headPiece", "hair", "frontMask", "liquid", "background", "airReservoir", "clothing"];

export const getExtendedCharacter = (name: string, characters: ExtendedCharacter[]): ExtendedCharacter | undefined => {
  console.log(characters.find(c => c.nft.name === name));
  return characters.find(c => c.nft.name === name);
};
