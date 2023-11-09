import { AmountMath } from '@agoric/ertp';
import { E } from '@endo/eventual-send';
import { flow } from '../flow.js';
import { makeCopyBag, mustMatch } from '@agoric/store';
import { addCharacterToContext, addItemToContext } from './utils.js';
import { makeKreadUser } from './make-bootstrap-users.js';
import { errors } from '../../../src/kreadV2/errors.js';
import { multiplyBy } from '@agoric/zoe/src/contractSupport/ratio.js';
import { defaultItems } from '../items.js';
import { TimerBrandShape } from '@agoric/time';

export async function setupMarketTests(context) {
  await addCharacterToContext(context);
  await addItemToContext(context, {
    name: 'New item2',
    category: 'hair',
    thumbnail: '',
    origin: 'Elphia',
    description: '',
    functional: false,
    rarity: 65,
    level: 0,
    filtering: 0,
    weight: 0,
    sense: 0,
    reserves: 0,
    durability: 0,
    date: {},
    colors: [''],
    id: 10000,
    image: '',
    artistMetadata: '',
  });

  const { purses, contractAssets, paymentAsset } = context;

  const bob = makeKreadUser('bob', purses);
  const alice = makeKreadUser('alice', {
    character: await E(contractAssets.character.issuer).makeEmptyPurse(),
    item: await E(contractAssets.item.issuer).makeEmptyPurse(),
    payment: paymentAsset.issuerMockIST.makeEmptyPurse(),
  });

  const payout = await E(paymentAsset.mintMockIST).mintPayment(
    AmountMath.make(paymentAsset.brandMockIST, harden(100n)),
  );
  await alice.depositPayment(payout);
  return {
    ...context,
    users: { bob, alice },
  };
}

export async function sellCharacter(context) {
  /** @type {Context} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { bob },
    paymentAsset,
    getFromVStorage,
    royaltyRate,
    platformFeeRate,
    storageKit,
  } = context;
  const {
    market: {
      bob: {
        give: { character },
      },
    },
  } = flow;

  const characterToSell = (await bob.getCharacters()).find(
    (c) => c.name === character,
  );

  const copyBagAmount = makeCopyBag(harden([[characterToSell, 1n]]));

  const characterToSellAmount = AmountMath.make(
    contractAssets.character.brand,
    copyBagAmount,
  );

  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, 40n);

  const sellCharacterInvitation = await E(
    publicFacet,
  ).makeSellCharacterInvitation();

  const proposal = harden({
    give: { Character: characterToSellAmount },
    want: { Price: priceAmount },
  });

  const payment = {
    Character: await bob.withdrawCharacters(characterToSellAmount),
  };

  const userSeat = await E(zoe).offer(
    sellCharacterInvitation,
    proposal,
    payment,
  );

  await E(userSeat).getOfferResult();

  bob.setMarketSeat(userSeat);

  const charactersForSale = await E(publicFacet).getCharactersForSale();
  assert.equal(
    charactersForSale.length,
    1,
    'Character was not added to market',
  );
  assert.equal(
    (await bob.getCharacters()).length,
    0,
    "Character is still in bob's wallet",
  );
  const vStorageCharacterMarket = getFromVStorage(
    `kread.market-characters.character-${characterToSell.name}`,
  );
  // Due to ocaps the remotable objects read from the storage node are not correct references and hence comparing
  // them to the actual remote objects does not work. (brands in this case)
  // That is why here we deconstruct the amounts and compare the actual values.
  mustMatch(
    vStorageCharacterMarket.asset,
    harden({
      ...characterToSell,
      date: { ...characterToSell.date, timerBrand: TimerBrandShape },
    }),
  );
  assert.equal(vStorageCharacterMarket.id, characterToSell.name);
  assert.equal(vStorageCharacterMarket.askingPrice.value, priceAmount.value);
  assert.equal(
    vStorageCharacterMarket.royalty.value,
    multiplyBy(priceAmount, royaltyRate).value,
  );
  assert.equal(
    vStorageCharacterMarket.platformFee.value,
    multiplyBy(priceAmount, platformFeeRate).value,
  );
  assert.equal(vStorageCharacterMarket.isFirstSale, false);
}

export async function buyCharacterOfferLessThanAskingPrice(context) {
  /** @type {Context} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { alice },
    paymentAsset,
  } = context;
  const {
    market: {
      bob: {
        give: { character },
      },
    },
  } = flow;

  const initialBalance = await alice.getPaymentBalance();
  const charactersForSale = await E(publicFacet).getCharactersForSale();
  const characterToBuy = charactersForSale.find(
    (c) => c.asset.name === character,
  );

  const copyBagAmount = makeCopyBag(harden([[characterToBuy.asset, 1n]]));
  const characterToBuyAmount = AmountMath.make(
    contractAssets.character.brand,
    copyBagAmount,
  );

  const priceAmount = AmountMath.make(
    paymentAsset.brandMockIST,
    characterToBuy.askingPrice.value / 2n,
  );

  const buyCharacterInvitation = await E(
    publicFacet,
  ).makeBuyCharacterInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Character: characterToBuyAmount },
  });
  const payment = { Price: await alice.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    buyCharacterInvitation,
    proposal,
    payment,
  );

  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, errors.insufficientFunds);
    const payout = await E(userSeat).getPayout('Price');
    await alice.depositPayment(payout);
    assert.equal(await alice.getPaymentBalance(), initialBalance);
    throw error;
  }
}

export async function buyCharacter(context) {
  /** @type {Context} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { bob, alice },
    royaltyPurse,
    platformFeePurse,
    royaltyRate,
    platformFeeRate,
    getFromVStorage,
  } = context;

  const {
    market: {
      bob: {
        give: { character },
      },
    },
  } = flow;

  let charactersForSale = await E(publicFacet).getCharactersForSale();
  const characterToBuy = charactersForSale.find(
    ({ asset }) => asset.name === character,
  );

  const royaltyPursePre = royaltyPurse.getCurrentAmount().value;
  const platformFeePursePre = platformFeePurse.getCurrentAmount().value;

  const copyBagAmount = makeCopyBag(harden([[characterToBuy.asset, 1n]]));
  const characterToBuyAmount = AmountMath.make(
    contractAssets.character.brand,
    copyBagAmount,
  );
  const priceAmount = AmountMath.add(
    AmountMath.add(characterToBuy.askingPrice, characterToBuy.royalty),
    characterToBuy.platformFee,
  );

  const buyCharacterInvitation = await E(
    publicFacet,
  ).makeBuyCharacterInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Character: characterToBuyAmount },
  });
  const payment = { Price: await alice.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    buyCharacterInvitation,
    proposal,
    payment,
  );

  await E(userSeat).getOfferResult();

  const characterPayout = await E(userSeat).getPayout('Character');
  await alice.depositCharacters(characterPayout);
  assert.equal(
    (await alice.getCharacters()).length,
    1,
    "Character is not in alice's wallet",
  );

  const bobsPayout = await E(bob.getSeat().market).getPayout('Price');
  await bob.depositPayment(bobsPayout);
  assert.equal(
    await bob.getPaymentBalance(),
    40n,
    'Bob did not received payout',
  );

  charactersForSale = await E(publicFacet).getCharactersForSale();
  assert.equal(
    charactersForSale.length,
    0,
    'Character was not removed from market',
  );

  assert.equal(
    royaltyPurse.getCurrentAmount().value,
    royaltyPursePre + multiplyBy(characterToBuy.askingPrice, royaltyRate).value,
  );
  assert.equal(
    platformFeePurse.getCurrentAmount().value,
    platformFeePursePre +
      multiplyBy(characterToBuy.askingPrice, platformFeeRate).value,
  );
  try {
    getFromVStorage(
      `kread.market-characters.character-${characterToBuy.asset.name}`,
    );
  } catch (error) {
    assert.equal(
      error.message,
      `no data for "kread.market-characters.character-${characterToBuy.asset.name}"`,
    );
  }
}

export async function buyCharacterNotOnMarket(context) {
  /** @type {Context} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { alice },
    paymentAsset,
  } = context;
  const {
    market: {
      bob: {
        give: { character },
      },
    },
  } = flow;
  const initialBalance = await alice.getPaymentBalance();

  const characterToBuy = (await alice.getCharacters()).find(
    (c) => c.name === character,
  );
  const copyBagAmount = makeCopyBag(harden([[characterToBuy, 1n]]));
  const characterToBuyAmount = AmountMath.make(
    contractAssets.character.brand,
    copyBagAmount,
  );
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, 5n);

  const buyCharacterInvitation = await E(
    publicFacet,
  ).makeBuyCharacterInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Character: characterToBuyAmount },
  });
  const payment = { Price: await alice.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    buyCharacterInvitation,
    proposal,
    payment,
  );

  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, 'Character not found');
    const payout = await E(userSeat).getPayout('Price');
    alice.depositPayment(payout);
    assert.equal(alice.getPaymentBalance(), initialBalance);
  }
}

export async function sellItem(context) {
  /** @type {Context} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { bob },
    paymentAsset,
    getFromVStorage,
    royaltyRate,
    platformFeeRate,
  } = context;

  const itemToSellValue = (await bob.getItems()).find(
    (item) => item.category === 'hair',
  );
  const itemToSellCopyBagAmount = makeCopyBag(harden([[itemToSellValue, 1n]]));
  const itemToSell = AmountMath.make(
    contractAssets.item.brand,
    itemToSellCopyBagAmount,
  );
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, 5n);

  const sellItemInvitation = await E(publicFacet).makeSellItemInvitation();
  const proposal = harden({
    give: { Item: itemToSell },
    want: { Price: priceAmount },
  });

  const payment = { Item: await bob.withdrawItems(itemToSell) };

  const userSeat = await E(zoe).offer(sellItemInvitation, proposal, payment);
  await E(userSeat).getOfferResult();

  bob.setMarketSeat(userSeat);

  const itemsForSale = await E(publicFacet).getItemsForSale();
  assert.equal(itemsForSale.length, 1, 'Item is was not added to market');

  assert.equal(
    (await bob.getItems()).length,
    0,
    "Item is still in bob's wallet",
  );
  const vStorageItemMarket = getFromVStorage(`kread.market-items.item-0`); // this is the first item on sale so we know it will be assigned id 0
  // Due to ocaps the remotable objects read from the storage node are not correct references and hence comparing
  // them to the actual remote objects does not work. (brands in this case)
  // That is why here we deconstruct the amounts and compare the actual values.
  mustMatch(vStorageItemMarket.asset, itemToSellValue);
  assert.equal(vStorageItemMarket.id, 0);
  assert.equal(vStorageItemMarket.askingPrice.value, priceAmount.value);
  assert.equal(
    vStorageItemMarket.royalty.value,
    multiplyBy(priceAmount, royaltyRate).value,
  );
  assert.equal(
    vStorageItemMarket.platformFee.value,
    multiplyBy(priceAmount, platformFeeRate).value,
  );
  assert.equal(vStorageItemMarket.isFirstSale, false);
}

export async function buyItemOfferLessThanAskingPrice(context) {
  /** @type {Context} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { alice },
    paymentAsset,
  } = context;

  const initialBalance = await alice.getPaymentBalance();

  const itemsForSale = await E(publicFacet).getItemsForSale();
  const itemToBuy = itemsForSale.find(
    (itemEntry) => itemEntry.asset.category === 'hair',
  );
  const itemToBuyCopyBagAmount = makeCopyBag(harden([[itemToBuy.asset, 1n]]));
  const itemToBuyAmount = AmountMath.make(
    contractAssets.item.brand,
    itemToBuyCopyBagAmount,
  );

  const priceAmount = AmountMath.make(
    paymentAsset.brandMockIST,
    itemToBuy.askingPrice.value / 2n,
  );

  const buyItemInvitation = await E(publicFacet).makeBuyItemInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Item: itemToBuyAmount },
  });
  const payment = { Price: await alice.withdrawPayment(priceAmount) };
  const offerArgs = { entryId: itemToBuy.id };

  const userSeat = await E(zoe).offer(
    buyItemInvitation,
    proposal,
    payment,
    offerArgs,
  );
  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(errors.insufficientFunds);
    const payout = await E(userSeat).getPayout('Price');
    await alice.depositPayment(payout);
    assert.equal(await alice.getPaymentBalance(), initialBalance);
  }
}

export async function buyItem(context) {
  /** @type {Context} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { bob, alice },
    getFromVStorage,
  } = context;

  let itemsForSale = await E(publicFacet).getItemsForSale();
  const itemToBuy = itemsForSale.find(
    (itemEntry) => itemEntry.asset.category === 'hair',
  );
  const itemToBuyCopyBagAmount = makeCopyBag(harden([[itemToBuy.asset, 1n]]));
  const itemToBuyAmount = AmountMath.make(
    contractAssets.item.brand,
    itemToBuyCopyBagAmount,
  );

  const priceAmount = AmountMath.add(
    AmountMath.add(itemToBuy.askingPrice, itemToBuy.royalty),
    itemToBuy.platformFee,
  );
  const buyItemInvitation = await E(publicFacet).makeBuyItemInvitation();

  const proposal = harden({
    give: { Price: priceAmount },
    want: { Item: itemToBuyAmount },
  });
  const payment = { Price: await alice.withdrawPayment(priceAmount) };
  const offerArgs = { entryId: itemToBuy.id };

  const userSeat = await E(zoe).offer(
    buyItemInvitation,
    proposal,
    payment,
    offerArgs,
  );
  await E(userSeat).getOfferResult();
  // assert.equal(result.itemMarket.length, 0, 'Offer returns empty market entry');

  const itemPayout = await E(userSeat).getPayout('Item');
  await alice.depositItems(itemPayout);
  assert.equal(
    (await alice.getItems()).length,
    1,
    "Item is not in alice's wallet",
  );

  const bobsPayout = await E(bob.getSeat().market).getPayout('Price');
  await bob.depositPayment(bobsPayout);
  assert.equal(
    await bob.getPaymentBalance(),
    45n,
    'Bob did not received payout',
  );

  itemsForSale = await E(publicFacet).getItemsForSale();
  assert.equal(itemsForSale.length, 0, 'Item was not removed from market');

  try {
    getFromVStorage(`kread.market-items.item-0`);
  } catch (error) {
    assert.equal(error.message, `no data for "kread.market-items.item-0"`);
  }
}

export async function buyItemNotOnMarket(context) {
  /** @type {Context} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { alice },
    paymentAsset,
  } = context;
  const initialBalance = await alice.getPaymentBalance();

  const itemToBuy = (await alice.getItems()).find(
    (item) => item.category === 'hair',
  );
  const itemToBuyCopyBagAmount = makeCopyBag(harden([[itemToBuy, 1n]]));
  const itemToBuyAmount = AmountMath.make(
    contractAssets.item.brand,
    itemToBuyCopyBagAmount,
  );
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, 5n);

  const buyItemInvitation = await E(publicFacet).makeBuyItemInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Item: itemToBuyAmount },
  });
  const payment = { Price: await alice.withdrawPayment(priceAmount) };
  const offerArgs = { entryId: 66 };
  const userSeat = await E(zoe).offer(
    buyItemInvitation,
    proposal,
    payment,
    offerArgs,
  );

  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, 'Item not found');
    const payout = await E(userSeat).getPayout('Price');
    await alice.depositPayment(payout);
    assert.equal(await alice.getPaymentBalance(), initialBalance);
  }
}

export async function buyCharacterOfferMoreThanAskingPrice(context) {
  /** @type {Context} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { bob, alice },
    paymentAsset,
  } = context;
  const {
    market: {
      bob: {
        give: { character },
      },
    },
  } = flow;

  // alice puts character for sale
  const balanceAlice = await alice.getPaymentBalance();
  const characterToSell = (await alice.getCharacters()).find(
    (c) => c.name === character,
  );

  const characterToSellCopyBagAmount = makeCopyBag(
    harden([[characterToSell, 1n]]),
  );
  const characterToSellAmount = AmountMath.make(
    contractAssets.character.brand,
    characterToSellCopyBagAmount,
  );
  let priceAmount = AmountMath.make(paymentAsset.brandMockIST, 10n);

  const sellCharacterInvitation = await E(
    publicFacet,
  ).makeSellCharacterInvitation();
  let proposal = harden({
    give: { Character: characterToSellAmount },
    want: { Price: priceAmount },
  });
  let payment = {
    Character: await alice.withdrawCharacters(characterToSellAmount),
  };

  let userSeat = await E(zoe).offer(sellCharacterInvitation, proposal, payment);
  await E(userSeat).getOfferResult();

  alice.setMarketSeat(userSeat);

  let charactersForSale = await E(publicFacet).getCharactersForSale();
  assert.equal(
    charactersForSale.length,
    1,
    'Character was not added to market',
  );

  // bob buys character
  const characterToBuy = charactersForSale.find(
    ({ asset }) => asset.name === character,
  );
  const characterToBuyCopyBagAmount = makeCopyBag(
    harden([[characterToBuy.asset, 1n]]),
  );
  const characterToBuyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterToBuyCopyBagAmount,
  );
  priceAmount = AmountMath.make(
    paymentAsset.brandMockIST,
    (characterToBuy.askingPrice.value +
      characterToBuy.royalty.value +
      characterToBuy.platformFee.value) *
      2n,
  );

  const buyCharacterInvitation = await E(
    publicFacet,
  ).makeBuyCharacterInvitation();
  proposal = harden({
    give: { Price: priceAmount },
    want: { Character: characterToBuyAmount },
  });
  payment = { Price: await bob.withdrawPayment(priceAmount) };

  userSeat = await E(zoe).offer(buyCharacterInvitation, proposal, payment);
  await E(userSeat).getOfferResult();

  const characterPayout = await E(userSeat).getPayout('Character');
  await bob.depositCharacters(characterPayout);
  assert.equal(
    (await bob.getCharacters()).length,
    1,
    "Character is not in bob's wallet",
  );

  const alicesPayout = await E(alice.getSeat().market).getPayout('Price');

  await alice.depositPayment(alicesPayout);
  assert.equal(
    await alice.getPaymentBalance(),
    balanceAlice +
      priceAmount.value -
      characterToBuy.royalty.value -
      characterToBuy.platformFee.value,
    'Alice did not received payout',
  );

  charactersForSale = await E(publicFacet).getCharactersForSale();
  assert.equal(
    charactersForSale.length,
    0,
    'Character was not removed from market',
  );
}

export async function buyItemOfferMoreThanAskingPrice(context) {
  /** @type {Context} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { bob, alice },
    paymentAsset,
  } = context;

  // alice puts item for sale
  const aliceBalance = await alice.getPaymentBalance();
  const itemToSell = (await alice.getItems()).find(
    (item) => item.category === 'hair',
  );
  const itemToSellCopyBagAmount = makeCopyBag(harden([[itemToSell, 1n]]));
  const itemToSellAmount = AmountMath.make(
    contractAssets.item.brand,
    itemToSellCopyBagAmount,
  );
  let priceAmount = AmountMath.make(paymentAsset.brandMockIST, 5n);

  const sellItemInvitation = await E(publicFacet).makeSellItemInvitation();
  let proposal = harden({
    give: { Item: itemToSellAmount },
    want: { Price: priceAmount },
  });
  let payment = { Item: await alice.withdrawItems(itemToSellAmount) };

  let userSeat = await E(zoe).offer(sellItemInvitation, proposal, payment);
  await E(userSeat).getOfferResult();

  alice.setMarketSeat(userSeat);

  let itemsForSale = await E(publicFacet).getItemsForSale();
  assert.equal(itemsForSale.length, 1, 'Item was not added to market');

  // bob attempts to buy item
  const itemToBuy = itemsForSale.find(({ asset }) => asset.category === 'hair');
  const itemToBuyCopyBagAmount = makeCopyBag(harden([[itemToBuy.asset, 1n]]));
  const itemToBuyAmount = AmountMath.make(
    contractAssets.item.brand,
    itemToBuyCopyBagAmount,
  );
  priceAmount = AmountMath.make(
    paymentAsset.brandMockIST,
    itemToBuy.askingPrice.value * 2n,
  );

  const buyItemInvitation = await E(publicFacet).makeBuyItemInvitation();
  proposal = harden({
    give: { Price: priceAmount },
    want: { Item: itemToBuyAmount },
  });
  payment = { Price: await bob.withdrawPayment(priceAmount) };
  const offerArgs = { entryId: itemToBuy.id };

  userSeat = await E(zoe).offer(
    buyItemInvitation,
    proposal,
    payment,
    offerArgs,
  );
  await E(userSeat).getOfferResult();

  const itemPayout = await E(userSeat).getPayout('Item');
  await bob.depositItems(itemPayout);
  assert.equal((await bob.getItems()).length, 1, "Item is not in bob's wallet");

  const alicesPayout = await E(alice.getSeat().market).getPayout('Price');
  await alice.depositPayment(alicesPayout);
  assert.equal(
    await alice.getPaymentBalance(),
    aliceBalance +
      priceAmount.value -
      itemToBuy.royalty.value -
      itemToBuy.platformFee.value,
    'Alice did not receive payout',
  );

  itemsForSale = await E(publicFacet).getItemsForSale();
  assert.equal(itemsForSale.length, 0, 'Item was not removed to market');
}

export async function internalSellItemBatch(context) {
  /** @type {Context} */
  const {
    publicFacet,
    creatorFacet,
    paymentAsset,
    getFromVStorage,
    royaltyRate,
    platformFeeRate,
  } = context;

  const itemCollection = Object.values(defaultItems).map((item) => [item, 3n]);
  const itemsToSell = harden(itemCollection);
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, 5n);

  await E(creatorFacet).publishItemCollection(priceAmount, itemsToSell);

  const itemsForSale = await E(publicFacet).getItemsForSale();
  assert.equal(itemsForSale.length, 27, 'Item was not added to market');

  itemCollection.forEach((value, i) => {
    [0, 1, 2].forEach((j) => {
      const id = 2 + j + 3 * i;
      const vStorageItemMarket = getFromVStorage(
        `kread.market-items.item-${id}`,
      );
      mustMatch(vStorageItemMarket.asset, value[0]);
      assert.equal(vStorageItemMarket.id, id);
      assert.equal(vStorageItemMarket.askingPrice.value, priceAmount.value);
      assert.equal(
        vStorageItemMarket.royalty.value,
        multiplyBy(priceAmount, royaltyRate).value,
      );
      assert.equal(
        vStorageItemMarket.platformFee.value,
        multiplyBy(priceAmount, platformFeeRate).value,
      );
      assert.equal(vStorageItemMarket.isFirstSale, true);
    });
  });
}

export async function buyBatchSoldItem(context) {
  /** @type {Context} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { bob },
    paymentAsset,
    getFromVStorage,
  } = context;

  const itemsForSale = await E(publicFacet).getItemsForSale();
  const itemToBuy = itemsForSale.find(
    ({ asset }) => asset.category === 'background',
  );
  const itemToBuyCopyBagAmount = makeCopyBag(harden([[itemToBuy.asset, 1n]]));

  const itemToBuyAmount = AmountMath.make(
    contractAssets.item.brand,
    itemToBuyCopyBagAmount,
  );
  const priceAmount = AmountMath.make(
    paymentAsset.brandMockIST,
    itemToBuy.askingPrice.value +
      itemToBuy.royalty.value +
      itemToBuy.platformFee.value,
  );

  const buyItemInvitation = await E(publicFacet).makeBuyItemInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Item: itemToBuyAmount },
  });

  const initialItemCountBob = (await bob.getItems()).length;
  const payment = {
    Price: await bob.withdrawPayment(priceAmount),
  };

  const offerArgs = { entryId: itemToBuy.id };

  const userSeat = await E(zoe).offer(
    buyItemInvitation,
    proposal,
    payment,
    offerArgs,
  );

  await E(userSeat).getOfferResult();
  const itemPayout = await E(userSeat).getPayout('Item');
  await bob.depositItems(itemPayout);

  assert.equal(
    (await bob.getItems()).length,
    initialItemCountBob + 1,
    "Item is not in bob's wallet",
  );

  const itemsForSaleAfter = await E(publicFacet).getItemsForSale();

  assert.equal(
    itemsForSaleAfter.length,
    itemsForSale.length - 1,
    'Item was not removed from the market',
  );

  try {
    getFromVStorage(`kread.market-items.item-${itemToBuy.id}`);
  } catch (error) {
    assert.equal(
      error.message,
      `no data for "kread.market-items.item-${itemToBuy.id}"`,
    );
  }
}
