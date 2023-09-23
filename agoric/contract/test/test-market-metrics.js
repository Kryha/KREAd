import { test } from './prepare-test-env-ava.js';

import { E } from '@endo/eventual-send';
import { AmountMath } from '@agoric/ertp';
import { bootstrapContext } from './bootstrap.js';
import { flow } from './flow.js';
import { makeCopyBag } from '@agoric/store';
import { makeKreadUser } from './make-user.js';

async function sellCharacter(context, user, characterName, askingPrice) {
  /** @type {Bootstrap} */
  const { publicFacet, contractAssets, zoe, paymentAsset } = context;

  const characterToSell = user
    .getCharacters()
    .find((c) => c.name === characterName);
  const copyBagAmount = makeCopyBag(harden([[characterToSell, 1n]]));
  const characterToSellAmount = AmountMath.make(
    contractAssets.character.brand,
    copyBagAmount,
  );
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, askingPrice);

  const sellCharacterInvitation = await E(
    publicFacet,
  ).makeSellCharacterInvitation();
  const proposal = harden({
    give: { Character: characterToSellAmount },
    want: { Price: priceAmount },
  });
  const payment = { Character: user.withdrawCharacters(characterToSellAmount) };

  const userSeat = await E(zoe).offer(
    sellCharacterInvitation,
    proposal,
    payment,
  );

  user.setMarketSeat(userSeat);

  return userSeat;
}

async function buyCharacter(context, user, characterName, seller) {
  /** @type {Bootstrap} */
  const { publicFacet, contractAssets, zoe } = context;

  const charactersForSale = await E(publicFacet).getCharactersForSale();
  const characterToBuy = charactersForSale.find(
    ({ asset }) => asset.name === characterName,
  );

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
  const payment = { Price: user.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    buyCharacterInvitation,
    proposal,
    payment,
  );

  const characterPayout = await E(userSeat).getPayout('Character');
  user.depositCharacters(characterPayout);

  const pricePayout = await seller.getSeat().market.getPayout('Price');
  seller.depositPayment(pricePayout);
}

test.before(async (t) => {
  const bootstrap = await bootstrapContext();
  const { zoe, contractAssets, assets, purses, publicFacet, paymentAsset } =
    bootstrap;

  const bob = makeKreadUser('bob', purses);

  const payout = paymentAsset.mintMockIST.mintPayment(
    AmountMath.make(paymentAsset.brandMockIST, harden(100n)),
  );
  bob.depositPayment(payout);

  t.context = {
    publicFacet,
    contractAssets,
    assets,
    purses,
    zoe,
    users: { bob },
    paymentAsset,
  };
});

test.serial('---| METRICS - Initialization', async (t) => {
  /** @type {Bootstrap} */
  const { publicFacet } = t.context;

  const metrics = await E(publicFacet).getMarketMetrics();

  for (const collection of Object.values(metrics)) {
    for (const value of Object.values(collection)) {
      t.deepEqual(value, 0);
    }
  }
});

test.serial('---| METRICS - Collection size', async (t) => {
  /** @type {Bootstrap} */
  const {
    publicFacet,
    paymentAsset,
    zoe,
    users: { bob },
  } = t.context;

  const { give, offerArgs } = flow.mintCharacter.expected;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const payment = {
    Price: paymentAsset.mintMockIST.mintPayment(
      AmountMath.make(paymentAsset.brandMockIST, harden(30000000n)),
    ),
  };
  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );
  await E(userSeat).getOfferResult();

  const payout = await E(userSeat).getPayout('Asset');
  bob.depositCharacters(payout);
  const metrics = await E(publicFacet).getMarketMetrics();
  t.deepEqual(metrics.character.collectionSize, 1);
  t.deepEqual(metrics.item.collectionSize, 3);
});

test.serial('---| METRICS - Average levels character', async (t) => {
  /** @type {Bootstrap} */
  const {
    publicFacet,
    users: { bob },
  } = t.context;

  const {
    market: {
      bob: {
        give: { character: characterName },
      },
    },
  } = flow;

  const character = bob.getCharacters().find((c) => c.name === characterName);

  await sellCharacter(t.context, bob, characterName, 40n);

  const metrics = await E(publicFacet).getMarketMetrics();
  const characterLevel = await E(publicFacet).getCharacterLevel(characterName);

  t.deepEqual(metrics.character.averageLevel, character.level);
  t.deepEqual(metrics.character.marketplaceAverageLevel, characterLevel);
  t.deepEqual(metrics.character.putForSaleCount, 1);

  const defaultItemsAverageLevel = 0;

  t.deepEqual(metrics.item.averageLevel, defaultItemsAverageLevel);
});

test.serial('---| METRICS - Amount sold character', async (t) => {
  /** @type {Bootstrap} */
  const {
    publicFacet,
    users: { bob },
  } = t.context;

  const {
    market: {
      bob: {
        give: { character: characterName },
      },
    },
  } = flow;
  await buyCharacter(t.context, bob, characterName, bob);

  const metrics = await E(publicFacet).getMarketMetrics();

  const character = bob.getCharacters().find((c) => c.name === characterName);

  t.deepEqual(metrics.character.averageLevel, character.level);
  t.deepEqual(metrics.character.marketplaceAverageLevel, 0);
  t.deepEqual(metrics.character.amountSold, 1);
  t.deepEqual(metrics.character.latestSalePrice, 40);

  t.deepEqual(metrics.item.amountSold, 0);
  t.deepEqual(metrics.item.latestSalePrice, 0);
});

test.serial('---| METRICS - Latest sale price character', async (t) => {
  /** @type {Bootstrap} */
  const {
    publicFacet,
    users: { bob },
  } = t.context;

  const {
    market: {
      bob: {
        give: { character: characterName },
      },
    },
  } = flow;

  await sellCharacter(t.context, bob, characterName, 20n);

  await buyCharacter(t.context, bob, flow.market.bob.give.character, bob);

  const metrics = await E(publicFacet).getMarketMetrics();

  const character = bob.getCharacters().find((c) => c.name === characterName);

  t.deepEqual(metrics.character.averageLevel, character.level);
  t.deepEqual(metrics.character.marketplaceAverageLevel, 0);
  t.deepEqual(metrics.character.amountSold, 2);
  t.deepEqual(metrics.character.putForSaleCount, 2);
  t.deepEqual(metrics.character.latestSalePrice, 20);

  t.deepEqual(metrics.item.amountSold, 0);
  t.deepEqual(metrics.item.latestSalePrice, 0);
});
