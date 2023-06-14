import { test } from "./prepare-test-env-ava.js";
import { E } from "@endo/eventual-send";
import { bootstrap } from "./bootstrap.js";
import { AmountMath, AssetKind, makeIssuerKit } from "@agoric/ertp";

test.before(async (t) => {
  const { zoe, assets, instance } = await bootstrap();
  t.context = {
    instance,
    assets,
    zoe,
  };
});

test("mintCharacter", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet, creatorFacet },
    assets: { fts, nfts },
    zoe,
  } = t.context;

  const { brand: characterBrand, issuer: characterIssuer, mint: characterMint } = nfts.Character.kit;
  const { brand: moolaBrand, issuer: moolaIssuer, mint: moolaMint } = fts.Moola.kit;

  const mintCharacterInvitation = await E(publicFacet).makeMintCharacterInvitation();
  const proposal = harden({
    give: { Moola: AmountMath.make(moolaBrand, 10n) },
    want: { Character: AmountMath.make(characterBrand, harden([{ id: 1, name: "TestCharacter" }])) },
  });

  const moolaPayment = moolaMint.mintPayment(AmountMath.make(moolaBrand, 10n));
  const payments = harden({ Moola: moolaPayment });
  const userSeat = await zoe.offer(mintCharacterInvitation, proposal, payments);

  // const characters = // fetch the characters from somewhere
  // t.is(characters.length, 1);
  // t.is(characters[0].name, "TestCharacter");

  const payout = await E(userSeat).getPayouts();
  const characterPayoutAmount = await E(characterIssuer).getAmountOf(payout.Moola);
  t.deepEqual(characterPayoutAmount.value[0].name, "TestCharacter");
});

// test("mintItem", async (t) => {
// /** @type {Bootstrap} */
// const {
//   instance: { publicFacet, creatorFacet },
//   assets: { fts, nfts },
//   zoe,
// } = t.context;

// const { brand: itemBrand, issuer: itemIssuer, mint: itemMint } = nfts.Item.kit;
// const { brand: moolaBrand, issuer: moolaIssuer, mint: moolaMint } = fts.Moola.kit;

//   const mintItemInvitation = E(publicFacet).makeMintItemInvitation();
//   const proposal = harden({
//     give: { moola: AmountMath.make(moolaBrand, 10n) },
//     want: { Item: AmountMath.make(itemBrand, "TestItem") },
//   });
//   const payments = harden({ moola: moolaIssuer.makePayment(10n) });
//   const userSeat = await zoe.offer(mintItemInvitation, proposal, payments);

//   const items = // fetch the items from somewhere
//   t.is(items.length, 1);
//   t.is(items[0].name, "TestItem");

//   const payout = await E(userSeat).getPayouts();
//   const itemPayoutAmount = await E(itemIssuer).getAmountOf(payout.Item);
//   t.deepEqual(itemPayoutAmount.value[0].name, "TestItem");
// });
