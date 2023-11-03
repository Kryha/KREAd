import { AmountMath } from '@agoric/ertp';
import { E } from '@endo/eventual-send';

export async function setupUpgradeTests(context) {
  /** @type {Context} */
  const { paymentAsset, purses } = context;
  const payment = await E(paymentAsset.mintMockIST).mintPayment(
    AmountMath.make(paymentAsset.brandMockIST, 100000000n),
  );
  await E(purses.payment).deposit(payment);
  return {
    ...context,
    purses,
  };
}

export async function testFunctionalityBeforeUpgrade(context) {
  /** @type {Context} */
  const { publicFacet, zoe, purses, paymentAsset } = context;
  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();

  const proposal = {
    give: { Price: AmountMath.make(paymentAsset.brandMockIST, 30000000n) },
  };
  const payment = {
    Price: await E(purses.payment).withdraw(
      AmountMath.make(paymentAsset.brandMockIST, 30000000n),
    ),
  };
  const offerArgs = { name: 'example' };

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  const result = await E(userSeat).getOfferResult();
  const characterInventory = await E(publicFacet).getCharacterInventory(
    'example',
  );
  assert.equal(characterInventory.items.length, 3);
}

export async function testFunctionalityAfterUpgrade(context) {
  /** @type {Context} */
  const { publicFacet, zoe, purses, paymentAsset } = context;
  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();

  const proposal = {
    give: { Price: AmountMath.make(paymentAsset.brandMockIST, 30000000n) },
  };
  const payment = {
    Price: await E(purses.payment).withdraw(
      AmountMath.make(paymentAsset.brandMockIST, 30000000n),
    ),
  };
  const offerArgs = { name: 'example2' };

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  const result = await E(userSeat).getOfferResult();
  const characterInventory = await E(publicFacet).getCharacterInventory(
    'example2',
  );
  assert.equal(characterInventory.items.length, 4);
}
