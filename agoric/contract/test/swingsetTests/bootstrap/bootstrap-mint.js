import { E } from '@endo/eventual-send';
import { AmountMath } from '@agoric/ertp';
import { flow } from '../flow.js';
import { makeKreadUser } from './make-bootstrap-users.js';
import { makeCopyBag, mustMatch } from '@agoric/store';
import { TimestampRecordShape } from '@agoric/time';

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
export async function mintTooLongName(context) {
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

  const payment = { Price: await alice.withdrawPayment(priceAmount) };

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, message);
    const characters = await E(publicFacet).getCharacters();
    assert.equal(
      characters.length,
      0,
      'New character was not added to contract registry due to mint error',
    );

    await alice.depositPayment(await E(userSeat)).getPayout('Price');
  }
}

export async function mintInvalidCharsInname(context) {
  /** @type {Context} */
  const {
    publicFacet,
    users: { alice },
    paymentAsset,
    zoe,
  } = context;
  const { message, give, offerArgs } = flow.mintCharacter.invalidName2;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();

  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);
  const payment = { Price: await alice.withdrawPayment(priceAmount) };

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

  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, message);

    const characters = await E(publicFacet).getCharacters();
    assert.equal(
      characters.length,
      0,
      'New character was not added to contract registry due to mint error',
    );
    throw error;
  }
}

export async function mintForbiddenName(context) {
  /** @type {Context} */
  const {
    publicFacet,
    users: { alice },
    paymentAsset,
    zoe,
  } = context;
  const { message, give, offerArgs } = flow.mintCharacter.invalidName3;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();

  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);
  const payment = { Price: await alice.withdrawPayment(priceAmount) };

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

  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, message);

    const characters = await E(publicFacet).getCharacters();
    assert.equal(
      characters.length,
      0,
      'New character was not added to contract registry due to mint error',
    );
    throw error;
  }
}

export async function mintExpectedFlow(context) {
  /** @type {Context} */
  const {
    publicFacet,
    purses,
    paymentAsset,
    users: { alice },
    zoe,
    getFromVStorage,
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
  assert.equal(result, message, 'Offer returns success message');

  const characters = await E(publicFacet).getCharacters();
  assert.equal(
    characters[0].name,
    offerArgs.name,
    'New character is added to contract registry',
  );
  const vStorageCharacterData = getFromVStorage('kread.character');
  assert.equal(vStorageCharacterData.name, offerArgs.name);
  const vStorageInventoryData = getFromVStorage(
    `kread.character.inventory-${offerArgs.name}`,
  );

  assert.equal(vStorageInventoryData.length, 3);

  const payout = await E(userSeat).getPayout('Asset');
  await E(purses.character).deposit(payout);
  assert.equal(
    (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
    offerArgs.name,
    'New Character was added to character purse successfully',
  );
}

export async function mintFeeTooLow(context) {
  /** @type {Context} */
  const {
    publicFacet,
    paymentAsset,
    users: { alice },
    zoe,
  } = context;
  const { offerArgs, message, give } = flow.mintCharacter.feeTooLow;

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

  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, message);

    const characters = await E(publicFacet).getCharacters();
    assert.equal(
      characters.length,
      1,
      'New character was not added to contract registry due to mint error',
    );
    throw error;
  }
}

export async function mintNoOfferArgs(context) {
  /** @type {Context} */
  const {
    publicFacet,
    paymentAsset,
    users: { alice },
    zoe,
  } = context;
  const { give, offerArgs, message } = flow.mintCharacter.noArgs;

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

  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, message);

    const characters = await E(publicFacet).getCharacters();
    assert.equal(
      characters.length,
      1,
      'New character was not added to contract registry due to mint error',
    );
    throw error;
  }
}

export async function mintDuplicateName(context) {
  /** @type {Context} */
  const {
    publicFacet,
    paymentAsset,
    users: { alice },
    zoe,
  } = context;
  const { offerArgs, message, give } = flow.mintCharacter.duplicateName;

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

  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, message);

    const characters = await E(publicFacet).getCharacters();
    assert.equal(
      characters.length,
      1,
      'New character was not added to contract registry due to mint error',
    );
    throw error;
  }
}

export async function mintNoName(context) {
  /** @type {Context} */
  const {
    publicFacet,
    paymentAsset,
    users: { alice },
    zoe,
  } = context;

  const { offerArgs, give, message } = flow.mintCharacter.noName;

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

  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, message);

    const characters = await E(publicFacet).getCharacters();
    assert.equal(
      characters.length,
      1,
      'New character was not added to contract registry due to mint error',
    );
    throw error;
  }
}

export async function mintNoCharactersAvailable(context) {
  /** @type {Context} */
  const {
    publicFacet,
    paymentAsset,
    users: { alice },
    zoe,
  } = context;
  const { offerArgs, message, give } = flow.mintCharacter.noAvailability;

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

  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, message);

    const characters = await E(publicFacet).getCharacters();
    assert.equal(
      characters.length,
      1,
      'New character was not added to contract registry due to mint error',
    );
    throw error;
  }
}

export async function mintInventoryCheck(context) {
  /** @type {Context} */
  const { publicFacet, getFromVStorage } = context;
  const { offerArgs } = flow.mintCharacter.expected;

  const characterInventory = await E(publicFacet).getCharacterInventory(
    offerArgs.name,
  );

  const mappedInventory = characterInventory.items.map((i) => i[0]);

  assert.equal(
    mappedInventory.length,
    3,
    'New character inventory does not contain 3 items',
  );

  assert.equal(
    new Set(mappedInventory.map((i) => i.category)).size,
    3,
    'Two or more items have the same category',
  );

  const vStorageInventoryItems = getFromVStorage(
    `kread.character.inventory-${offerArgs.name}`,
  );
  mustMatch(vStorageInventoryItems, characterInventory.items);
}

export async function mintItemExpectedFlow(context) {
  /** @type {Context} */
  const { creatorFacet, contractAssets, purses, zoe, getFromVStorage } =
    context;
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
  assert.equal(result, message, 'Offer does not return success message');

  const payout = await E(userSeat).getPayout('Asset');
  await E(purses.item).deposit(payout);
  assert.equal(
    (await E(purses.item).getCurrentAmount()).value.payload[0][0].name,
    want.name,
    'New Item was not added to character purse',
  );

  const vStorageItem = getFromVStorage('kread.item');
  mustMatch(
    harden(Object.keys(vStorageItem).sort()),
    harden(['history', 'id', 'item']),
  );

  mustMatch(vStorageItem.item, want);
  assert.equal(vStorageItem.id, 3);
  mustMatch(
    vStorageItem.history,
    harden([
      {
        type: 'mint',
        data: want,
        timestamp: TimestampRecordShape,
      },
    ]),
  );
}

export async function mintSameItemSFT(context) {
  /** @type {Context} */
  const { creatorFacet, contractAssets, purses, zoe, getFromVStorage } = context;
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
  assert.equal(result, message, 'Offer does not return success message');

  const payout = await E(userSeat).getPayout('Asset');
  await E(purses.item).deposit(payout);
  assert.equal(
    (await E(purses.item).getCurrentAmount()).value.payload[0][0].name,
    want.name,
    'New Item was not added to character purse',
  );

  assert.equal(
    (await E(purses.item).getCurrentAmount()).value.payload[0][1],
    2n,
    'Supply of item not increased to 2',
  );
  assert.equal(
    (await E(purses.item).getCurrentAmount()).value.payload.length,
    1,
  );

  const vStorageItem = getFromVStorage('kread.item');
  mustMatch(vStorageItem.item, want)
  assert.equal(vStorageItem.id, 4)

}

export async function mintItemMultipleFlow(context) {
  /** @type {Context} */
  const { creatorFacet, contractAssets, purses, zoe } = context;
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
  assert.equal(result, message, 'Offer does not return success message');

  const payout = await E(userSeat).getPayout('Asset');

  await E(purses.item).deposit(payout);

  const totalItems = (
    await E(purses.item).getCurrentAmount()
  ).value.payload.reduce((acc, [_item, supply]) => {
    return acc + supply;
  }, 0n);
  assert.equal(totalItems, 4n);
  assert.equal(
    (await E(purses.item).getCurrentAmount()).value.payload.length,
    2,
  );
}

export async function mintItemMultipleDifferentFlow(context) {
  /** @type {Context} */
  const { creatorFacet, contractAssets, purses, zoe } = context;
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
  assert.equal(result, message, 'Offer does not return success message');

  const payout = await E(userSeat).getPayout('Asset');

  await E(purses.item).deposit(payout);
  assert.equal(
    (await E(purses.item).getCurrentAmount()).value.payload.length,
    4,
  );
}
