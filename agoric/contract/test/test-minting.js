// eslint-disable-next-line import/order
import { test } from "./prepare-test-env-ava.js";
import { E } from "@endo/eventual-send";
import { AmountMath, AssetKind, makeIssuerKit } from "@agoric/ertp";
import { bootstrap } from "./bootstrap.js";

test.before(async (t) => {
  const { zoe, contractAssets, assets, instance } = await bootstrap();
  t.context = {
    instance,
    contractAssets,
    assets,
    zoe,
  };
});

test("mintCharacter", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    zoe,
  } = t.context;
  const mintCharacterInvitation = await E(publicFacet).makeMintCharacterInvitation();
  const proposal = harden({
    want: { Asset: AmountMath.make(contractAssets.character.brand, harden([{ name: "TestCharacter" }])) },
  });

  const userSeat = await E(zoe).offer(mintCharacterInvitation, proposal);
  console.log("SEAT", userSeat);
  // console.log("ALLOCATION: ", userSeat.getCurrentAllocation());

  const payout = await E(userSeat).getPayouts();
  console.log(payout);

  // const characters = await E(publicFacet).getCharacters();
  // console.log("CHARACTERS", characters);
  // t.deepEqual(characterPayoutAmount.value[0].name, "TestCharacter");
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
