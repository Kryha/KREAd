import { AmountMath } from "@agoric/ertp";
import { E } from "@endo/eventual-send";
import { Character, ExtendedCharacter, Purses, TokenInfo } from "../interfaces";
import { makeCastingSpec, makeFollower, makeLeader } from "@agoric/casting";

//TODO: THIS FILE NOT BEING USED??
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

export const formatIdAsNumber = (obj: { [key: string]: any }) => ({
  ...obj,
  id: BigInt(obj.id),
});

export const getExtendedCharacter = (name: string, characters: ExtendedCharacter[]): ExtendedCharacter | undefined => {
  return characters.find((c) => c.nft.name === name);
};

export const getCharacterKeys = (
  characterName: string,
  characterPurse: Character[],
): {
  ownedCharacterKey: Character;
  wantedCharacterKey: Character;
} => {
  const ownedCharacterKey = characterPurse.find((character) => character.name === character.name);

  if (!ownedCharacterKey) throw `Could not find character (${characterName}) in wallet`;

  const wantedCharacterKey: Character = {
    ...ownedCharacterKey,
    keyId: ownedCharacterKey.keyId === 1 ? 2 : 1,
  };

  return { ownedCharacterKey, wantedCharacterKey };
};

export const getTokenInfo = async (kreadFacet: any, board: any): Promise<TokenInfo & { boardIds: TokenInfo }> => {
  const tokenInfo = await E(kreadFacet).getTokenInfo();

  const {
    character: { issuer: characterIssuer, brand: characterBrand },
    item: { issuer: itemIssuer, brand: itemBrand },
    paymentFT: { issuer: tokenIssuer, brand: tokenBrand },
  } = tokenInfo;

  const [
    CHARACTER_BRAND_BOARD_ID,
    CHARACTER_ISSUER_BOARD_ID,
    ITEM_BRAND_BOARD_ID,
    ITEM_ISSUER_BOARD_ID,
    TOKEN_BRAND_BOARD_ID,
    TOKEN_ISSUER_BOARD_ID,
  ] = await Promise.all([
    E(board).getId(characterBrand),
    E(board).getId(characterIssuer),
    E(board).getId(itemBrand),
    E(board).getId(itemIssuer),
    E(board).getId(tokenBrand),
    E(board).getId(tokenIssuer),
  ]);

  return {
    ...tokenInfo,
    boardIds: {
      characterBoard: {
        issuer: CHARACTER_ISSUER_BOARD_ID,
        brand: CHARACTER_BRAND_BOARD_ID,
      },
      item: { issuer: ITEM_ISSUER_BOARD_ID, brand: ITEM_BRAND_BOARD_ID },
      paymentFT: { issuer: TOKEN_ISSUER_BOARD_ID, brand: TOKEN_BRAND_BOARD_ID },
    },
  };
};

export const setupStorageNodeFollower = (AGORIC_RPC: string, STORAGE_NODE_SPEC: string): any => {
  const leader = makeLeader(AGORIC_RPC);
  const castingSpec = makeCastingSpec(STORAGE_NODE_SPEC);
  return makeFollower(castingSpec, leader);
};
