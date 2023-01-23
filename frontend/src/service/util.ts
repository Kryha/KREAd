import { AmountMath } from "@agoric/ertp";
import { Character, CharacterBackend, ExtendedCharacter, Item, ItemCategory } from "../interfaces";
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
export const formOfferForCharacter = (characterBrand: any, character: any, moneyBrand?: any, price?: bigint) => ({
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
  return characters.find(c => c.nft.name === name);
};

export const getCharacterKeys = (characterName: string, characterPurse: CharacterBackend[]): { ownedCharacterKey: CharacterBackend, wantedCharacterKey: CharacterBackend } => {
  const ownedCharacterKey = characterPurse.find(character => character.name === character.name);
  
  if (!ownedCharacterKey) throw `Could not find character (${characterName}) in wallet`;
  
  const wantedCharacterKey: CharacterBackend = { ...ownedCharacterKey, keyId: ownedCharacterKey.keyId === 1 ? 2 : 1 };

  return { ownedCharacterKey, wantedCharacterKey };
};
