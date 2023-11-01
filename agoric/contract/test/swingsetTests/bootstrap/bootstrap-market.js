import { AmountMath } from '@agoric/ertp';
import { E } from '@endo/eventual-send';
import { flow } from '../flow.js';
import { makeCopyBag } from '@agoric/store';
import { addCharacterToContext } from './utils.js';
import { makeKreadUser } from './make-bootstrap-users.js';
import { errors } from '../../../src/errors.js';

export async function setupMarketTests(context) {
  await addCharacterToContext(context);
  //   await addItemToBootstrap(bootstrap, {
  //     name: 'New item2',
  //     category: 'hair',
  //     thumbnail: '',
  //     origin: 'Elphia',
  //     description: '',
  //     functional: false,
  //     rarity: 65,
  //     level: 0,
  //     filtering: 0,
  //     weight: 0,
  //     sense: 0,
  //     reserves: 0,
  //     durability: 0,
  //     date: {},
  //     colors: [''],
  //     id: 10000,
  //     image: '',
  //     artistMetadata: '',
  //   });

  const { purses, contractAssets, paymentAsset } = context;

  const bob = makeKreadUser('bob', purses);
  const alice = makeKreadUser('alice', {
    character: await E(contractAssets.character.issuer).makeEmptyPurse(),
    item: await E(contractAssets.item.issuer).makeEmptyPurse(),
    payment: paymentAsset.issuerMockIST.makeEmptyPurse(),
  });
  // const admin = makeKreadUser('admin', {
  //   character: await E(contractAssets.character.issuer).makeEmptyPurse(),
  //   item: await E(contractAssets.item.issuer).makeEmptyPurse(),
  //   payment: await E(paymentAsset.issuerMockIST).makeEmptyPurse(),
  // });

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
  /** @type {Bootstrap} */
  const {
    publicFacet,
    contractAssets,
    zoe,
    users: { bob },
    paymentAsset,
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
    'Character is successfully added to market',
  );

  assert.equal(
    (await bob.getCharacters()).length,
    0,
    "Character is no longer in bob's wallet",
  );
}

export async function buyCharacterOfferLessThanAskingPrice(context) {
  /** @type {Bootstrap} */
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
    assert.equal(error.message, errors.insufficientFunds)
    const payout = await E(userSeat).getPayout('Price');
    await alice.depositPayment(payout);
    assert.equal(await alice.getPaymentBalance(), initialBalance);
    
    throw error;
  }
}
