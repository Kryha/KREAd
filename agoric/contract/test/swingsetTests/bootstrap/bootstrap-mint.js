import { AmountMath } from '@agoric/ertp';
import { E } from '@endo/eventual-send';
import { flow } from '../flow.js';
import { makeKreadUser } from './make-bootstrap-users.js';

export async function setupMintTests(context) {
  const { contractAssets, paymentAsset } = context;

  const alice = makeKreadUser('alice', {
    character: await E(contractAssets.character.issuer).makeEmptyPurse(),
    item: await E(contractAssets.item.issuer).makeEmptyPurse(),
    payment: paymentAsset.issuerMockIST.makeEmptyPurse(),
  });

  const payout = await E(paymentAsset.mintMockIST).mintPayment(
    AmountMath.make(paymentAsset.brandMockIST, harden(100000000000n)),
  );
  await alice.depositPayment(payout);
  return {
    ...context,
    users: { alice },
  };
}

export async function mintCharacterExpectedFlow(context) {
  /** @type {Context} */
  const {
    publicFacet,
    purses,
    paymentAsset,
    users: { alice },
    zoe,
  } = context;
  const { message, give, offerArgs } = flow.mintCharacter.expected;
  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const payment = { Price: await alice.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  const result = await E(userSeat).getOfferResult();
  assert.equal(result, message, 'Offer does not return success message');

  const characters = await E(publicFacet).getCharacters();
  assert.equal(
    characters[0].name,
    offerArgs.name,
    'New character is not added to contract registry',
  );

  const payout = await E(userSeat).getPayout('Asset');
   await E(purses.character).deposit(payout);
  assert.equal(
    (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
    offerArgs.name,
    'New Character was not added to character purse',
  );
}
