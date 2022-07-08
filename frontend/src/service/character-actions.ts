/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { Purses, AgoricState } from "../interfaces/agoric.interfaces";
import { AmountMath } from "@agoric/ertp";

export const formOfferForCharacter = (purses: Purses, character: any) => ({
  want: {
    Asset: {
      pursePetname: purses.character[0].pursePetname,
      value: character,
    },
  },
  give: {
    Price: {
      pursePetname: purses.money[0].pursePetname,
      value: 10,
    },
  },
});
export const formOfferForCharacterAmount = (characterBrand: any, character: any, moneyBrand: any, price: bigint) => ({
  want: {
    Asset: AmountMath.make(characterBrand, [character]),
  },
  give: {
    Price: AmountMath.make(moneyBrand, price),
  },
});

export const mintNfts = async (service: AgoricState, name: string) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
    purses,
  } = service;
  if (!publicFacet || !walletP || !purses.money[0].pursePetname || !purses.character[0].pursePetname) {
    console.error("Could not make bid for character: undefined parameter");
    return;
  }

  const characterBrand = await E(publicFacet).getCharacterBrand();
  // const moneyBrand = await E(service.agoric.board).getValue(MONEY_BRAND_BOARD_ID);
  console.log(characterBrand);

  const invitation = await E(publicFacet).mintCharacterNFT();

  console.info("Invitation successful, sending to wallet for approval");

  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      want: {
        Asset: {
          pursePetname: service.purses.character[service.purses.character.length - 1].brandPetname,
          value: [{ name }],
        },
        InventoryKey: {
          pursePetname: service.purses.inventoryKey[service.purses.inventoryKey.length - 1].brandPetname,
          value: [{ name }],
        },
      },
    },
    dappContext: true,
  });
  return E(walletP).addOffer(offerConfig);
};
