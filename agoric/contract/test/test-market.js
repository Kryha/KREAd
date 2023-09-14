// eslint-disable-next-line import/order
import { test } from './prepare-test-env-ava.js';
import { E } from '@endo/eventual-send';
import { AmountMath } from '@agoric/ertp';
import { bootstrapContext } from './bootstrap.js';
import { flow } from './flow.js';
import { makeKreadUser } from './make-user.js';
import { addCharacterToBootstrap, addItemToBootstrap } from './setup.js';
import { makeCopyBag } from '@agoric/store';
import { errors } from '../src/errors.js';

test.before(async (t) => {
  const bootstrap = await bootstrapContext();
  await addCharacterToBootstrap(bootstrap);
  await addItemToBootstrap(bootstrap, {
    name: 'New item',
    category: 'hair',
    thumbnail: '',
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

  const {
    zoe,
    contractAssets,
    assets,
    purses,
    instance,
    paymentAsset,
    royaltyPurse,
    platformFeePurse,
    royaltyRate,
    platformFeeRate,
  } = bootstrap;
  const bob = makeKreadUser('bob', purses);
  const alice = makeKreadUser('alice', {
    character: contractAssets.character.issuer.makeEmptyPurse(),
    item: contractAssets.item.issuer.makeEmptyPurse(),
    payment: paymentAsset.issuerMockIST.makeEmptyPurse(),
  });
  const payout = paymentAsset.mintMockIST.mintPayment(
    AmountMath.make(paymentAsset.brandMockIST, harden(100n)),
  );
  alice.depositPayment(payout);

  t.context = {
    instance,
    contractAssets,
    assets,
    purses,
    zoe,
    users: { bob, alice },
    paymentAsset,
    royaltyPurse,
    platformFeePurse,
    royaltyRate,
    platformFeeRate,
  };
});

test.serial('---| MARKET - Sell character', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob },
    paymentAsset,
  } = t.context;

  const {
    market: {
      bob: {
        give: { character },
      },
    },
  } = flow;

  const characterToSell = bob.getCharacters().find((c) => c.name === character);
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
  const payment = { Character: bob.withdrawCharacters(characterToSellAmount) };

  const userSeat = await E(zoe).offer(
    sellCharacterInvitation,
    proposal,
    payment,
  );

  const result = await E(userSeat).getOfferResult();
  // TODO: Discuss to delete this check and omit the return
  // t.deepEqual(result.characterMarket.length, 1, 'Offer returns market entry');

  bob.setMarketSeat(userSeat);

  const charactersForSale = await E(publicFacet).getCharactersForSale();
  t.deepEqual(
    charactersForSale.length,
    1,
    'Character is successfully added to market',
  );

  t.deepEqual(
    bob.getCharacters().length,
    0,
    "Character is no longer in bob's wallet",
  );
});

test.serial(
  '---| MARKET - Buy character; offer less than asking price',
  async (t) => {
    /** @type {Bootstrap} */
    const {
      instance: { publicFacet },
      contractAssets,
      zoe,
      users: { bob, alice },
      paymentAsset,
    } = t.context;
    const {
      market: {
        bob: {
          give: { character },
        },
      },
    } = flow;

    const initialBalance = alice.getPaymentBalance();

    let charactersForSale = await E(publicFacet).getCharactersForSale();
    const characterToBuy = charactersForSale.find(
      (c) => c.object.name === character,
    );

    const copyBagAmount = makeCopyBag(harden([[characterToBuy.object, 1n]]));
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
    const payment = { Price: alice.withdrawPayment(priceAmount) };

    const userSeat = await E(zoe).offer(
      buyCharacterInvitation,
      proposal,
      payment,
    );
    await t.throwsAsync(
      E(userSeat).getOfferResult(),
      undefined,
      errors.insufficientFunds,
    );

    const payout = await E(userSeat).getPayout('Price');
    alice.depositPayment(payout);

    t.deepEqual(alice.getPaymentBalance(), initialBalance);
  },
);

test.serial('---| MARKET - Buy character', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob, alice },
    royaltyPurse,
    platformFeePurse,
    royaltyRate,
    platformFeeRate,
  } = t.context;

  const {
    market: {
      bob: {
        give: { character },
      },
    },
  } = flow;

  let charactersForSale = await E(publicFacet).getCharactersForSale();
  const characterToBuy = charactersForSale.find(
    ({ object }) => object.name === character,
  );

  const copyBagAmount = makeCopyBag(harden([[characterToBuy.object, 1n]]));
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
  const payment = { Price: alice.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    buyCharacterInvitation,
    proposal,
    payment,
  );

  const result = await E(userSeat).getOfferResult();
  // TODO: Discuss to delete this check and omit the return
  // t.deepEqual(
  //   result.characterMarket.length,
  //   0,
  //   'Offer returns empty market entry',
  // );

  const characterPayout = await E(userSeat).getPayout('Character');
  alice.depositCharacters(characterPayout);
  t.deepEqual(
    alice.getCharacters().length,
    1,
    "Character is in alice's wallet",
  );

  const bobsPayout = await bob.getSeat().market.getPayout('Price');
  bob.depositPayment(bobsPayout);
  t.deepEqual(bob.getPaymentBalance(), 40n, 'Bob received payout');

  charactersForSale = await E(publicFacet).getCharactersForSale();
  t.deepEqual(
    charactersForSale.length,
    0,
    'Character is successfully removed to market',
  );

  t.deepEqual(
    royaltyPurse.getCurrentAmount().value,
    BigInt(Number(characterToBuy.askingPrice.value) * royaltyRate),
  );
  t.deepEqual(
    platformFeePurse.getCurrentAmount().value,
    BigInt(Number(characterToBuy.askingPrice.value) * platformFeeRate),
  );
});

test.serial('---| MARKET - Buy character not on market', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { alice },
    paymentAsset,
  } = t.context;
  const {
    market: {
      bob: {
        give: { character },
      },
    },
  } = flow;
  const initialBalance = alice.getPaymentBalance();

  const characterToBuy = alice
    .getCharacters()
    .find((c) => c.name === character);
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
  const payment = { Price: alice.withdrawPayment(priceAmount) };

  const userSeat = await E(zoe).offer(
    buyCharacterInvitation,
    proposal,
    payment,
  );
  await t.throwsAsync(
    E(userSeat).getOfferResult(),
    undefined,
    'Character not found',
  );

  const payout = await E(userSeat).getPayout('Price');
  alice.depositPayment(payout);

  t.deepEqual(alice.getPaymentBalance(), initialBalance);
});

test.serial('---| MARKET - Sell Item', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob },
    paymentAsset,
  } = t.context;

  const itemToSellValue = bob
    .getItems()
    .find((item) => item.category === 'hair');
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

  const payment = { Item: bob.withdrawItems(itemToSell) };

  const userSeat = await E(zoe).offer(sellItemInvitation, proposal, payment);
  const result = await E(userSeat).getOfferResult();
  // t.deepEqual(result.itemMarket.length, 1, "Offer returns market entry");

  bob.setMarketSeat(userSeat);

  const itemsForSale = await E(publicFacet).getItemsForSale();
  t.deepEqual(itemsForSale.length, 1, 'Item is successfully added to market');

  t.deepEqual(bob.getItems().length, 0, "Item is no longer in bob's wallet");
});

test.serial(
  '---| MARKET - Buy item; offer less than asking price',
  async (t) => {
    /** @type {Bootstrap} */
    const {
      instance: { publicFacet },
      contractAssets,
      zoe,
      users: { bob, alice },
      paymentAsset,
    } = t.context;

    const initialBalance = alice.getPaymentBalance();

    let itemsForSale = await E(publicFacet).getItemsForSale();
    const itemToBuy = itemsForSale.find(
      (itemEntry) => itemEntry.object.category === 'hair',
    );
    const itemToBuyCopyBagAmount = makeCopyBag(
      harden([[itemToBuy.object, 1n]]),
    );
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
    const payment = { Price: alice.withdrawPayment(priceAmount) };
    const offerArgs = { entryId: itemToBuy.id };

    const userSeat = await E(zoe).offer(
      buyItemInvitation,
      proposal,
      payment,
      offerArgs,
    );
    await t.throwsAsync(
      E(userSeat).getOfferResult(),
      undefined,
      errors.insufficientFunds,
    );

    const payout = await E(userSeat).getPayout('Price');
    alice.depositPayment(payout);

    t.deepEqual(alice.getPaymentBalance(), initialBalance);
  },
);

test.serial('---| MARKET - Buy item', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob, alice },
    paymentAsset,
  } = t.context;

  let itemsForSale = await E(publicFacet).getItemsForSale();
  const itemToBuy = itemsForSale.find(
    (itemEntry) => itemEntry.object.category === 'hair',
  );
  const itemToBuyCopyBagAmount = makeCopyBag(harden([[itemToBuy.object, 1n]]));
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
  const payment = { Price: alice.withdrawPayment(priceAmount) };
  const offerArgs = { entryId: itemToBuy.id };

  const userSeat = await E(zoe).offer(
    buyItemInvitation,
    proposal,
    payment,
    offerArgs,
  );
  const result = await E(userSeat).getOfferResult();
  // t.deepEqual(result.itemMarket.length, 0, 'Offer returns empty market entry');

  const itemPayout = await E(userSeat).getPayout('Item');
  alice.depositItems(itemPayout);
  t.deepEqual(alice.getItems().length, 1, "Item is in alice's wallet");

  const bobsPayout = await bob.getSeat().market.getPayout('Price');
  bob.depositPayment(bobsPayout);
  t.deepEqual(bob.getPaymentBalance(), 45n, 'Bob received payout');

  itemsForSale = await E(publicFacet).getItemsForSale();
  t.deepEqual(itemsForSale.length, 0, 'Item is successfully removed to market');
});

test.serial('---| MARKET - Buy item not on market', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { alice },
    paymentAsset,
  } = t.context;
  const initialBalance = alice.getPaymentBalance();

  const itemToBuy = alice.getItems().find((item) => item.category === 'hair');
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
  const payment = { Price: alice.withdrawPayment(priceAmount) };
  const offerArgs = { entryId: itemToBuy.id };

  const userSeat = await E(zoe).offer(
    buyItemInvitation,
    proposal,
    payment,
    offerArgs,
  );
  await t.throwsAsync(
    E(userSeat).getOfferResult(),
    undefined,
    'Item not found',
  );

  const payout = await E(userSeat).getPayout('Price');
  alice.depositPayment(payout);

  t.deepEqual(alice.getPaymentBalance(), initialBalance);
});

test.serial(
  '---| MARKET - Buy character; offer more than asking price',
  async (t) => {
    /** @type {Bootstrap} */
    const {
      instance: { publicFacet },
      contractAssets,
      zoe,
      users: { bob, alice },
      paymentAsset,
    } = t.context;
    const {
      market: {
        bob: {
          give: { character },
        },
      },
    } = flow;

    //alice puts character for sale
    const balanceAlice = alice.getPaymentBalance();
    const characterToSell = alice
      .getCharacters()
      .find((c) => c.name === character);

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
      Character: alice.withdrawCharacters(characterToSellAmount),
    };

    let userSeat = await E(zoe).offer(
      sellCharacterInvitation,
      proposal,
      payment,
    );
    let result = await E(userSeat).getOfferResult();

    alice.setMarketSeat(userSeat);

    let charactersForSale = await E(publicFacet).getCharactersForSale();
    t.deepEqual(
      charactersForSale.length,
      1,
      'Character is successfully added to market',
    );

    //bob buys character
    const characterToBuy = charactersForSale.find(
      ({ object }) => object.name === character,
    );
    const characterToBuyCopyBagAmount = makeCopyBag(
      harden([[characterToBuy.object, 1n]]),
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
    payment = { Price: bob.withdrawPayment(priceAmount) };

    userSeat = await E(zoe).offer(buyCharacterInvitation, proposal, payment);
    result = await E(userSeat).getOfferResult();
    // t.deepEqual(result.characterMarket.length, 0, "Offer returns empty market entry");

    const characterPayout = await E(userSeat).getPayout('Character');
    bob.depositCharacters(characterPayout);
    t.deepEqual(bob.getCharacters().length, 1, "Character is in bob's wallet");

    const alicesPayout = await alice.getSeat().market.getPayout('Price');

    alice.depositPayment(alicesPayout);
    t.deepEqual(
      alice.getPaymentBalance(),
      balanceAlice +
        priceAmount.value -
        characterToBuy.royalty.value -
        characterToBuy.platformFee.value,
      'Alice received payout',
    );

    charactersForSale = await E(publicFacet).getCharactersForSale();
    t.deepEqual(
      charactersForSale.length,
      0,
      'Character is successfully removed to market',
    );
  },
);

test.serial(
  '---| MARKET - Buy item; offer more than asking price',
  async (t) => {
    /** @type {Bootstrap} */
    const {
      instance: { publicFacet },
      contractAssets,
      zoe,
      users: { bob, alice },
      paymentAsset,
    } = t.context;

    // alice puts item for sale
    const aliceBalance = alice.getPaymentBalance();
    const itemToSell = alice
      .getItems()
      .find((item) => item.category === 'hair');
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
    let payment = { Item: alice.withdrawItems(itemToSellAmount) };

    let userSeat = await E(zoe).offer(sellItemInvitation, proposal, payment);
    let result = await E(userSeat).getOfferResult();

    alice.setMarketSeat(userSeat);

    let itemsForSale = await E(publicFacet).getItemsForSale();
    t.deepEqual(itemsForSale.length, 1, 'Item is successfully added to market');

    //bob attempts to buy item
    const itemToBuy = itemsForSale.find(
      ({ object }) => object.category === 'hair',
    );
    const itemToBuyCopyBagAmount = makeCopyBag(
      harden([[itemToBuy.object, 1n]]),
    );
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
    payment = { Price: bob.withdrawPayment(priceAmount) };
    const offerArgs = { entryId: itemToBuy.id };

    userSeat = await E(zoe).offer(
      buyItemInvitation,
      proposal,
      payment,
      offerArgs,
    );
    result = await E(userSeat).getOfferResult();
    // t.deepEqual(result.itemMarket.length, 0, "Offer returns empty market entry");

    const itemPayout = await E(userSeat).getPayout('Item');
    bob.depositItems(itemPayout);
    t.deepEqual(bob.getItems().length, 1, "Item is in bob's wallet");

    const alicesPayout = await alice.getSeat().market.getPayout('Price');
    alice.depositPayment(alicesPayout);
    t.deepEqual(
      alice.getPaymentBalance(),
      aliceBalance +
        priceAmount.value -
        itemToBuy.royalty.value -
        itemToBuy.platformFee.value,
      'Alice received payout',
    );

    itemsForSale = await E(publicFacet).getItemsForSale();
    t.deepEqual(
      itemsForSale.length,
      0,
      'Item is successfully removed to market',
    );
  },
);
