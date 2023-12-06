import { makeKreadUser } from './make-bootstrap-users.js';
import { AmountMath } from '@agoric/ertp';
import { makeCopyBag } from '@agoric/store';
import { E } from '@endo/far';
import { flow } from '../flow.js';

async function sellCharacter(context, user, characterName, askingPrice) {
  /** @type {Context} */
  const { publicFacet, contractAssets, zoe, paymentAsset } = context;

  const characterToSell = (await user.getCharacters()).find(
    (c) => c.name === characterName,
  );
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
  const payment = {
    Character: await user.withdrawCharacters(characterToSellAmount),
  };

  const userSeat = await E(zoe).offer(
    sellCharacterInvitation,
    proposal,
    payment,
  );
  await E(userSeat).getOfferResult();

  user.setMarketSeat(userSeat);

  return userSeat;
}

async function buyCharacter(context, user, characterName, seller) {
  /** @type {Context} */
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
  const payment = { Price: await user.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    buyCharacterInvitation,
    proposal,
    payment,
  );

  const characterPayout = await E(userSeat).getPayout('Character');
  await user.depositCharacters(characterPayout);

  const pricePayout = await E(seller.getSeat().market).getPayout('Price');
  await seller.depositPayment(pricePayout);
}

export async function setupMarketMetricsTests(context) {
  const { purses, paymentAsset } = context;
  const bob = makeKreadUser('bob', purses);

  const payout = paymentAsset.mintMockIST.mintPayment(
    AmountMath.make(paymentAsset.brandMockIST, harden(100n)),
  );
  bob.depositPayment(payout);

  return {
    ...context,
    users: { bob },
  };
}

export async function initialization(context) {
  /** @type {Context} */
  const { publicFacet, getFromVStorage } = context;

  const metrics = await E(publicFacet).getMarketMetrics();

  for (const collection of Object.values(metrics)) {
    for (const value of Object.values(collection)) {
      assert.equal(value, 0);
    }
  }
  const vStorageCharacterMetrics = getFromVStorage('kread.market-metrics-character');
  for (const value of Object.values(vStorageCharacterMetrics)) {
    assert.equal(value, 0);
  }

  const vStorageItemMetrics = getFromVStorage('kread.market-metrics-item');
  for (const value of Object.values(vStorageItemMetrics)) {
    assert.equal(value, 0);
  }
}

export async function collectionSize(context) {
  /** @type {Context} */
  const {
    publicFacet,
    paymentAsset,
    zoe,
    users: { bob },
    getFromVStorage
  } = context;

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
  await bob.depositCharacters(payout);
  const metrics = await E(publicFacet).getMarketMetrics();
  assert.equal(metrics.character.collectionSize, 1);
  assert.equal(metrics.item.collectionSize, 3);

  const vStorageCharacterMetrics = getFromVStorage('kread.market-metrics-character');
  assert.equal(vStorageCharacterMetrics.collectionSize, 1)

  const vStorageItemMetrics = getFromVStorage('kread.market-metrics-item');
  assert.equal(vStorageItemMetrics.collectionSize, 3)
}

export async function averageLevelsCharacter(context) {
  /** @type {Context} */
  const {
    publicFacet,
    getFromVStorage,
    users: { bob },
  } = context;

  const {
    market: {
      bob: {
        give: { character: characterName },
      },
    },
  } = flow;

  const character = (await bob.getCharacters()).find(
    (c) => c.name === characterName,
  );

  await sellCharacter(context, bob, characterName, 40n);

  const metrics = await E(publicFacet).getMarketMetrics();
  const characterLevel = await E(publicFacet).getCharacterLevel(characterName);
  assert.equal(metrics.character.averageLevel, character.level);
  assert.equal(metrics.character.marketplaceAverageLevel, characterLevel);
  assert.equal(metrics.character.putForSaleCount, 1);

  const defaultItemsAverageLevel = 0;

  assert.equal(metrics.item.averageLevel, defaultItemsAverageLevel);

  const vStorageCharacterMetrics = getFromVStorage('kread.market-metrics-character');
  assert.equal(vStorageCharacterMetrics.averageLevel, character.level)
  assert.equal(vStorageCharacterMetrics.marketplaceAverageLevel, characterLevel)
  assert.equal(vStorageCharacterMetrics.putForSaleCount, 1)

  const vStorageItemMetrics = getFromVStorage('kread.market-metrics-item');
  assert.equal(vStorageItemMetrics.averageLevel, defaultItemsAverageLevel)
}

export async function amountSoldCharacter(context) {
  /** @type {Context} */
  const {
    publicFacet,
    users: { bob },
    getFromVStorage
  } = context;

  const {
    market: {
      bob: {
        give: { character: characterName },
      },
    },
  } = flow;
  await buyCharacter(context, bob, characterName, bob);

  const metrics = await E(publicFacet).getMarketMetrics();

  const character = (await bob.getCharacters()).find(
    (c) => c.name === characterName,
  );

  assert.equal(metrics.character.averageLevel, character.level);
  assert.equal(metrics.character.marketplaceAverageLevel, 0);
  assert.equal(metrics.character.amountSold, 1);
  assert.equal(metrics.character.latestSalePrice, 40);

  assert.equal(metrics.item.amountSold, 0);
  assert.equal(metrics.item.latestSalePrice, 0);

  const vStorageCharacterMetrics = getFromVStorage('kread.market-metrics-character');
  assert.equal(vStorageCharacterMetrics.averageLevel, character.level)
  assert.equal(vStorageCharacterMetrics.marketplaceAverageLevel, 0)
  assert.equal(vStorageCharacterMetrics.amountSold, 1)
  assert.equal(vStorageCharacterMetrics.latestSalePrice, 40)

  const vStorageItemMetrics = getFromVStorage('kread.market-metrics-item');
  assert.equal(vStorageItemMetrics.amountSold, 0)
  assert.equal(vStorageItemMetrics.latestSalePrice, 0)
}

export async function latestSalePriceCharacter(context) {
  /** @type {Context} */
  const {
    publicFacet,
    users: { bob },
    getFromVStorage
  } = context;

  const {
    market: {
      bob: {
        give: { character: characterName },
      },
    },
  } = flow;

  await sellCharacter(context, bob, characterName, 20n);

  await buyCharacter(context, bob, flow.market.bob.give.character, bob);

  const metrics = await E(publicFacet).getMarketMetrics();

  const character = (await bob.getCharacters()).find(
    (c) => c.name === characterName,
  );

  assert.equal(metrics.character.averageLevel, character.level);
  assert.equal(metrics.character.marketplaceAverageLevel, 0);
  assert.equal(metrics.character.amountSold, 2);
  assert.equal(metrics.character.putForSaleCount, 2);
  assert.equal(metrics.character.latestSalePrice, 20);

  assert.equal(metrics.item.amountSold, 0);
  assert.equal(metrics.item.latestSalePrice, 0);

  const vStorageCharacterMetrics = getFromVStorage('kread.market-metrics-character');
  assert.equal(vStorageCharacterMetrics.averageLevel, character.level)
  assert.equal(vStorageCharacterMetrics.marketplaceAverageLevel, 0)
  assert.equal(vStorageCharacterMetrics.amountSold, 2)
  assert.equal(vStorageCharacterMetrics.putForSaleCount, 2)
  assert.equal(vStorageCharacterMetrics.latestSalePrice, 20)

  const vStorageItemMetrics = getFromVStorage('kread.market-metrics-item');
  assert.equal(vStorageItemMetrics.amountSold, 0)
  assert.equal(vStorageItemMetrics.latestSalePrice, 0)
}
