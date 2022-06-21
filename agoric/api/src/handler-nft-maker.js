// @ts-check
import { AmountMath } from '@agoric/ertp';
import { E } from '@endo/eventual-send';
import { makeWebSocketHandler } from './lib-http';

const spawnHandler = (
  {
    nftMakerCreatorFacet,
    nftMakerPublicFacet,
    board,
    http,
    chainTimerService,
    invitationIssuer,
    nfts,
    mintArgs,
  },
  _invitationMaker,
) =>
  makeWebSocketHandler(http, (send, _meta) =>
    harden({
      async onMessage(obj) {
        switch (obj.type) {
          case 'nft/public/list': {
            const fetchedNfts = await E(nftMakerPublicFacet).getNfts();
            send({
              type: 'nft-maker/nftListResponse',
              data: fetchedNfts,
            });
            return true;
          }
          case 'nft/creator/list': {
            const fetchedNfts = await E(nftMakerCreatorFacet).getNfts();
            send({
              type: 'nft-maker/nftListCreatorResponse',
              data: fetchedNfts,
            });
            return true;
          }
          case 'nft/test': {
            // const nfts = await E(creatorFacet).getNfts();
            send({
              type: 'nft-maker/nftTestResponse',
              data: nfts,
            });
            return true;
          }
          case 'nft/getTimerService': {
            send({
              type: 'nft-maker/nftTimerServiceResponse',
              data: chainTimerService,
            });
            return true;
          }
          case 'nft/mint': {
            const { characters } = obj.data;

            const allcharacters = harden(characters);
            const moneyValue = 1 * 1000000;
            const minBidPercharacter = AmountMath.make(
              mintArgs.moneyBrand,
              BigInt(moneyValue),
            );

            const {
              // TODO: implement exiting the creatorSeat and taking the earnings
              auctionItemsPublicFacet: publicFacet,
              // auctionItemsInstance: instance,
            } = await E(nftMakerCreatorFacet).auctionCharacters(
              allcharacters,
              mintArgs.moneyIssuer,
              mintArgs.auctionInstallation,
              mintArgs.auctionItemsInstallation,
              minBidPercharacter,
              mintArgs.chainTimerService,
            );

            send({
              type: 'nft-maker/nftMintResponse',
              data: {
                msg: 'MINT SUCCESSFUL',
                auction: { publicFacet },
              },
            });
            return true;
          }

          case 'nftFaucet/sendInvitation': {
            const { depositFacetId, offer } = obj.data;
            console.log('CREATOR FACET');
            console.log(nftMakerCreatorFacet);
            console.log('INVITATION ISSUER');
            console.log(invitationIssuer);
            const depositFacet = E(board).getValue(depositFacetId);
            console.log('DEPOSIT FACET');
            console.log(depositFacet);
            const invitation = await E(nftMakerCreatorFacet).makeInvitation();
            console.log('INVITATION');
            console.log(invitation);
            const invitationAmount = await E(invitationIssuer).getAmountOf(
              invitation,
            );
            console.log('INVITATION AMOUNT');
            console.log(invitationAmount);
            const {
              value: [{ handle }],
            } = invitationAmount;
            const invitationHandleBoardId = await E(board).getId(handle);
            console.log('INVITATION BOARD ID');
            console.log(invitationHandleBoardId);
            const updatedOffer = { ...offer, invitationHandleBoardId };
            console.log('UPDATED OFFER');
            console.log(updatedOffer);
            // We need to wait for the invitation to be
            // received, or we will possibly win the race of
            // proposing the offer before the invitation is ready.
            // TODO: We should make this process more robust.
            await E(depositFacet).receive(invitation);

            send({
              type: 'nftFaucet/sendInvitationResponse',
              data: { offer: updatedOffer },
            });
            return true;
          }

          case 'character/mint': {
            const { depositFacetId, offer } = obj.data;
            const depositFacet = E(board).getValue(depositFacetId);
            const invitation = await E(nftMakerCreatorFacet).mintCharacter();
            const invitationAmount = await E(invitationIssuer).getAmountOf(
              invitation,
            );
            const {
              value: [{ handle }],
            } = invitationAmount;
            const invitationHandleBoardId = await E(board).getId(handle);
            const updatedOffer = { ...offer, invitationHandleBoardId };
            // We need to wait for the invitation to be
            // received, or we will possibly win the race of
            // proposing the offer before the invitation is ready.
            // TODO: We should make this process more robust.
            await E(depositFacet).receive(invitation);

            send({
              type: 'response/character/mint',
              data: { offer: updatedOffer },
            });
            return true;
          }
          default:
            return undefined;
        }
      },
    }),
  );

export default harden(spawnHandler);
