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
import { defaultItems } from './items.js';

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

  const { zoe, contractAssets, assets, purses, instance } = bootstrap;
  const bob = makeKreadUser('bob', purses);
  const alice = makeKreadUser('alice', {
    character: contractAssets.character.issuer.makeEmptyPurse(),
    item: contractAssets.item.issuer.makeEmptyPurse(),
    payment: contractAssets.payment.issuer.makeEmptyPurse(),
  });
  const admin = makeKreadUser('admin', {
    character: contractAssets.character.issuer.makeEmptyPurse(),
    item: contractAssets.item.issuer.makeEmptyPurse(),
    payment: contractAssets.payment.issuer.makeEmptyPurse(),
  });
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
  alice.depositPayment(payout);

  t.context = {
    instance,
    contractAssets,
    assets,
    purses,
    zoe,
    users: { bob, alice, admin },
  };
});

test.serial('---| MARKET - Sell character', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob },
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
  const priceAmount = AmountMath.make(contractAssets.payment.brand, 40n);

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
      contractAssets.payment.brand,
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
  const priceAmount = characterToBuy.askingPrice;

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
});

test.serial('---| MARKET - Buy character not on market', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { alice },
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
  const priceAmount = AmountMath.make(contractAssets.payment.brand, 5n);

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
  } = t.context;

  const itemToSellValue = bob
    .getItems()
    .find((item) => item.category === 'hair');
  const itemToSellCopyBagAmount = makeCopyBag(harden([[itemToSellValue, 1n]]));
  const itemToSell = AmountMath.make(
    contractAssets.item.brand,
    itemToSellCopyBagAmount,
  );
  const priceAmount = AmountMath.make(contractAssets.payment.brand, 5n);

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
      contractAssets.payment.brand,
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
  const priceAmount = itemToBuy.askingPrice;

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
  } = t.context;
  const initialBalance = alice.getPaymentBalance();

  const itemToBuy = alice.getItems().find((item) => item.category === 'hair');
  const itemToBuyCopyBagAmount = makeCopyBag(harden([[itemToBuy, 1n]]));
  const itemToBuyAmount = AmountMath.make(
    contractAssets.item.brand,
    itemToBuyCopyBagAmount,
  );
  const priceAmount = AmountMath.make(contractAssets.payment.brand, 5n);

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
    } = t.context;
    const {
      market: {
        bob: {
          give: { character },
        },
      },
    } = flow;

    //alice puts character for sale
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
    let priceAmount = AmountMath.make(contractAssets.payment.brand, 10n);

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
      contractAssets.payment.brand,
      characterToBuy.askingPrice.value * 2n,
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
    t.deepEqual(alice.getPaymentBalance(), 75n, 'Alice received payout');

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
    } = t.context;

    // alice puts item for sale
    const itemToSell = alice
      .getItems()
      .find((item) => item.category === 'hair');
    const itemToSellCopyBagAmount = makeCopyBag(harden([[itemToSell, 1n]]));
    const itemToSellAmount = AmountMath.make(
      contractAssets.item.brand,
      itemToSellCopyBagAmount,
    );
    let priceAmount = AmountMath.make(contractAssets.payment.brand, 10n);

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
      contractAssets.payment.brand,
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
    t.deepEqual(alice.getPaymentBalance(), 95n, 'Alice received payout');

    itemsForSale = await E(publicFacet).getItemsForSale();
    t.deepEqual(
      itemsForSale.length,
      0,
      'Item is successfully removed to market',
    );
  },
);

test.serial('---| MARKET - Internal Sell Item Batch', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob },
  } = t.context;

  const itemCollection = Object.values(defaultItems).map(item => [item, 3n])
  console.log("🤔🤔🤔");
  console.log(itemCollection)
  const itemsToSell = makeCopyBag(harden(itemCollection));
  
  const priceAmount = AmountMath.make(contractAssets.payment.brand, 5n);

  const sellItemInvitation = await E(publicFacet).makePublishItemCollectionInvitation();
  const proposal = harden({
    give: {},
    want: { Price: priceAmount },
  });

  console.log("🤔🤔🤔", itemsToSell.payload[0][0]);
  const userSeat = await E(zoe).offer(sellItemInvitation, proposal, undefined, { itemsToSell });
  const result = await E(userSeat).getOfferResult();
  // t.deepEqual(result.itemMarket.length, 1, "Offer returns market entry");

  const itemsForSale = await E(publicFacet).getItemsForSale();

  console.log("🤔🤔🤔", itemsForSale);
  t.deepEqual(itemsForSale.length, 1, 'Item is successfully added to market');

  t.deepEqual(bob.getItems().length, 0, "Item is no longer in bob's wallet");
});