/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { MONEY_DECIMALS, SUCCESSFUL_MINT_REPONSE_MSG } from "../constants";
import { Purses, ServiceState } from "../context/agoric";
import { AmountMath } from "@agoric/ertp";
import dappConstants from "../service/conf/defaults";
import { AgoricState } from "../interfaces/agoric.interfaces";
// import installationConstants from "../service/conf/installation-constants-nft-maker.js";

const {
  brandBoardIds: {
    Money: MONEY_BRAND_BOARD_ID,
  },
} = dappConstants;

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
  if (!publicFacet || !walletP || !service.purses.item[service.purses.item.length-1]) {
    console.error("undefined parameter");
    return;
  }

  // const characterBrand = await E(publicFacet).getItemBrand();
  // const moneyBrand = await E(service.agoric.board).getValue(MONEY_BRAND_BOARD_ID);
  

  const invitation = await E(publicFacet).addToInventory();

  console.info("Invitation successful, sending to wallet for approval");
  
  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      give: {
        Item: {
          pursePetname: service.purses.item[service.purses.item.length-1].brandPetname,
          value: [item],
        },
      },
    },
    dappContext: true,
  });
  return E(walletP).addOffer(offerConfig);
};


export const removeFromInventory = async (service: AgoricState, item: any, price?: bigint) => {
  const { agoric: { walletP }, contracts: { characterBuilder: { publicFacet } }, purses } = service;
  if (!publicFacet || !walletP || !service.purses.item[service.purses.item.length-1]) {
    console.error("undefined parameter");
    return;
  }

  // const characterBrand = await E(publicFacet).getItemBrand();
  // const moneyBrand = await E(service.agoric.board).getValue(MONEY_BRAND_BOARD_ID);
  

  const invitation = await E(publicFacet).removeFromInventory();

  console.info("Invitation successful, sending to wallet for approval");
  
  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      want: {
        Item: {
          pursePetname: service.purses.item[service.purses.item.length-1].brandPetname,
          value: [item],
        },
      },
    },
    dappContext: true,
  });
  return E(walletP).addOffer(offerConfig);
};

export const addToInventoryContinued = async (service: AgoricState, item: any, price?: bigint) => {
  const { agoric: { walletP }, contracts: { characterBuilder: { publicFacet } }, purses } = service;
  if (!publicFacet || !walletP || !service.purses.item[service.purses.item.length-1]) {
    console.error("undefined parameter");
    return;
  }

  // const characterBrand = await E(publicFacet).getItemBrand();
  // const moneyBrand = await E(service.agoric.board).getValue(MONEY_BRAND_BOARD_ID);
  

  const invitation = await E(publicFacet).addToInventoryContinued();

  console.info("Invitation successful, sending to wallet for approval");
  
  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      give: {
        Item: {
          pursePetname: service.purses.item[service.purses.item.length-1].brandPetname,
          value: [item],
        },
      },
    },
    dappContext: true,
  });
  return E(walletP).addOffer(offerConfig);
};