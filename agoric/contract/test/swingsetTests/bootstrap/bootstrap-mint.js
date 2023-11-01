import { AmountMath } from '@agoric/ertp';
import { E } from '@endo/eventual-send';
import { flow } from '../flow.js';

export async function mintCharacterNameTooLong(context) {
  /** @type {Context} */
  const {
    publicFacet,
    paymentAsset,
    users: { alice },
    zoe,
  } = context;
  const { message, give, offerArgs } = flow.mintCharacter.invalidName1;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);

  const payment = { Price: alice.withdrawPayment(priceAmount) };

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  //   await t.throwsAsync(E(userSeat).getOfferResult(), Error.message, message);

  const characters = await E(publicFacet).getCharacters();
  assert.equal(
    characters.length,
    0,
    'New character was not added to contract registry due to mint error',
  );

  alice.depositPayment(await E(userSeat).getPayout('Price'));
}

export async function mintCharacterExpectedFlow(context, name) {
  /** @type {Context} */
  const { publicFacet, purses, paymentAsset, zoe } = context;

  const purse = paymentAsset.issuerMockIST.makeEmptyPurse();
  const payout = paymentAsset.mintMockIST.mintPayment(
    AmountMath.make(paymentAsset.brandMockIST, harden(100000000000n)),
  );
  purse.deposit(payout);

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();

  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, 30000000n);

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const payment = { Price: purse.withdraw(priceAmount) };
  const offerArgs = harden({ name });

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  const result = await E(userSeat).getOfferResult();
  assert.equal(result, 'Character NFT minted successfully!');

  const characters = await E(publicFacet).getCharacters();
  assert.equal(characters[0].name, offerArgs.name);

  const payout2 = await E(userSeat).getPayout('Asset');

  await E(purses.character).deposit(payout2);
  assert(
    offerArgs.name,
    (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
  );
}
