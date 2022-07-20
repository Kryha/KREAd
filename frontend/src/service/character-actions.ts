/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { AmountMath } from "@agoric/ertp";

import dappConstants from "../service/conf/defaults";
import { Purses, AgoricState } from "../interfaces/agoric.interfaces";
import { inter } from "../util";

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

  const invitation = await E(publicFacet).makeMintCharacterInvitation();

  console.info("Invitation successful, sending to wallet for approval");

  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      want: {
        Asset: {
          pursePetname: service.purses.character[service.purses.character.length - 1].pursePetname,
          value: [{ name }],
        },
      },
    },
    dappContext: true,
  });
  return E(walletP).addOffer(offerConfig);
};

export const sellCharacter = async (service: AgoricState, character: any, price: bigint) => {
  const {
    contracts: {
      characterBuilder: { publicFacet },
    },
    agoric: { walletP, board, zoe },
    purses,
  } = service;

  if (!publicFacet) return;

  const characterPurse = purses.character[purses.character.length - 1];
  const moneyPurse = purses.money[purses.money.length - 1];

  if (!characterPurse || !moneyPurse) return;

  const sellItemsInstallation = await E(board).getValue(dappConstants.SELL_ITEMS_INSTALLATION_BOARD_ID);
  const characterIssuer = await E(publicFacet).getCharacterIssuer();
  const { moneyIssuer } = await E(publicFacet).getConfig();

  const issuerKeywordRecord = harden({
    Items: characterIssuer,
    Money: moneyIssuer,
  });

  const brandKeywordRecord = harden({
    Items: characterPurse.brand,
    Money: moneyPurse.brand,
  });

  const sellItemsTerms = harden({
    pricePerItem: { value: price, brand: moneyPurse.brand },
    issuers: issuerKeywordRecord,
    brands: brandKeywordRecord,
  });

  const {
    creatorInvitation,
    instance,
    publicFacet: sellItemsPublicFacet,
  } = await E(zoe).startInstance(sellItemsInstallation, issuerKeywordRecord, sellItemsTerms);

  await E(walletP).addOffer(
    harden({
      id: Date.now().toString(),
      invitation: creatorInvitation,
      proposalTemplate: {
        want: {
          Money: {
            pursePetname: moneyPurse.pursePetname,
            value: inter(price),
          },
        },
        give: {
          Items: {
            pursePetname: characterPurse.pursePetname,
            value: [character],
          },
        },
      },
      dappContext: true,
    })
  );

  const characterInMarket = {
    ...character,
    sell: { instance, publicFacet: sellItemsPublicFacet, price },
  };

  // TODO: store in market after offer is accepted and processed
  await E(publicFacet).storeCharacterInMarket(characterInMarket);
};

export const buyCharacter = async (service: AgoricState, characterInMarket: any) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
    purses,
  } = service;

  if (!publicFacet || !walletP) return;

  const characterPurse = purses.character[purses.character.length - 1];
  const moneyPurse = purses.money[purses.money.length - 1];

  if (!characterPurse || !moneyPurse) return;

  const { sell, ...character } = characterInMarket;

  const invitation = await E(sell.publicFacet).makeBuyerInvitation();

  await E(walletP).addOffer(
    harden({
      id: Date.now().toString(),
      invitation,
      proposalTemplate: {
        want: {
          Items: {
            pursePetname: characterPurse.pursePetname,
            value: [character],
          },
        },
        give: {
          Money: {
            pursePetname: moneyPurse.pursePetname,
            value: inter(sell.price),
          },
        },
      },
      dappContext: true,
    })
  );

  // TODO: remove character from market after offer is accepted and processed
  await E(publicFacet).removeCharacterFromMarket(characterInMarket.id);
};
