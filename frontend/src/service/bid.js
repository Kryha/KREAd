import { E } from "@endo/eventual-send";
import { assert, details as X } from "@agoric/assert";

const getCardAuctionDetail = async (publicFacet, card) => {
  return E(publicFacet).getSessionDetailsForKey(card);
};

const makeBidOfferForCard = async (
  walletP,
  card,
  publicFacet,
  cardPurse,
  tokenPurse,
  price,
) => {
  // assert(card, X`At least one card must be chosen to purchase`);
  console.log("1 MK INV");
  const card1 = {
    name: "Cmoney!",
    url: "https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512",
  };
  const invitation = await E(publicFacet).makeBidInvitationForKey(card1);
  console.log("2 OFFER");

  /* eslint-disable-next-line */
  const adjustedPrice = BigInt(price * (10 ** 6));
  const offerConfig = {
    // JSONable ID for this offer.  This is scoped to the origin.
    id: Date.now(),
    invitation,
    proposalTemplate: {
      want: {
        CB: {
          pursePetname: cardPurse.pursePetname,
          /* eslint-disable-next-line */
          value: harden([card]),
        },
      },
      give: {
        Money: {
          pursePetname: tokenPurse.pursePetname,
          value: adjustedPrice,
        },
      },
    },
  };

  return E(walletP).addOffer(offerConfig);
};

export { makeBidOfferForCard, getCardAuctionDetail };