import { E } from '@endo/eventual-send';
import { AgoricService, PursePetname } from '../context/service';
import { assert, details as X } from '@agoric/assert';

const getCardAuctionDetail = async ({ publicFacet, card }: any) => {
  return E(publicFacet).getSessionDetailsForKey(card);
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
}

// export const makeBidOfferForCard = async ({
//   walletP,
//   card,
//   publicFacet,
//   characterPurse,
//   tokenPurse,
//   price,
// }: any) => {
//   assert(card, X`At least one card must be chosen to purchase`);
//   const invitation = await E(publicFacet).makeBidInvitationForKey(card);

//   const offerConfig = {
//     // JSONable ID for this offer.  This is scoped to the origin.
//     id: Date.now(),
//     invitation,
//     proposalTemplate: {
//       want: {
//         Asset: {
//           pursePetname: characterPurse.pursePetname,
//           value: harden([`Tsun Tsun!`]),
//         },
//       },
//       give: {
//         Bid: {
//           pursePetname: tokenPurse.pursePetname,
//           value: price,
//         },
//       },
//     },
//   };

//   return E(walletP).addOffer(offerConfig);
// };

// export { makeBidOfferForCard, getCardAuctionDetail };