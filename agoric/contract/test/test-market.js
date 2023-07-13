// eslint-disable-next-line import/order
import { test } from "./prepare-test-env-ava.js";
import { E } from "@endo/eventual-send";
import { AmountMath } from "@agoric/ertp";
import { bootstrapContext } from "./bootstrap.js";
import { flow } from "./flow.js";
import { makeKreadUser } from "./make-user.js";
import { addCharacterToBootstrap } from "./setup.js";

test.before(async (t) => {
  const bootstrap = await bootstrapContext();
  await addCharacterToBootstrap(bootstrap);
  const { zoe, contractAssets, assets, purses, instance } = bootstrap;
  
  const bob = makeKreadUser("bob", purses);
  const alice = makeKreadUser("alice", {
    character: contractAssets.character.issuer.makeEmptyPurse(),
    item: contractAssets.item.issuer.makeEmptyPurse(),
    payment: contractAssets.paymentFT.issuer.makeEmptyPurse(),
  });
  const topUpInvitation = await E(instance.publicFacet).makeTokenFacetInvitation();
  const proposal = harden({
    want: { Asset: AmountMath.make(contractAssets.paymentFT.brand, harden(100n)) },
  });
  const userSeat = await E(zoe).offer(topUpInvitation, proposal);
  const payout = await E(userSeat).getPayout("Asset");
  alice.depositPayment(payout);

  t.context = {
    instance,
    contractAssets,
    assets,
    purses,
    zoe,
    users: { bob, alice }
  };
});

test.serial("---| MARKET - Sell", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob }
  } = t.context;

  const { market: { bob: { give: { character } } } } = flow;

  const characterToSell = bob.getCharacters().find(c => c.name === character);
  const characterToSellAmount = AmountMath.make(contractAssets.character.brand, harden([characterToSell]));
  const priceAmount = AmountMath.make(contractAssets.paymentFT.brand, 20n);
  
  const sellCharacterInvitation = await E(publicFacet).makeSellCharacterInvitation();
  const proposal = harden({
    give: { Character: characterToSellAmount },
    want: { Price: priceAmount }
  });
  const payment = { Character: bob.withdrawCharacters(characterToSellAmount) }

  const userSeat = await E(zoe).offer(sellCharacterInvitation, proposal, payment);
  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result.characterMarket.length, 1, "Offer returns market entry");
 
  bob.setMarketSeat(userSeat);
  
  const charactersForSale = await E(publicFacet).getCharactersForSale();
  t.deepEqual(charactersForSale.length, 1, "Character is successfully added to market");

  t.deepEqual(bob.getCharacters().length, 0, "Character is no longer in bob's wallet")
});

test.serial("---| MARKET - Buy", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob, alice }
  } = t.context;
  const { market: { bob: { give: { character } } } } = flow;

  let charactersForSale = await E(publicFacet).getCharactersForSale();
  const characterToBuy = charactersForSale.find(c => c.name === character);
  
  const characterToBuyAmount = AmountMath.make(contractAssets.character.brand, harden([characterToBuy.character]));
  const priceAmount = characterToBuy.askingPrice;
  
  const buyCharacterInvitation = await E(publicFacet).makeBuyCharacterInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Character: characterToBuyAmount }
  });
  const payment = { Price: alice.withdrawPayment(priceAmount) }

  const userSeat = await E(zoe).offer(buyCharacterInvitation, proposal, payment);
  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result.characterMarket.length, 0, "Offer returns empty market entry");
  
  const characterPayout = await E(userSeat).getPayout("Character");
  alice.depositCharacters(characterPayout);
  t.deepEqual(alice.getCharacters().length, 1, "Character is in alice's wallet")

  const bobsPayout = await bob.getSeat().market.getPayout("Price");
  bob.depositPayment(bobsPayout);
  t.deepEqual(bob.getPaymentBalance(), 20n, "Bob received payout")

  charactersForSale = await E(publicFacet).getCharactersForSale();
  t.deepEqual(charactersForSale.length, 0, "Character is successfully removed to market");
});
