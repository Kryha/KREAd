import { AmountMath } from '@agoric/ertp';
import { flow } from '../flow';
import { E } from '@endo/eventual-send';

export async function mint(context) {
  /** @type {Context} */
  const { publicFacet, purses, paymentAsset, zoe, } = context;

  const payout = await E(paymentAsset.mintMockIST).mintPayment(
    AmountMath.make(paymentAsset.brandMockIST, harden(100000000000n)),
  );
  await E(purses.payment).deposit(payout);

  const { give, offerArgs } = flow.mintCharacter.expected;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const payment = { Price: await E(purses.payment).withdraw(priceAmount) };

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  const result = await E(userSeat).getOfferResult();
}
