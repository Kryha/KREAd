/// <reference types="ses"/>
import { E } from "@endo/eventual-send";

import dappConstants from "../service/conf/defaults";
import { AgoricState } from "../interfaces/agoric.interfaces";
import { inter } from "../util";

export const sellItem = async (service: AgoricState, item: any, price: bigint) => {
  const {
    contracts: {
      characterBuilder: { publicFacet },
    },
    agoric: { walletP, board, zoe },
    purses,
  } = service;

  if (!publicFacet) return;

  const itemPurse = purses.item[purses.item.length - 1];
  const moneyPurse = purses.money[purses.money.length - 1];

  if (!itemPurse || !moneyPurse) return;

  const sellItemsInstallation = await E(board).getValue(dappConstants.SELL_ITEMS_INSTALLATION_BOARD_ID);
  const itemIssuer = await E(publicFacet).getItemIssuer();
  const { moneyIssuer } = await E(publicFacet).getConfig();

  const issuerKeywordRecord = harden({
    Items: itemIssuer,
    Money: moneyIssuer,
  });

  const brandKeywordRecord = harden({
    Items: itemPurse.brand,
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
            pursePetname: itemPurse.pursePetname,
            value: [item],
          },
        },
      },
      dappContext: true,
    })
  );

  const itemInMarket = {
    ...item,
    sell: { instance, publicFacet: sellItemsPublicFacet, price },
  };

  // TODO: store in market after offer is accepted and processed
  await E(publicFacet).storeItemInMarket(itemInMarket);
};

export const buyItem = async (service: AgoricState, itemInMarket: any) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
    purses,
  } = service;

  if (!publicFacet || !walletP) return;

  const itemPurse = purses.item[purses.item.length - 1];
  const moneyPurse = purses.money[purses.money.length - 1];

  if (!itemPurse || !moneyPurse) return;

  const { sell, ...item } = itemInMarket;

  const invitation = await E(sell.publicFacet).makeBuyerInvitation();

  await E(walletP).addOffer(
    harden({
      id: Date.now().toString(),
      invitation,
      proposalTemplate: {
        want: {
          Items: {
            pursePetname: itemPurse.pursePetname,
            value: [item],
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

  // TODO: remove item from market after offer is accepted and processed
  await E(publicFacet).removeItemFromMarket(itemInMarket.id);
};

// TODO: Add price for minting // price?: bigint
export const mintItem = async (service: AgoricState, item?: any) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
    purses,
  } = service;
  if (!publicFacet || !walletP || !purses.item[0].pursePetname) {
    console.error("undefined parameter");
    return;
  }

  const characterBrand = await E(publicFacet).getItemBrand();
  console.log(characterBrand);
  const config = await E(publicFacet).getConfig();
  console.log(config);
  const defaultItems = Object.values(config.defaultItems);
  const itemsToMint = item || defaultItems;

  const uniqueItems = itemsToMint.map((item: any) => ({ ...item, id: new Date().toUTCString() }));
  console.log(uniqueItems);

  const invitation = await E(publicFacet).makeMintItemInvitation();

  console.info("Invitation successful, sending to wallet for approval");

  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      want: {
        Item: {
          pursePetname: service.purses.item[service.purses.item.length - 1].brandPetname,
          value: uniqueItems,
        },
      },
    },
    dappContext: true,
  });
  return E(walletP).addOffer(offerConfig);
};

// TODO: pass character as parameter to construct the proposal
export const addToInventory = async (service: AgoricState, item: any) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
  } = service;

  const itemPurse = service.purses.item[service.purses.item.length - 1];
  const characterPurse = service.purses.character[service.purses.character.length - 1];
  const character = characterPurse.value[0];
  const wantedCharacter = { ...character, id: character.id === 1 ? 2 : 1 };

  if (!publicFacet || !walletP || !itemPurse || !wantedCharacter) {
    console.error("undefined parameter");
    return;
  }

  const invitation = await E(publicFacet).makeEquipInvitation();

  console.info("Invitation successful, sending to wallet for approval");

  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      give: {
        Item: {
          pursePetname: itemPurse.brandPetname,
          value: [item],
        },
        CharacterKey1: {
          pursePetname: characterPurse.brandPetname,
          value: [character],
        },
      },
      want: {
        CharacterKey2: {
          pursePetname: characterPurse.brandPetname,
          value: [wantedCharacter],
        },
      },
    },
    dappContext: true,
  });
  console.log(offerConfig);
  return E(walletP).addOffer(offerConfig);
};

// TODO: pass character as parameter to construct the proposal
export const removeFromInventory = async (service: AgoricState, item: any) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
  } = service;

  const itemPurse = service.purses.item[service.purses.item.length - 1];
  const characterPurse = service.purses.character[service.purses.character.length - 1];
  const character = characterPurse.value[0];
  const wantedCharacter = { ...character, id: character.id === 1 ? 2 : 1 };

  if (!publicFacet || !walletP || !itemPurse || !characterPurse || !wantedCharacter) {
    console.error("undefined parameter");
    return;
  }

  const invitation = await E(publicFacet).makeUnequipInvitation();

  console.info("Invitation successful, sending to wallet for approval");

  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      give: {
        CharacterKey1: {
          pursePetname: characterPurse.brandPetname,
          value: [character],
        },
      },
      want: {
        Item: {
          pursePetname: itemPurse.brandPetname,
          value: [item],
        },
        CharacterKey2: {
          pursePetname: characterPurse.brandPetname,
          value: [wantedCharacter],
        },
      },
    },
    dappContext: true,
  });
  console.log(offerConfig);
  return E(walletP).addOffer(offerConfig);
};
