// eslint-disable-next-line import/order
import { test } from './prepare-test-env-ava.js';
import { E } from '@endo/eventual-send';
import { AmountMath } from '@agoric/ertp';
import { bootstrapContext } from './bootstrap.js';
import { flow } from './flow.js';
import { makeKreadUser } from './make-user.js';
import { makeCopyBag } from '@agoric/store';

test.before(async (t) => {
  const { zoe, contractAssets, assets, purses, instance, paymentAsset } =
    await bootstrapContext();

  const alice = makeKreadUser('alice', {
    character: contractAssets.character.issuer.makeEmptyPurse(),
    item: contractAssets.item.issuer.makeEmptyPurse(),
    payment: paymentAsset.issuerMockIST.makeEmptyPurse(),
  });
  const payout = paymentAsset.mintMockIST.mintPayment(
    AmountMath.make(paymentAsset.brandMockIST, harden(100000000000n)),
  );
  alice.depositPayment(payout);

  t.context = {
    instance,
    contractAssets,
    assets,
    purses,
    zoe,
    paymentAsset,
    users: { alice },
  };
});

test.serial('--| MINT - Too Long Name', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    paymentAsset,
    users: { alice },
    zoe,
  } = t.context;
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

  await t.throwsAsync(E(userSeat).getOfferResult(), Error.message, message);

  const characters = await E(publicFacet).getCharacters();
  t.deepEqual(
    characters.length,
    0,
    'New character was not added to contract registry due to mint error',
  );

  alice.depositPayment(await E(userSeat).getPayout('Price'));
});

test.serial('--| MINT - Invalid Chars in Name', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    users: { alice },
    paymentAsset,
    zoe,
  } = t.context;
  const { message, give, offerArgs } = flow.mintCharacter.invalidName2;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();

  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);
  const payment = { Price: alice.withdrawPayment(priceAmount) };

  const proposal = harden({
    give: {
      Price: priceAmount,
    },
  });

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  await t.throwsAsync(E(userSeat).getOfferResult(), Error.message, message);

  const characters = await E(publicFacet).getCharacters();
  t.deepEqual(
    characters.length,
    0,
    'New character was not added to contract registry due to mint error',
  );
});

test.serial('--| MINT - Forbidden name: "names"', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    users: { alice },
    paymentAsset,
    zoe,
  } = t.context;
  const { message, give, offerArgs } = flow.mintCharacter.invalidName3;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();

  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);
  const payment = { Price: alice.withdrawPayment(priceAmount) };

  const proposal = harden({
    give: {
      Price: priceAmount,
    },
  });

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  await t.throwsAsync(E(userSeat).getOfferResult(), Error.message, message);

  const characters = await E(publicFacet).getCharacters();
  t.deepEqual(
    characters.length,
    0,
    'New character was not added to contract registry due to mint error',
  );
});

test.serial('--| MINT - Expected flow', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    purses,
    paymentAsset,
    users: { alice },
    zoe,
  } = t.context;
  const { message, give, offerArgs } = flow.mintCharacter.expected;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const payment = { Price: alice.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result, message, 'Offer returns success message');

  const characters = await E(publicFacet).getCharacters();
  t.deepEqual(
    characters[0].name,
    offerArgs.name,
    'New character is added to contract registry',
  );

  const payout = await E(userSeat).getPayout('Asset');
  purses.character.deposit(payout);
  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    offerArgs.name,
    'New Character was added to character purse successfully',
  );
});

test.serial('--| MINT - Fee too low', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    paymentAsset,
    users: { alice },
    zoe,
  } = t.context;
  const { offerArgs, message, give } = flow.mintCharacter.feeTooLow;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const payment = { Price: alice.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  await t.throwsAsync(E(userSeat).getOfferResult(), Error.message, message);

  const characters = await E(publicFacet).getCharacters();
  t.deepEqual(
    characters.length,
    1,
    'New character was not added to contract registry due to mint error',
  );
});

test.serial('--| MINT - No offerArgs', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    paymentAsset,
    users: { alice },
    zoe,
  } = t.context;
  const { give, offerArgs, message } = flow.mintCharacter.noArgs;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const payment = { Price: alice.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  await t.throwsAsync(E(userSeat).getOfferResult(), Error.message, message);

  const characters = await E(publicFacet).getCharacters();
  t.deepEqual(
    characters.length,
    1,
    'New character was not added to contract registry due to mint error',
  );
});

test.serial('--| MINT - Duplicate Name', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    paymentAsset,
    users: { alice },
    zoe,
  } = t.context;
  const { offerArgs, message, give } = flow.mintCharacter.duplicateName;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const payment = { Price: alice.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  await t.throwsAsync(E(userSeat).getOfferResult(), Error.message, message);

  const characters = await E(publicFacet).getCharacters();
  t.deepEqual(
    characters.length,
    1,
    'New character was not added to contract registry due to mint error',
  );
});

test.serial('--| MINT - No name', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    paymentAsset,
    users: { alice },
    zoe,
  } = t.context;

  const { offerArgs, give, message } = flow.mintCharacter.noName;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const payment = { Price: alice.withdrawPayment(priceAmount) };
  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  await t.throwsAsync(E(userSeat).getOfferResult(), Error.message, message);

  const characters = await E(publicFacet).getCharacters();
  t.deepEqual(
    characters.length,
    1,
    'New character was not added to contract registry due to mint error',
  );
});

test.serial('--| MINT - No characters available', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    paymentAsset,
    users: { alice },
    zoe,
  } = t.context;
  const { offerArgs, message, give } = flow.mintCharacter.noAvailability;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const payment = { Price: alice.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  await t.throwsAsync(E(userSeat).getOfferResult(), Error.message, message);

  const characters = await E(publicFacet).getCharacters();
  t.deepEqual(
    characters.length,
    1,
    'New character was not added to contract registry due to mint error',
  );
});

test.serial('--| MINT - Inventory check', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
  } = t.context;
  const { offerArgs } = flow.mintCharacter.expected;

  const characterInventory = await E(publicFacet).getCharacterInventory(
    offerArgs.name,
  );

  const mappedInventory = characterInventory.items.map((i) => i[0]);

  t.deepEqual(
    mappedInventory.length,
    3,
    'New character inventory contains 3 items',
  );

  t.deepEqual(
    new Set(mappedInventory.map((i) => i.category)).size,
    3,
    'No two items have the same category',
  );

  t.deepEqual(
    mappedInventory.filter((i) => i.rarity < 20).length,
    2,
    'Two items are common',
  );

  t.deepEqual(
    mappedInventory.filter((i) => i.rarity > 59).length,
    1,
    'One item is legendary',
  );
});

test.serial('--| MINT - Item - Expected flow', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { creatorFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { want, message } = flow.mintItem.expected;

  const mintItemInvitation = await E(creatorFacet).makeMintItemInvitation();
  const proposal = harden({
    want: {
      Item: AmountMath.make(
        contractAssets.item.brand,
        makeCopyBag(harden([[want, 1n]])),
      ),
    },
  });

  const userSeat = await E(zoe).offer(mintItemInvitation, proposal);

  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result, message, 'Offer returns success message');

  const payout = await E(userSeat).getPayout('Asset');
  purses.item.deposit(payout);
  t.deepEqual(
    purses.item.getCurrentAmount().value.payload[0][0].name,
    want.name,
    'New Item was added to character purse successfully',
  );
});

test.serial('--| MINT - Item - Mint same item (SFT)', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { creatorFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { want, message } = flow.mintItem.expected;

  const mintItemInvitation = await E(creatorFacet).makeMintItemInvitation();
  const proposal = harden({
    want: {
      Item: AmountMath.make(
        contractAssets.item.brand,
        makeCopyBag(harden([[want, 1n]])),
      ),
    },
  });

  const userSeat = await E(zoe).offer(mintItemInvitation, proposal);

  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result, message, 'Offer returns success message');

  const payout = await E(userSeat).getPayout('Asset');
  purses.item.deposit(payout);
  t.deepEqual(
    purses.item.getCurrentAmount().value.payload[0][0].name,
    want.name,
    'New Item was added to character purse successfully',
  );

  t.deepEqual(
    purses.item.getCurrentAmount().value.payload[0][1],
    2n,
    'Supply of item increased to 2',
  );
  t.deepEqual(purses.item.getCurrentAmount().value.payload.length, 1);
});

test.serial('--| MINT - Item - Multiple flow', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { creatorFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { want, message } = flow.mintItem.multiple;

  const mintItemInvitation = await E(creatorFacet).makeMintItemInvitation();
  const proposal = harden({
    want: {
      Item: AmountMath.make(
        contractAssets.item.brand,
        makeCopyBag(harden([[want, 2n]])),
      ),
    },
  });

  const userSeat = await E(zoe).offer(mintItemInvitation, proposal);

  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result, message, 'Offer returns success message');

  const payout = await E(userSeat).getPayout('Asset');

  purses.item.deposit(payout);

  const totalItems = purses.item
    .getCurrentAmount()
    .value.payload.reduce((acc, [item, supply]) => {
      return acc + supply;
    }, 0n);
  t.deepEqual(totalItems, 4n);
  t.deepEqual(purses.item.getCurrentAmount().value.payload.length, 2);
});

test.serial('--| MINT - Item - Multiple different items flow', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { creatorFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { want, message } = flow.mintItem.multipleUnique;

  const mintItemInvitation = await E(creatorFacet).makeMintItemInvitation();
  const proposal = harden({
    want: {
      Item: AmountMath.make(
        contractAssets.item.brand,
        makeCopyBag(harden(want.map((item) => [item, 1n]))),
      ),
    },
  });

  const userSeat = await E(zoe).offer(mintItemInvitation, proposal);

  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result, message, 'Offer returns success message');

  const payout = await E(userSeat).getPayout('Asset');

  purses.item.deposit(payout);
  t.deepEqual(purses.item.getCurrentAmount().value.payload.length, 4);
});
