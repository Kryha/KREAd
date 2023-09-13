// eslint-disable-next-line import/order
import { test } from './prepare-test-env-ava.js';
import { E } from '@endo/eventual-send';
import { AmountMath } from '@agoric/ertp';
import { bootstrapContext } from './bootstrap.js';
import { flow } from './flow.js';
import { makeCopyBag } from '@agoric/store';

test.before(async (t) => {
  const { zoe, contractAssets, assets, purses, instance } =
    await bootstrapContext();
  t.context = {
    instance,
    contractAssets,
    assets,
    purses,
    zoe,
  };
});

test.serial('--| MINT - Expected flow', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { want, message } = flow.mintCharacter.expected;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const copyBagAmount = makeCopyBag(harden([[want, 1n]]));
  const proposal = harden({
    want: {
      Asset: AmountMath.make(
        contractAssets.character.brand,
        harden(copyBagAmount),
      ),
    },
  });

  const userSeat = await E(zoe).offer(mintCharacterInvitation, proposal);

  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result, message, 'Offer returns success message');

  const characters = await E(publicFacet).getCharacters();
  t.deepEqual(
    characters[0].name,
    want.name,
    'New character is added to contract registry',
  );

  const payout = await E(userSeat).getPayout('Asset');
  purses.character.deposit(payout);
  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    want.name,
    'New Character was added to character purse successfully',
  );
});

test.serial('--| MINT - No want in offer', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
  } = t.context;
  const { want, message } = flow.mintCharacter.noWantInOffer;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const copyBagAmount = makeCopyBag(harden([[want, 1n]]));
  const proposal = harden({
    want: {
      Asset: AmountMath.make(
        contractAssets.character.brand,
        harden(copyBagAmount),
      ),
    },
  });

  await t.throwsAsync(
    E(zoe).offer(mintCharacterInvitation, proposal),
    undefined,
    'No-want-in-offer error message',
  );

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
    contractAssets,
    zoe,
  } = t.context;
  const { want, message } = flow.mintCharacter.duplicateName;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const copyBagAmount = makeCopyBag(harden([[want, 1n]]));
  const proposal = harden({
    want: {
      Asset: AmountMath.make(
        contractAssets.character.brand,
        harden(copyBagAmount),
      ),
    },
  });

  const userSeat = await E(zoe).offer(mintCharacterInvitation, proposal);

  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result.message, message, 'Offer returns no-name error message');

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
    contractAssets,
    zoe,
  } = t.context;

  const { want, message } = flow.mintCharacter.noName;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const copyBagAmount = makeCopyBag(harden([[want, 1n]]));
  const proposal = harden({
    want: {
      Asset: AmountMath.make(
        contractAssets.character.brand,
        harden(copyBagAmount),
      ),
    },
  });

  await t.throwsAsync(
    E(zoe).offer(mintCharacterInvitation, proposal),
    undefined,
    'No-name error message',
  );

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
  const { want } = flow.mintCharacter.expected;

  const characterInventory = await E(publicFacet).getCharacterInventory(
    want.name,
  );

  const mappedInventory = characterInventory.items.map((i) => i[0]);

  t.deepEqual(
    mappedInventory.length,
    10,
    'New character inventory contains 10 items',
  );

  t.deepEqual(
    new Set(mappedInventory.map((i) => i.category)).size,
    10,
    'No two items have the same category',
  );
});

test.serial('--| MINT - Item - Expected flow', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { want, message } = flow.mintItem.expected;

  const mintItemInvitation = await E(publicFacet).makeMintItemInvitation();
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
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { want, message } = flow.mintItem.expected;

  const mintItemInvitation = await E(publicFacet).makeMintItemInvitation();
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
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { want, message } = flow.mintItem.multiple;

  const mintItemInvitation = await E(publicFacet).makeMintItemInvitation();
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
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { want, message } = flow.mintItem.multipleUnique;

  const mintItemInvitation = await E(publicFacet).makeMintItemInvitation();
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
