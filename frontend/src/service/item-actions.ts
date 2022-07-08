/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { AgoricState } from "../interfaces/agoric.interfaces";

export const mintItem = async (service: AgoricState, item?: any, price?: bigint) => {
  const { agoric: { walletP }, contracts: { characterBuilder: { publicFacet } }, purses } = service;
  if (!publicFacet || !walletP || !purses.item[0].pursePetname) {
    console.error("undefined parameter");
    return;
  }

  const characterBrand = await E(publicFacet).getItemBrand();
  // const moneyBrand = await E(service.agoric.board).getValue(MONEY_BRAND_BOARD_ID);
  console.log(characterBrand);
  const config = await E(publicFacet).getConfig();
  console.log(config);
  const defaultItems = Object.values(config.defaultItems);  
  const itemsToMint = item || defaultItems;

  const uniqueItems = itemsToMint.map((item: any)=>({...item, id: new Date().toUTCString()}));
  console.log(uniqueItems);

  const invitation = await E(publicFacet).mintItemNFT();

  console.info("Invitation successful, sending to wallet for approval");
  
  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      want: {
        Item: {
          pursePetname: service.purses.item[service.purses.item.length-1].brandPetname,
          value: uniqueItems,
        },
      },
    },
    dappContext: true,
  });
  return E(walletP).addOffer(offerConfig);
};

export const addToInventory = async (service: AgoricState, item: any, price?: bigint) => {
  const { agoric: { walletP }, contracts: { characterBuilder: { publicFacet } }, purses } = service;
  const itemPurse = service.purses.item[service.purses.item.length - 1];
  const characterPurse = service.purses.character[service.purses.character.length - 1];
  const character = characterPurse.value[0];

  const wantedCharacter = { ...character, id: character.id===1 ? 2 : 1};

  if (!publicFacet || !walletP || !itemPurse || !wantedCharacter) {
    console.error("undefined parameter");
    return;
  }
  // const characterBrand = await E(publicFacet).getItemBrand();
  // const moneyBrand = await E(service.agoric.board).getValue(MONEY_BRAND_BOARD_ID);
  

  const invitation = await E(publicFacet).equip();

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
        InventoryKey1: {
          pursePetname: characterPurse.brandPetname,
          value: [character],
        },
      },
      want: {
        InventoryKey2: {
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


export const removeFromInventory = async (service: AgoricState, item: any, price?: bigint) => {
  const { agoric: { walletP }, contracts: { characterBuilder: { publicFacet } }, purses } = service;
  const itemPurse = service.purses.item[service.purses.item.length - 1];
  const characterPurse = service.purses.character[service.purses.character.length - 1];
  const character = characterPurse.value[0];

  const wantedCharacter = { ...character, id: character.id===1 ? 2 : 1};

  if (!publicFacet || !walletP || !itemPurse || !characterPurse) {
    console.error("undefined parameter");
    return;
  }
  // const characterBrand = await E(publicFacet).getItemBrand();
  // const moneyBrand = await E(service.agoric.board).getValue(MONEY_BRAND_BOARD_ID);
  

  const invitation = await E(publicFacet).unequip();

  console.info("Invitation successful, sending to wallet for approval");

  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      give: {
        InventoryKey1: {
          pursePetname: characterPurse.brandPetname,
          value: [character],
        },
      },
      want: {
        Item: {
          pursePetname: itemPurse.brandPetname,
          value: [item],
        },
        InventoryKey2: {
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
