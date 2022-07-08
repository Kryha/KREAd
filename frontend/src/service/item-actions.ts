/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
// import { MONEY_DECIMALS, SUCCESSFUL_MINT_REPONSE_MSG } from "../constants";
// import { Purses, ServiceState } from "../context/agoric";
// import { AmountMath } from "@agoric/ertp";
// import dappConstants from "../service/conf/defaults";
import { AgoricState } from "../interfaces/agoric.interfaces";
// import installationConstants from "../service/conf/installation-constants-nft-maker.js";

// const {
//   brandBoardIds: {
//     Money: MONEY_BRAND_BOARD_ID,
//   },
// } = dappConstants;

export const mintItem = async (service: AgoricState, item?: any, price?: bigint) => {
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
  // const moneyBrand = await E(service.agoric.board).getValue(MONEY_BRAND_BOARD_ID);
  console.log(characterBrand);
  const config = await E(publicFacet).getConfig();
  console.log(config);
  const defaultItems = Object.values(config.defaultItems);
  const itemsToMint = item || defaultItems;

  const uniqueItems = itemsToMint.map((item: any) => ({ ...item, id: new Date().toUTCString() }));
  console.log(uniqueItems);

  const invitation = await E(publicFacet).mintItemNFT();

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

export const addToInventory = async (service: AgoricState, item: any, price?: bigint) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
    purses,
  } = service;
  const itemPurse = purses.item[service.purses.item.length - 1];
  const inventoryKeyPurse = purses.inventoryKey[purses.inventoryKey.length - 1];
  const inventoryKey = inventoryKeyPurse.value[0];
  const wantedInventoryKey = { ...inventoryKey, id: inventoryKey.id === 1 ? 2 : 1 };
  console.log(inventoryKeyPurse, inventoryKey, wantedInventoryKey);

  if (!publicFacet || !walletP || !itemPurse || !inventoryKeyPurse) {
    console.error("undefined parameter");
    return;
  }
  // const characterBrand = await E(publicFacet).getItemBrand();
  // const moneyBrand = await E(service.agoric.board).getValue(MONEY_BRAND_BOARD_ID);

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
        InventoryKey1: {
          pursePetname: inventoryKeyPurse.brandPetname,
          value: [inventoryKey],
        },
      },
      want: {
        InventoryKey2: {
          pursePetname: inventoryKeyPurse.brandPetname,
          value: [wantedInventoryKey],
        },
      },
    },
    dappContext: true,
  });
  console.log(offerConfig);
  return E(walletP).addOffer(offerConfig);
};

export const removeFromInventory = async (service: AgoricState, item: any) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
    purses,
  } = service;
  const itemPurse = purses.item[purses.item.length - 1];
  const inventoryKeyPurse = purses.inventoryKey[purses.inventoryKey.length - 1];
  const inventoryKey = inventoryKeyPurse.value[0];
  const wantedInventoryKey = { ...inventoryKey, id: inventoryKey.id === 1 ? 2 : 1 };

  console.log(inventoryKeyPurse, inventoryKey);

  if (!publicFacet || !walletP || !itemPurse || !inventoryKeyPurse) {
    console.error("undefined parameter");
    return;
  }
  // const characterBrand = await E(publicFacet).getItemBrand();
  // const moneyBrand = await E(service.agoric.board).getValue(MONEY_BRAND_BOARD_ID);

  const invitation = await E(publicFacet).makeUnequipInvitation();

  console.info("Invitation successful, sending to wallet for approval");

  // TODO: Replace inventoryKey for actual Character NLF
  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      give: {
        InventoryKey1: {
          pursePetname: inventoryKeyPurse.brandPetname,
          value: [inventoryKey],
        },
      },
      want: {
        Item: {
          pursePetname: itemPurse.brandPetname,
          value: [item],
        },
        InventoryKey2: {
          pursePetname: inventoryKeyPurse.brandPetname,
          value: [wantedInventoryKey],
        },
      },
    },
    dappContext: true,
  });
  console.log(offerConfig);
  return E(walletP).addOffer(offerConfig);
};

export const addToInventoryContinued = async (service: AgoricState, item: any) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
    purses,
  } = service;
  if (!publicFacet || !walletP || !purses.item[purses.item.length - 1]) {
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
          pursePetname: purses.item[purses.item.length - 1].brandPetname,
          value: [item],
        },
      },
    },
    dappContext: true,
  });
  return E(walletP).addOffer(offerConfig);
};
