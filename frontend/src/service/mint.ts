/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { AgoricService, PursePetname, ServiceState } from "../context/service";
import { assert, details as X } from "@agoric/assert";
import { AmountMath, makeIssuerKit } from "@agoric/ertp";
import dappConstants from "../service/conf/defaults";
import installationConstants from "../service/conf/installation-constants-nft-maker.js";

const { AUCTION_INSTALLATION_BOARD_ID } = installationConstants;
const {
  INSTANCE_BOARD_ID,
  INSTANCE_NFT_MAKER_BOARD_ID,
  AUCTION_ITEMS_INSTALLATION_BOARD_ID,
  INVITE_BRAND_BOARD_ID,
  INSTALLATION_BOARD_ID,
  issuerBoardIds: { Character: CHARACTER_ISSUER_BOARD_ID, Money: MONEY_ISSUER_BOARD_ID},
  brandBoardIds: { Money: MONEY_BRAND_BOARD_ID, Character: CHARACTER_BRAND_BOARD_ID },
  minBidPerCharacter,
} = dappConstants;

export const getCharacters = async (agoric: AgoricService) => {
  console.log("getting characters");
  console.log("instance nft", agoric.instanceNft);
  const publicFacet = await E(agoric.zoe).getPublicFacet(agoric.instanceNft);
  console.log(publicFacet, agoric.publicFacet);
  const nfts = await E(publicFacet).getCharacters();
  console.log(nfts);
  return nfts;
};

export const getCharacterArray = async (agoric: AgoricService) => {
  console.log("getting characters");
  console.log("instance nft", agoric.instanceNft);
  const publicFacet = await E(agoric.zoe).getPublicFacet(agoric.instanceNft);
  console.log(publicFacet, agoric.publicFacet);
  const nfts = await E(publicFacet).getCharacters();
  console.log(nfts);
  return nfts;
};
export const mintCharacters = async (service: ServiceState) => {
  const characters = harden([{
    name: "NOPE",
    url: "https://ca.slack-edge.com/T4P05TL1F-U01E63R6WM7-611299dd1870-512",
  },
  {
    name: "WHY",
    url: "https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512",
  }]);
  console.log("MITNING CHARACTERS");
  const { agoric } = service;
  const publicFacet = await E(agoric.zoe).getPublicFacet(agoric.instanceNft);
  const moneyIssuer = await E(agoric.board).getValue(MONEY_ISSUER_BOARD_ID);
  const auctionItemsInstallation = await E(agoric.board).getValue(
    AUCTION_ITEMS_INSTALLATION_BOARD_ID,
  );
  const auctionInstallation = await E(agoric.board).getValue(
    AUCTION_INSTALLATION_BOARD_ID,
  );
  const {
    auctionItemsPublicFacet,
    auctionItemsInstance,
  } = await E(publicFacet).auctionCharacters(
    characters,
    moneyIssuer,
    auctionInstallation,
    auctionItemsInstallation,
    minBidPerCharacter,
    // chainTimerService,
  );
};

const formOffer = (characterPursePetname: PursePetname) => ({
  // JSONable ID for this offer.  This is scoped to the origin.
  id: Date.now(),

  proposalTemplate: {
    want: {
      CB: {
        pursePetname: characterPursePetname,
        value: 1,
      },
    },
  },

  // Tell the wallet that we're handling the offer result.
  dappContext: true,
});

export const mintNFT = async (agoric: AgoricService, moneyPurse: any, moneyBrand: unknown) => {
  console.log("CALLIN MINT...");
  console.log(agoric, moneyBrand, moneyPurse);
  const pricePerNFT = AmountMath.make(moneyBrand, 1n+1n);
  /* tslint-disable-next-line */
  const proposal = harden({
    give: {
      Money: pricePerNFT,
    },
    want: {
      NFTs: AmountMath.make(moneyBrand, [1n]),
    },
  });
  const invitation = await E(agoric.publicFacet).makeInvitation();
  const myNFTPayment = moneyPurse.withdraw(pricePerNFT);
  const payments = harden({
    Money: myNFTPayment,
  });

  // const seat = E(agoric.zoe).offer(invitation, proposal, payments);

  // const offerResult = await E(seat).getOfferResult();
  // console.log(offerResult);

  // const nftPayment = await E(seat).getPayout("NFTs");
  // const moneyPayment = await E(seat).getPayout("Money");

  // const moneyPayoutAmount = await E(moneyIssuer).getAmountOf(moneyPayment);
  // const nftPayoutAmount = await E(nftIssuer).getAmountOf(nftPayment);

  // console.log("invitation", invitation);
};

export const mintCharacter = async (characterPursePetname: PursePetname, agoric: AgoricService) => {
  // const { depositFacetId, offer } = obj.data;
  const offer = formOffer(characterPursePetname);
  const depositFacet = E(agoric.board).getValue(agoric.zoeInvitationDepositFacetId);
  const invitation = await E(agoric.publicFacet).MintCharacters();
  const invitationAmount = await E(agoric.invitationIssuer).getAmountOf(
    invitation,
  );
  const {
    value: [{ handle }],
  } = invitationAmount;
  const invitationHandleBoardId = await E(agoric.board).getId(handle);
  const updatedOffer = { ...offer, invitationHandleBoardId };
  // We need to wait for the invitation to be
  // received, or we will possibly win the race of
  // proposing the offer before the invitation is ready.
  // TODO: We should make this process more robust.
  console.log("OFERRRRRR");
  console.log(updatedOffer);
  await E(depositFacet).receive(invitation);
  await E(agoric.walletP).addOffer(updatedOffer);
};
export const mintCharacterZCF = async (characterPursePetname: PursePetname, agoric: AgoricService) => {
  // const { depositFacetId, offer } = obj.data;
  console.log("MINTING VIA PUBLIC FACET");
  console.log(characterPursePetname);
  console.log(agoric);
  const want = harden([{
    name: "other",
    url: "https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512",
  }]);
  const offer = {
    // JSONable ID for this offer.  This is scoped to the origin.
    id: Date.now(),
    proposalTemplate: {
      want: {
        KCB: {
          pursePetname: characterPursePetname,
          value: want,
        },
      },
    },

    // Tell the wallet that we're handling the offer result.
    dappContext: true,
  };
  console.log("OFFER: ", offer);
  // const offer = formOffer(characterPursePetname);
  const depositFacet = await E(agoric.board).getValue(agoric.zoeInvitationDepositFacetId);
  console.log(">> calling mintCharacter");
  const invitation = await E(agoric.nftPublicFacet).mintCharacter();
  console.log(">> called");
  console.log("INVITATION: ", invitation);

  const invitationAmount = await E(agoric.invitationIssuer).getAmountOf(
    invitation,
  );
  console.log("INVITATION: ", invitationAmount);

  const {
    value: [{ handle }],
  } = invitationAmount;
  const invitationHandleBoardId = await E(agoric.board).getId(handle);
  console.log("invitationHandleBoardId: ", invitationHandleBoardId);
  const updatedOffer = { ...offer, invitationHandleBoardId };
  // We need to wait for the invitation to be
  // received, or we will possibly win the race of
  // proposing the offer before the invitation is ready.
  // TODO: We should make this process more robust.
  console.log("OFERRRRRR");
  console.log(updatedOffer);
  await E(depositFacet).receive(invitation);
  await E(agoric.walletP).addOffer(updatedOffer);
};

export const mintNextCharacterZCF = async (characterPursePetname: PursePetname, agoric: AgoricService, name: string) => {
  // const { depositFacetId, offer } = obj.data;
  console.log("MINTING VIA PUBLIC FACET");
  console.log(characterPursePetname);
  console.log(agoric);
  const want = harden([{
    name,
    url: "https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512",
  }]);
  const offer = {
    // JSONable ID for this offer.  This is scoped to the origin.
    id: Date.now(),
    proposalTemplate: {
      want: {
        KCB: {
          pursePetname: characterPursePetname,
          value: want,
        },
      },
    },

    // Tell the wallet that we're handling the offer result.
    dappContext: true,
  };
  console.log("OFFER: ", offer);
  // const offer = formOffer(characterPursePetname);
  const depositFacet = await E(agoric.board).getValue(agoric.zoeInvitationDepositFacetId);
  console.log(">> calling mintCharacter");
  const invitation = await E(agoric.nftPublicFacet).mintNextCharacter();
  console.log(">> called");
  console.log("INVITATION: ", invitation);

  const invitationAmount = await E(agoric.invitationIssuer).getAmountOf(
    invitation,
  );
  console.log("INVITATION: ", invitationAmount);

  const {
    value: [{ handle }],
  } = invitationAmount;
  const invitationHandleBoardId = await E(agoric.board).getId(handle);
  console.log("invitationHandleBoardId: ", invitationHandleBoardId);
  const updatedOffer = { ...offer, invitationHandleBoardId };
  // We need to wait for the invitation to be
  // received, or we will possibly win the race of
  // proposing the offer before the invitation is ready.
  // TODO: We should make this process more robust.
  console.log("OFERRRRRR");
  console.log(updatedOffer);
  await E(depositFacet).receive(invitation);
  await E(agoric.walletP).addOffer(updatedOffer);
};
export const makeBidOfferForCard = async (service: ServiceState, publicFacet: any, character: any, price: number) => {
  const invitation = await E(publicFacet).makeBidInvitationForKey(character);
  const { agoric, characterPurse, tokenPurses } = service;
  const adjustedPrice = BigInt(price * (10 ** 6));
  const offerConfig = {
    // JSONable ID for this offer.  This is scoped to the origin.
    id: Date.now(),
    invitation,
    proposalTemplate: {
      want: {
        Asset: {
          pursePetname: characterPurse[0].pursePetname,
          value: harden([character]),
        },
      },
      give: {
        Bid: {
          pursePetname: tokenPurses[0].pursePetname,
          value: adjustedPrice,
        },
      },
    },
  };

  return E(agoric.walletP).addOffer(offerConfig);
};

// export { makeBidOfferForCard, getCardAuctionDetail };