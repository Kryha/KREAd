import { AmountMath } from "@agoric/ertp";
import { Purses } from "../context/agoric";

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