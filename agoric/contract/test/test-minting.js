import { test } from "./prepare-test-env-ava.js";
import { E } from "@endo/eventual-send";
import { bootstrap } from "./bootstrap.js";

test.before(async (t) => {
  const config = {
    contractPath: "./src/index.js",
    // privateArgs: {
    //   defaultCharacters: [
    //     {
    //       id: 1,
    //       name: "TestCharacter",
    //     },
    //   ],
    //   defaultItems: [
    //     {
    //       id: 1,
    //       name: "TestItem",
    //       category: "hair",
    //     },
    //   ],
    // },
  };

  const { zoe, instance } = await bootstrap(config);
  t.context = {
    instance,
    zoe,
  };
});

test("mintCharacter", async (t) => {
  console.log(t);
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    zoe,
  } = t.context;

  const mintCharacterInvitation = E(publicFacet).makeMintCharacterInvitation();
  const proposal = harden({
    give: { Money: AmountMath.make(moneyBrand, 10n) },
    want: { Asset: AmountMath.make(characterBrand, "TestCharacter") },
  });
  const payments = harden({ Money: moneyIssuer.makePayment(10n) });
  const userSeat = await zoe.offer(mintCharacterInvitation, proposal, payments);

  const characters = await E(creatorFacet).getCharacters();
  t.is(characters.length, 1);
  t.is(characters[0].name, "TestCharacter");

  const payout = await E(userSeat).getPayouts();
  const characterPayoutAmount = await E(characterIssuer).getAmountOf(payout.Asset);
  t.deepEqual(characterPayoutAmount.value[0].name, "TestCharacter");
});

test("mintItem", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    zoe,
  } = t.context;

  const mintItemInvitation = E(publicFacet).makeMintItemInvitation();
  const proposal = harden({
    give: { Money: AmountMath.make(moneyBrand, 10n) },
    want: { Item: AmountMath.make(itemBrand, "TestItem") },
  });
  const payments = harden({ Money: moneyIssuer.makePayment(10n) });
  const userSeat = await zoe.offer(mintItemInvitation, proposal, payments);

  const items = await E(creatorFacet).getItems();
  t.is(items.length, 1);
  t.is(items[0].name, "TestItem");

  const payout = await E(userSeat).getPayouts();
  const itemPayoutAmount = await E(itemIssuer).getAmountOf(payout.Item);
  t.deepEqual(itemPayoutAmount.value[0].name, "TestItem");
});
