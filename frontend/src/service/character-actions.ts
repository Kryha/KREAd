/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { MONEY_DECIMALS, SUCCESSFUL_MINT_REPONSE_MSG } from "../constants";
import { Purses, ServiceState } from "../context/service";
import { AmountMath } from "@agoric/ertp";
import { CharacterDispatch } from "../context/characters";
// import dappConstants from "../service/conf/defaults";
// import installationConstants from "../service/conf/installation-constants-nft-maker.js";

const formBidOfferForCharacter = (invitation: any, character: any, purses: Purses, price: bigint) => ({
  // JSONable ID for this offer.  This is scoped to the origin.
  id: Date.now(),
  invitation,
  proposalTemplate: {
    want: {
      Asset: {
        pursePetname: purses.character[0].pursePetname,
        value: harden([character]),
      },
    },
    give: {
      Bid: {
        pursePetname: purses.money[0].pursePetname,
        value: price,
      },
    },
  },
});
export const formOfferForCharacter = (invitation: any, character: any, purses: Purses, price: bigint) => ({
  // JSONable ID for this offer.  This is scoped to the origin.
  id: Date.now(),
  invitation,
  proposalTemplate: {
    want: {
      Asset: {
        pursePetname: purses.character[0].pursePetname,
      },
    },
    give: {
      Price: {
        pursePetname: purses.money[0].pursePetname,
        value: 0,
      },
    },
  },
});

export const makeBidOfferForCharacter = async (service: ServiceState, auctionPublicFacet: any, character: any, price: bigint) => {
  const { agoric: { walletP }, purses } = service;
  if (!auctionPublicFacet || !walletP || !purses.money[0].pursePetname || !purses.character[0].pursePetname) {
    console.error("Could not make bid for character: undefined parameter");
    return;
  }
  const invitation = await E(auctionPublicFacet).makeBidInvitationForKey(character);
  console.info("Invitation successful, sending to wallet for approval");
  // Adjust based on Money Brand decimals
  const adjustedPrice = BigInt(price * BigInt(10 ** MONEY_DECIMALS));
  const offerConfig = formBidOfferForCharacter(invitation, character, purses, adjustedPrice);

  return E(walletP).addOffer(offerConfig);
};

export const makeOfferForCharacter = async (service: ServiceState, character: any, price: bigint) => {
  const { agoric: { walletP }, purses } = service;
  if (!service.contracts.characterBuilder.publicFacet || !walletP || !purses.money[0].pursePetname || !purses.character[0].pursePetname) {
    console.error("Could not make bid for character: undefined parameter");
    return;
  }
  const invitation = await E(service.contracts.characterBuilder.publicFacet).ge(character);
  console.info("Invitation successful, sending to wallet for approval");
  // Adjust based on Money Brand decimals
  const adjustedPrice = BigInt(price * BigInt(10 ** MONEY_DECIMALS));
  const offerConfig = formBidOfferForCharacter(invitation, character, purses, adjustedPrice);

  return E(walletP).addOffer(offerConfig);
};

export const mintCharacters = async (service: ServiceState, characters: any, price: bigint) => {
  const { contracts: { characterBuilder }, purses } = service;
  if (!characterBuilder.publicFacet || !purses.money[0].brand) {
    console.error("Could not mint characters: Public Facet or Purses undefined");
    return;
  }
  const pricePerNFT = AmountMath.make(purses.money[0].brand, price);
  const newCharacters = harden(characters);
  const mintResponse = await E(characterBuilder.publicFacet).auctionCharactersPublic(newCharacters, pricePerNFT);
  if (mintResponse.msg !== SUCCESSFUL_MINT_REPONSE_MSG) throw new Error("There was a problem minting the character");
  console.info(mintResponse.msg);
  return mintResponse;
};

export const mintAndBuy = async (service: ServiceState, characters: any) => {
  console.log(characters);
  assert(characters.length === 1, "mintAndBuy expects an array with a single character");
  const newCharacter = await mintCharacters(service, characters, 1n);
  if (newCharacter.msg !== SUCCESSFUL_MINT_REPONSE_MSG) throw new Error("There was a problem minting the character");
  console.info(newCharacter.msg);
  await makeBidOfferForCharacter(service, newCharacter.auction.publicFacet, newCharacter.character, 1n);
};

export const getCharacters = async (service: ServiceState, characterDispatch: CharacterDispatch) => {
  const { contracts: { characterBuilder } } = service;
  if (!characterBuilder.publicFacet) {
    console.error("Could not fetch Characters: Public Facet is undefined");
    return;
  }
  const nfts = await E(characterBuilder.publicFacet).getCharacterArray();
  console.info(`Fetched Characters from Contract: ${nfts.map((nft: any)=>nft.character.name)}`);
  characterDispatch({ type: "SET_CHARACTERS", payload: nfts });
};

// TODO: Remove if unused
// const { AUCTION_INSTALLATION_BOARD_ID } = installationConstants;
// const {
//   INSTANCE_BOARD_ID,
//   INSTANCE_NFT_MAKER_BOARD_ID,
//   AUCTION_ITEMS_INSTALLATION_BOARD_ID,
//   INVITE_BRAND_BOARD_ID,
//   INSTALLATION_BOARD_ID,
//   issuerBoardIds: { Character: CHARACTER_ISSUER_BOARD_ID, Money: MONEY_ISSUER_BOARD_ID},
//   brandBoardIds: { Money: MONEY_BRAND_BOARD_ID, Character: CHARACTER_BRAND_BOARD_ID },
//   minBidPerCharacter,
// } = dappConstants;

// export const getCharacters = async (agoric: AgoricService) => {
//   console.log("getting characters");
//   console.log("instance nft", agoric.instanceNft);
//   const publicFacet = await E(agoric.zoe).getPublicFacet(agoric.instanceNft);
//   console.log(publicFacet, agoric.publicFacet);
//   const nfts = await E(publicFacet).getCharacters();
//   console.log(nfts);
//   return nfts;
// };

// export const getCharacterArray = async (agoric: AgoricService) => {
//   console.log("getting characters");
//   console.log("instance nft", agoric.instanceNft);
//   const publicFacet = await E(agoric.zoe).getPublicFacet(agoric.instanceNft);
//   console.log(publicFacet, agoric.publicFacet);
//   const nfts = await E(publicFacet).getCharacters();
//   console.log(nfts);
//   return nfts;
// };
// export const mintCharacters = async (service: ServiceState) => {
//   const characters = harden([{
//     name: "NOPE",
//     url: "https://ca.slack-edge.com/T4P05TL1F-U01E63R6WM7-611299dd1870-512",
//   },
//   {
//     name: "WHY",
//     url: "https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512",
//   }]);
//   console.log("MITNING CHARACTERS");
//   const { agoric } = service;
//   const publicFacet = await E(agoric.zoe).getPublicFacet(agoric.instanceNft);
//   const moneyIssuer = await E(agoric.board).getValue(MONEY_ISSUER_BOARD_ID);
//   const auctionItemsInstallation = await E(agoric.board).getValue(
//     AUCTION_ITEMS_INSTALLATION_BOARD_ID,
//   );
//   const auctionInstallation = await E(agoric.board).getValue(
//     AUCTION_INSTALLATION_BOARD_ID,
//   );
//   const {
//     auctionItemsPublicFacet,
//     auctionItemsInstance,
//   } = await E(publicFacet).auctionCharacters(
//     characters,
//     moneyIssuer,
//     auctionInstallation,
//     auctionItemsInstallation,
//     minBidPerCharacter,
//     // chainTimerService,
//   );
// };

// const formOffer = (characterPursePetname: PursePetname) => ({
//   // JSONable ID for this offer.  This is scoped to the origin.
//   id: Date.now(),

//   proposalTemplate: {
//     want: {
//       CB: {
//         pursePetname: characterPursePetname,
//         value: 1,
//       },
//     },
//   },

//   // Tell the wallet that we're handling the offer result.
//   dappContext: true,
// });

// export const mintNFT = async (agoric: AgoricService, moneyPurse: any, moneyBrand: unknown) => {
//   console.log("CALLIN MINT...");
//   console.log(agoric, moneyBrand, moneyPurse);
//   const pricePerNFT = AmountMath.make(moneyBrand, 1n+1n);
//   /* tslint-disable-next-line */
//   const proposal = harden({
//     give: {
//       Money: pricePerNFT,
//     },
//     want: {
//       NFTs: AmountMath.make(moneyBrand, [1n]),
//     },
//   });
//   const invitation = await E(agoric.publicFacet).makeInvitation();
//   const myNFTPayment = moneyPurse.withdraw(pricePerNFT);
//   const payments = harden({
//     Money: myNFTPayment,
//   });

//   // const seat = E(agoric.zoe).offer(invitation, proposal, payments);

//   // const offerResult = await E(seat).getOfferResult();
//   // console.log(offerResult);

//   // const nftPayment = await E(seat).getPayout("NFTs");
//   // const moneyPayment = await E(seat).getPayout("Money");

//   // const moneyPayoutAmount = await E(moneyIssuer).getAmountOf(moneyPayment);
//   // const nftPayoutAmount = await E(nftIssuer).getAmountOf(nftPayment);

//   // console.log("invitation", invitation);
// };

// export const mintCharacter = async (characterPursePetname: PursePetname, agoric: AgoricService) => {
//   // const { depositFacetId, offer } = obj.data;
//   const offer = formOffer(characterPursePetname);
//   const depositFacet = E(agoric.board).getValue(agoric.zoeInvitationDepositFacetId);
//   const invitation = await E(agoric.publicFacet).MintCharacters();
//   const invitationAmount = await E(agoric.invitationIssuer).getAmountOf(
//     invitation,
//   );
//   const {
//     value: [{ handle }],
//   } = invitationAmount;
//   const invitationHandleBoardId = await E(agoric.board).getId(handle);
//   const updatedOffer = { ...offer, invitationHandleBoardId };
//   // We need to wait for the invitation to be
//   // received, or we will possibly win the race of
//   // proposing the offer before the invitation is ready.
//   // TODO: We should make this process more robust.
//   console.log("OFERRRRRR");
//   console.log(updatedOffer);
//   await E(depositFacet).receive(invitation);
//   await E(agoric.walletP).addOffer(updatedOffer);
// };
// export const mintCharacterZCF = async (characterPursePetname: PursePetname, agoric: AgoricService) => {
//   // const { depositFacetId, offer } = obj.data;
//   console.log("MINTING VIA PUBLIC FACET");
//   console.log(characterPursePetname);
//   console.log(agoric);
//   const want = harden([{
//     name: "other",
//     url: "https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512",
//   }]);
//   const offer = {
//     // JSONable ID for this offer.  This is scoped to the origin.
//     id: Date.now(),
//     proposalTemplate: {
//       want: {
//         KCB: {
//           pursePetname: characterPursePetname,
//           value: want,
//         },
//       },
//     },

//     // Tell the wallet that we're handling the offer result.
//     dappContext: true,
//   };
//   console.log("OFFER: ", offer);
//   // const offer = formOffer(characterPursePetname);
//   const depositFacet = await E(agoric.board).getValue(agoric.zoeInvitationDepositFacetId);
//   console.log(">> calling mintCharacter");
//   const invitation = await E(agoric.nftPublicFacet).mintCharacter();
//   console.log(">> called");
//   console.log("INVITATION: ", invitation);

//   const invitationAmount = await E(agoric.invitationIssuer).getAmountOf(
//     invitation,
//   );
//   console.log("INVITATION: ", invitationAmount);

//   const {
//     value: [{ handle }],
//   } = invitationAmount;
//   const invitationHandleBoardId = await E(agoric.board).getId(handle);
//   console.log("invitationHandleBoardId: ", invitationHandleBoardId);
//   const updatedOffer = { ...offer, invitationHandleBoardId };
//   // We need to wait for the invitation to be
//   // received, or we will possibly win the race of
//   // proposing the offer before the invitation is ready.
//   // TODO: We should make this process more robust.
//   console.log("OFERRRRRR");
//   console.log(updatedOffer);
//   await E(depositFacet).receive(invitation);
//   await E(agoric.walletP).addOffer(updatedOffer);
// };

// export const mintNextCharacterZCF = async (characterPursePetname: PursePetname, agoric: AgoricService, name: string) => {
//   // const { depositFacetId, offer } = obj.data;
//   console.log("MINTING VIA PUBLIC FACET");
//   console.log(characterPursePetname);
//   console.log(agoric);
//   const want = harden([{
//     name,
//     url: "https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512",
//   }]);
//   const offer = {
//     // JSONable ID for this offer.  This is scoped to the origin.
//     id: Date.now(),
//     proposalTemplate: {
//       want: {
//         KCB: {
//           pursePetname: characterPursePetname,
//           value: want,
//         },
//       },
//     },

//     // Tell the wallet that we're handling the offer result.
//     dappContext: true,
//   };
//   console.log("OFFER: ", offer);
//   // const offer = formOffer(characterPursePetname);
//   const depositFacet = await E(agoric.board).getValue(agoric.zoeInvitationDepositFacetId);
//   console.log(">> calling mintCharacter");
//   const invitation = await E(agoric.nftPublicFacet).mintNextCharacter();
//   console.log(">> called");
//   console.log("INVITATION: ", invitation);

//   const invitationAmount = await E(agoric.invitationIssuer).getAmountOf(
//     invitation,
//   );
//   console.log("INVITATION: ", invitationAmount);

//   const {
//     value: [{ handle }],
//   } = invitationAmount;
//   const invitationHandleBoardId = await E(agoric.board).getId(handle);
//   console.log("invitationHandleBoardId: ", invitationHandleBoardId);
//   const updatedOffer = { ...offer, invitationHandleBoardId };
//   // We need to wait for the invitation to be
//   // received, or we will possibly win the race of
//   // proposing the offer before the invitation is ready.
//   // TODO: We should make this process more robust.
//   console.log("OFERRRRRR");
//   console.log(updatedOffer);
//   await E(depositFacet).receive(invitation);
//   await E(agoric.walletP).addOffer(updatedOffer);
// };

