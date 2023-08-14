// eslint-disable-next-line import/order
import { test } from "./prepare-test-env-ava.js";
import { E } from "@endo/eventual-send";
import { AmountMath } from "@agoric/ertp";
import { bootstrapContext } from "./bootstrap.js";
import { flow } from "./flow.js";
import { makeKreadUser } from "./make-user.js";
import { addCharacterToBootstrap, addItemToBootstrap } from "./setup.js";
import { errors } from "../src/errors.js"

test.before(async (t) => {
  const bootstrap = await bootstrapContext();
  await addCharacterToBootstrap(bootstrap);
  await addItemToBootstrap(bootstrap, {name: "New Item", category: "hair"})
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

test.serial("---| MARKET - Sell character", async (t) => {
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
  const priceAmount = AmountMath.make(contractAssets.paymentFT.brand, 40n);
  
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

test.serial("---| MARKET - Buy character; offer less than asking price", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob, alice }
  } = t.context;
  const { market: { bob: { give: { character } } } } = flow;

  const initialBalance = alice.getPaymentBalance()

  let charactersForSale = await E(publicFacet).getCharactersForSale();
  const characterToBuy = charactersForSale.find(c => c.name === character);
  
  const characterToBuyAmount = AmountMath.make(contractAssets.character.brand, harden([characterToBuy.character]));
  const priceAmount = AmountMath.make(contractAssets.paymentFT.brand, characterToBuy.askingPrice.value / 2n);
  
  const buyCharacterInvitation = await E(publicFacet).makeBuyCharacterInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Character: characterToBuyAmount }
  });
  const payment = { Price: alice.withdrawPayment(priceAmount) }

  const userSeat = await E(zoe).offer(buyCharacterInvitation, proposal, payment);
  await t.throwsAsync(E(userSeat).getOfferResult(), undefined, errors.insufficientFunds);

  const payout = await E(userSeat).getPayout("Price");
  alice.depositPayment(payout)

  t.deepEqual(alice.getPaymentBalance(), initialBalance)
});

test.serial("---| MARKET - Buy character", async (t) => {
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
  t.deepEqual(bob.getPaymentBalance(), 40n, "Bob received payout")

  charactersForSale = await E(publicFacet).getCharactersForSale();
  t.deepEqual(charactersForSale.length, 0, "Character is successfully removed to market");
});

test.serial("---| MARKET - Buy character not on market", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { alice }
  } = t.context;
  const { market: { bob: { give: { character } } } } = flow;
  const initialBalance = alice.getPaymentBalance()

  const characterToBuy = alice.getCharacters().find(c => c.name === character)

  const characterToBuyAmount = AmountMath.make(contractAssets.character.brand, harden([characterToBuy]));
  const priceAmount = AmountMath.make(contractAssets.paymentFT.brand, 5n)
  
  const buyCharacterInvitation = await E(publicFacet).makeBuyCharacterInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Character: characterToBuyAmount }
  });
  const payment = { Price: alice.withdrawPayment(priceAmount) }

  const userSeat = await E(zoe).offer(buyCharacterInvitation, proposal, payment);
  await t.throwsAsync(E(userSeat).getOfferResult(), undefined, "Character not found");

  const payout = await E(userSeat).getPayout("Price");
  alice.depositPayment(payout)

  t.deepEqual(alice.getPaymentBalance(), initialBalance)
});

test.serial("---| MARKET - Sell Item", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob }
  } = t.context;

  const itemToSellValue = bob.getItems().find(item => item.category === "hair")
  const itemToSell = AmountMath.make(contractAssets.item.brand, harden([itemToSellValue]))
  const priceAmount = AmountMath.make(contractAssets.paymentFT.brand, 5n);
  
  const sellItemInvitation = await E(publicFacet).makeSellItemInvitation();
  const proposal = harden({
    give: { Item: itemToSell },
    want: { Price: priceAmount }
  });
  const payment = { Item: bob.withdrawItems(itemToSell) }

  const userSeat = await E(zoe).offer(sellItemInvitation, proposal, payment);
  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result.itemMarket.length, 1, "Offer returns market entry");
 
  bob.setMarketSeat(userSeat);
  
  const itemsForSale = await E(publicFacet).getItemsForSale();
  t.deepEqual(itemsForSale.length, 1, "Item is successfully added to market");

  t.deepEqual(bob.getItems().length, 0, "Item is no longer in bob's wallet")
});


test.serial("---| MARKET - Buy item; offer less than asking price", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob, alice }
  } = t.context;

  const initialBalance = alice.getPaymentBalance()

  let itemsForSale = await E(publicFacet).getItemsForSale();
  const itemToBuy = itemsForSale.find(itemEntry => itemEntry.item.category === "hair");
  
  const itemToBuyAmount = AmountMath.make(contractAssets.item.brand, harden([itemToBuy.item]));
  const priceAmount = AmountMath.make(contractAssets.paymentFT.brand, itemToBuy.askingPrice.value / 2n);
  
  const buyItemInvitation = await E(publicFacet).makeBuyItemInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Item: itemToBuyAmount }
  });
  const payment = { Price: alice.withdrawPayment(priceAmount) }

  const userSeat = await E(zoe).offer(buyItemInvitation, proposal, payment);
  await t.throwsAsync(E(userSeat).getOfferResult(), undefined, errors.insufficientFunds);

  const payout = await E(userSeat).getPayout("Price");
  alice.depositPayment(payout)

  t.deepEqual(alice.getPaymentBalance(), initialBalance)
});

test.serial("---| MARKET - Buy item", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob, alice }
  } = t.context;

  let itemsForSale = await E(publicFacet).getItemsForSale();
  const itemToBuy = itemsForSale.find(itemEntry => itemEntry.item.category === "hair");
  const itemToBuyAmount = AmountMath.make(contractAssets.item.brand, harden([itemToBuy.item]));
  const priceAmount = itemToBuy.askingPrice;
  
  const buyItemInvitation = await E(publicFacet).makeBuyItemInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Item: itemToBuyAmount }
  });
  const payment = { Price: alice.withdrawPayment(priceAmount) }

  const userSeat = await E(zoe).offer(buyItemInvitation, proposal, payment);
  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result.itemMarket.length, 0, "Offer returns empty market entry");
  
  const itemPayout = await E(userSeat).getPayout("Item");
  alice.depositItems(itemPayout);
  t.deepEqual(alice.getItems().length, 1, "Item is in alice's wallet")

  const bobsPayout = await bob.getSeat().market.getPayout("Price");
  bob.depositPayment(bobsPayout);
  t.deepEqual(bob.getPaymentBalance(), 45n, "Bob received payout")

  itemsForSale = await E(publicFacet).getItemsForSale();
  t.deepEqual(itemsForSale.length, 0, "Item is successfully removed to market");
});

test.serial("---| MARKET - Buy item not on market", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { alice }
  } = t.context;
  const initialBalance = alice.getPaymentBalance();

  const itemToBuy = alice.getItems().find(item => item.category === "hair");
  const itemToBuyAmount = AmountMath.make(contractAssets.item.brand, harden([itemToBuy]));
  const priceAmount = AmountMath.make(contractAssets.paymentFT.brand, 5n)
  
  const buyItemInvitation = await E(publicFacet).makeBuyItemInvitation();
  const proposal = harden({
    give: { Price: priceAmount },
    want: { Item: itemToBuyAmount }
  });
  const payment = { Price: alice.withdrawPayment(priceAmount) }

  const userSeat = await E(zoe).offer(buyItemInvitation, proposal, payment);
  await t.throwsAsync(E(userSeat).getOfferResult(), undefined, "Item not found");

  const payout = await E(userSeat).getPayout("Price");
  alice.depositPayment(payout)

  t.deepEqual(alice.getPaymentBalance(), initialBalance)
});

test.serial("---| MARKET - Buy character; offer more than asking price", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob, alice }
  } = t.context;
  const { market: { bob: { give: { character } } } } = flow;

  //alice puts character for sale
  const characterToSell = alice.getCharacters().find(c => c.name === character);
  const characterToSellAmount = AmountMath.make(contractAssets.character.brand, harden([characterToSell]));
  let priceAmount = AmountMath.make(contractAssets.paymentFT.brand, 10n);
  
  const sellCharacterInvitation = await E(publicFacet).makeSellCharacterInvitation();
  let proposal = harden({
    give: { Character: characterToSellAmount },
    want: { Price: priceAmount }
  });
  let payment = { Character: alice.withdrawCharacters(characterToSellAmount) }

  let userSeat = await E(zoe).offer(sellCharacterInvitation, proposal, payment);
  let result = await E(userSeat).getOfferResult();
 
  alice.setMarketSeat(userSeat);
  
  let charactersForSale = await E(publicFacet).getCharactersForSale();
  t.deepEqual(charactersForSale.length, 1, "Character is successfully added to market");

  //bob buys character
  const characterToBuy = charactersForSale.find(c => c.name === character);
  const characterToBuyAmount = AmountMath.make(contractAssets.character.brand, harden([characterToBuy.character]));
  priceAmount = AmountMath.make(contractAssets.paymentFT.brand, characterToBuy.askingPrice.value * 2n);
  
  const buyCharacterInvitation = await E(publicFacet).makeBuyCharacterInvitation();
  proposal = harden({
    give: { Price: priceAmount },
    want: { Character: characterToBuyAmount }
  });
  payment = { Price: bob.withdrawPayment(priceAmount) }

  userSeat = await E(zoe).offer(buyCharacterInvitation, proposal, payment);
  result = await E(userSeat).getOfferResult();
  t.deepEqual(result.characterMarket.length, 0, "Offer returns empty market entry");
  
  const characterPayout = await E(userSeat).getPayout("Character");
  bob.depositCharacters(characterPayout);
  t.deepEqual(bob.getCharacters().length, 1, "Character is in bob's wallet")

  const alicesPayout = await alice.getSeat().market.getPayout("Price");
  alice.depositPayment(alicesPayout);
  t.deepEqual(alice.getPaymentBalance(), 75n, "Alice received payout")

  charactersForSale = await E(publicFacet).getCharactersForSale();
  t.deepEqual(charactersForSale.length, 0, "Character is successfully removed to market");
});

test.serial("---| MARKET - Buy item; offer more than asking price", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
    users: { bob, alice }
  } = t.context;

  //alice puts item for sale
  const itemToSell = alice.getItems().find(item => item.category === "hair");
  const itemToSellAmount = AmountMath.make(contractAssets.item.brand, harden([itemToSell]));
  let priceAmount = AmountMath.make(contractAssets.paymentFT.brand, 10n);
  
  const sellItemInvitation = await E(publicFacet).makeSellItemInvitation();
  let proposal = harden({
    give: { Item: itemToSellAmount },
    want: { Price: priceAmount }
  });
  let payment = { Item: alice.withdrawItems(itemToSellAmount) }

  let userSeat = await E(zoe).offer(sellItemInvitation, proposal, payment);
  let result = await E(userSeat).getOfferResult();
 
  alice.setMarketSeat(userSeat);
  
  let itemsForSale = await E(publicFacet).getItemsForSale();
  t.deepEqual(itemsForSale.length, 1, "Item is successfully added to market");

  //bob attempts to buy item
  const itemToBuy = itemsForSale.find(itemEntry => itemEntry.item.category === "hair");
  const itemToBuyAmount = AmountMath.make(contractAssets.item.brand, harden([itemToBuy.item]));
  priceAmount = AmountMath.make(contractAssets.paymentFT.brand, itemToBuy.askingPrice.value * 2n);
  
  const buyItemInvitation = await E(publicFacet).makeBuyItemInvitation();
  proposal = harden({
    give: { Price: priceAmount },
    want: { Item: itemToBuyAmount }
  });
  payment = { Price: bob.withdrawPayment(priceAmount) }

  userSeat = await E(zoe).offer(buyItemInvitation, proposal, payment);
  result = await E(userSeat).getOfferResult();
  t.deepEqual(result.itemMarket.length, 0, "Offer returns empty market entry");
  
  const itemPayout = await E(userSeat).getPayout("Item");
  bob.depositItems(itemPayout); 
  t.deepEqual(bob.getItems().length, 1, "Item is in bob's wallet")

  const alicesPayout = await alice.getSeat().market.getPayout("Price");
  alice.depositPayment(alicesPayout);
  t.deepEqual(alice.getPaymentBalance(), 95n, "Alice received payout")

  itemsForSale = await E(publicFacet).getItemsForSale();
  t.deepEqual(itemsForSale.length, 0, "Item is successfully removed to market");
});