// @ts-check
import { E } from '@endo/eventual-send';
import { makeWebSocketHandler } from './lib-http';

const spawnHandler = (
  { creatorFacet, board, http, invitationIssuer },
  _invitationMaker,
) =>
  makeWebSocketHandler(http, (send, _meta) =>
    harden({
      async onMessage(obj) {
        switch (obj.type) {
          case 'nftFaucet/sendInvitation': {
            const { depositFacetId, offer } = obj.data;
            console.log('CREATOR FACET');
            console.log(creatorFacet);
            console.log('INVITATION ISSUER');
            console.log(invitationIssuer);
            const depositFacet = E(board).getValue(depositFacetId);
            console.log('DEPOSIT FACET');
            console.log(depositFacet);
            const invitation = await E(creatorFacet).makeInvitation();
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

          default:
            return undefined;
        }
      },
    }),
  );

export default harden(spawnHandler);
