/* TODO: SMART-WALLET SUPPPRT

Implement method for minting character:
- use ContractInvitationSpec to specify the desired instance and method
- form offer config based including character name
- use agoricService.addOffer to send offer to wallet
- handle result appropriately

Code below is from dapp-inter
(https://github.com/Agoric/dapp-inter/blob/main/src/service/vaults.ts#L428)
*/
import { AgoricState } from "../../interfaces";
import type {
  ContractInvitationSpec,
  ContinuingInvitationSpec,
} from '@agoric/smart-wallet/src/invitations';

export const mintCharacter = (characterName: string, agoricService: AgoricState) => {

  const { walletConnection: { importContext }} = agoricService;
  const spec: ContractInvitationSpec = {
    source: 'contract',
    instance: 'KREAd',
    publicInvitationMaker: ''
  };

  const invitationSpec = importContext.fromBoard.serialize(harden(spec));


  const serializedToLock = importContext.fromBoard.serialize(
    toLock,
  ) as CapData<'Amount'>;
  const serializedtoMint = importContext.fromBoard.serialize(
    toMint,
  ) as CapData<'Amount'>;
  
  const offerConfig = {
    invitationSpec,
    proposalTemplate: harden({
      give: {
        Collateral: {
          amount: serializedToLock,
        },
      },
      want: {
        Minted: {
          amount: serializedtoMint,
        },
      },
    }),
  };

  try {
    assert(offerSigner.addOffer && offerSigner.isDappApproved);
    offerSigner.addOffer(offerConfig);
    console.log('Offer proposed', offerConfig);
  } catch (e: unknown) {
    console.error(e);
    toast.error('Unable to propose offer.');
    throw e;
  }

//   const serializedToLock = importContext.fromBoard.serialize(
//     toLock,
//   ) as CapData<'Amount'>;
//   const serializedtoMint = importContext.fromBoard.serialize(
//     toMint,
//   ) as CapData<'Amount'>;



};
// export const mintCharacter = async (
//   agoric: AgoricService,
//   name: string,
// ) => {
//   // const { importContext, offerSigner } = appStore.getState();

//   const spec: ContractInvitationSpec = {
//     source: 'contract',
//     instance: 'KREAd',
//     publicInvitationMaker: ''
//   };

//   const invitationSpec = importContext.fromBoard.serialize(harden(spec));

//   const serializedToLock = importContext.fromBoard.serialize(
//     toLock,
//   ) as CapData<'Amount'>;
//   const serializedtoMint = importContext.fromBoard.serialize(
//     toMint,
//   ) as CapData<'Amount'>;

//   const offerConfig = {
//     invitationSpec,
//     proposalTemplate: harden({
//       give: {
//         Collateral: {
//           amount: serializedToLock,
//         },
//       },
//       want: {
//         Minted: {
//           amount: serializedtoMint,
//         },
//       },
//     }),
//   };

//   try {
//     assert(offerSigner.addOffer && offerSigner.isDappApproved);
//     offerSigner.addOffer(offerConfig);
//     console.log('Offer proposed', offerConfig);
//   } catch (e: unknown) {
//     console.error(e);
//     toast.error('Unable to propose offer.');
//     throw e;
//   }
// };