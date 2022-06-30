/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { MONEY_DECIMALS, SUCCESSFUL_MINT_REPONSE_MSG } from "../constants";
import { Purses, ServiceState } from "../context/agoric";
import { AmountMath } from "@agoric/ertp";
import dappConstants from "../service/conf/defaults";
// import installationConstants from "../service/conf/installation-constants-nft-maker.js";

const {
  brandBoardIds: {
    Money: MONEY_BRAND_BOARD_ID,
  },
} = dappConstants;

export const mintItem = async (service: ServiceState, item: any, price?: bigint) => {
  const { agoric: { walletP }, contracts: { characterBuilder: { publicFacet } }, purses } = service;
  if (!publicFacet || !walletP || !purses.item[0].pursePetname) {
    console.error("Could not make bid for character: undefined parameter");
    return;
  }

  const characterBrand = await E(publicFacet).getItemBrand();
  // const moneyBrand = await E(service.agoric.board).getValue(MONEY_BRAND_BOARD_ID);
  console.log(characterBrand);
  const { defaultItems } = await E(publicFacet).getConfig();
  
  const invitation = await E(publicFacet).mintItemNFT();

  console.info("Invitation successful, sending to wallet for approval");
  
  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      want: {
        Item: {
          pursePetname: service.purses.item[0].brandPetname,
          value: [defaultItems],
        },
      },
    },
    dappContext: true,
  });
  return E(walletP).addOffer(offerConfig);
};
