import { test } from './prepare-test-env-ava.js';
import { E } from '@endo/eventual-send';
import { AmountMath } from '@agoric/ertp';
import { bootstrapContext } from './bootstrap.js';
import { flow } from './flow.js';
import { makeCopyBag } from '@agoric/store';
import { makeKreadUser } from './make-user.js';
import { defaultItems } from './items.js';

async function sellCharacter(context, user, characterName, askingPrice) {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
  } = context;

  const characterToSell = user
    .getCharacters()
    .find((c) => c.name === characterName);
  const copyBagAmount = makeCopyBag(harden([[characterToSell, 1n]]));
  const characterToSellAmount = AmountMath.make(
    contractAssets.character.brand,
    copyBagAmount,
  );
  const priceAmount = AmountMath.make(
    contractAssets.payment.brand,
    askingPrice,
  );

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
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
  } = context;

  const charactersForSale = await E(publicFacet).getCharactersForSale();
  const characterToBuy = charactersForSale.find(
    ({ object }) => object.name === characterName,
  );

  const copyBagAmount = makeCopyBag(harden([[characterToBuy.object, 1n]]));
  const characterToBuyAmount = AmountMath.make(
    contractAssets.character.brand,
    copyBagAmount,
  );
  const priceAmount = characterToBuy.askingPrice;

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

  const { zoe, contractAssets, assets, purses, instance } = bootstrap;

  const bob = makeKreadUser('bob', purses);

  const topUpInvitation = await E(
    instance.publicFacet,
  ).makeTokenFacetInvitation();

  const proposal = harden({
    want: {
      Asset: AmountMath.make(contractAssets.payment.brand, harden(100n)),
    },
  });
  const userSeat = await E(zoe).offer(topUpInvitation, proposal);
  const payout = await E(userSeat).getPayout('Asset');
  bob.depositPayment(payout);

  t.context = {
    instance,
    contractAssets,
    assets,
    purses,
    zoe,
    users: { bob },
  };
});

test.serial('---| METRICS - Initialization', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
  } = t.context;

  const metrics = await E(publicFacet).getMarketMetrics();

  for (const collection of Object.values(metrics)) {
    for (let value of Object.values(collection)) {
      t.deepEqual(value, 0);
    }
  }
});

test.serial('---| METRICS - Collection size', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob },
  } = t.context;

  const { want } = flow.mintCharacter.expected;

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
  await E(userSeat).getOfferResult();

  const payout = await E(userSeat).getPayout('Asset');
  bob.depositCharacters(payout);

  const metrics = await E(publicFacet).getMarketMetrics();
  t.deepEqual(metrics.character.collectionSize, 1);
  t.deepEqual(metrics.item.collectionSize, 10);
});

test.serial('---| METRICS - Average levels character', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
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

  const defaultItemsAverageLevel =
    Object.values(defaultItems).reduce((sum, item) => sum + item.level, 0) /
    Object.keys(defaultItems).length;

  t.deepEqual(metrics.item.averageLevel, defaultItemsAverageLevel);
});

test.serial('---| METRICS - Amount sold character', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
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
    instance: { publicFacet },
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
  t.deepEqual(metrics.character.latestSalePrice, 20);

  t.deepEqual(metrics.item.amountSold, 0);
  t.deepEqual(metrics.item.latestSalePrice, 0);
});
