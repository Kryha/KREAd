// eslint-disable-next-line import/order
import { test } from "./prepare-test-env-ava.js";
import { E } from "@endo/eventual-send";
import { AmountMath, makeIssuerKit, AssetKind } from "@agoric/ertp";
import { bootstrap } from "./bootstrap.js";
import { errors } from "../src/errors.js";

test.before(async (t) => {
  const { zoe, assets, instance } = await bootstrap();
  t.context = {
    instance,
    assets,
    zoe,
  };
});

test("equip", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    assets: { nfts },
    zoe,
  } = t.context;

  // Setup
  const { brand: characterBrand, issuer: characterIssuer, mint: characterMint } = nfts.Character.kit;
  const { brand: itemBrand, issuer: itemIssuer, mint: itemMint } = nfts.Item.kit;
  const characterAmount = AmountMath.make(characterBrand, harden([{ id: 1, name: "TestCharacter" }]));
  const characterPayment = characterMint.mintPayment(characterAmount);
  const itemAmount = AmountMath.make(itemBrand, harden([{ id: 1, name: "TestItem", category: "hair" }]));
  const itemPayment = itemMint.mintPayment(itemAmount);

  // Make invitation
  const equipInvitation = await E(publicFacet).makeEquipInvitation();

  // Make sure an error is thrown if no item is provided
  // const badProposal = harden({
  //   give: { CharacterKey1: characterAmount },
  //   want: { CharacterKey2: characterAmount },
  // });
  // const badPayment = harden({ CharacterKey1: characterPayment });
  // await t.throwsAsync(async () => await E(zoe).offer(equipInvitation, badProposal, badPayment), { message: errors.noItemsRequested });

  // Now equip the item to the character
  const proposal = harden({
    give: { CharacterKey1: characterAmount, Item: itemAmount },
    want: { CharacterKey2: characterAmount },
  });
  const payments = harden({ CharacterKey1: characterPayment, Item: itemPayment });

  const seat = await E(zoe).offer(equipInvitation, proposal, payments);

  // Assertions
  const finalAllocation = await E(seat).getFinalAllocation();

  console.log(finalAllocation);
  t.truthy(AmountMath.isEmpty(finalAllocation.CharacterKey1, characterBrand));
  t.truthy(AmountMath.isEqual(finalAllocation.CharacterKey2, characterAmount));
  t.truthy(AmountMath.isEmpty(finalAllocation.Item, itemBrand));
});

/**
 * TODO: update all below tests with the correct structure when the one above is working
 */

// test("unequip", async (t) => {
//   /** @type {Bootstrap} */
//   const {
//     instance: { publicFacet },
//     assets: { nfts },
//     zoe,
//   } = t.context;

//   // Setup
//   const { brand: characterBrand, issuer: characterIssuer, mint: characterMint } = nfts.Character.kit;
//   const { brand: itemBrand, issuer: itemIssuer, mint: itemMint } = nfts.Item.kit;
//   const characterAmount = AmountMath.make(characterBrand, harden([{ id: 1, name: "TestCharacter" }]));
//   const characterPayment = characterMint.mintPayment(characterAmount);
//   const itemAmount = AmountMath.make(itemBrand, harden([{ id: 1, name: "TestItem", category: "hair" }]));
//   const itemPayment = itemMint.mintPayment(itemAmount);

//   // Make invitation
//   const unequipInvitation = await E(publicFacet).makeUnequipInvitation();

//   // Equip an item to the character first
//   const equipInvitation = E(publicFacet).makeEquipInvitation();
//   const equipProposal = harden({
//     give: { CharacterKey1: characterAmount, Item: itemAmount },
//     want: { CharacterKey2: characterAmount },
//   });
//   const equipPayments = harden({ CharacterKey1: characterPayment, Item: itemPayment });
//   await E(zoe).offer(equipInvitation, equipProposal, equipPayments);

//   // Make sure an error is thrown if no item is requested
//   const badProposal = harden({
//     give: { CharacterKey1: characterAmount },
//     want: { CharacterKey2: characterAmount },
//   });
//   const badPayments = harden({ CharacterKey1: characterPayment });
//   await t.throwsAsync(async () => await E(zoe).offer(unequipInvitation, badProposal, badPayments), { message: errors.noItemsRequested });

//   // Now unequip the item from the character
//   const proposal = harden({
//     give: { CharacterKey1: characterAmount },
//     want: { CharacterKey2: characterAmount, Item: itemAmount },
//   });
//   const payments = harden({ CharacterKey1: characterPayment });
//   const seat = await E(zoe).offer(unequipInvitation, proposal, payments);

//   // Assertions
//   const currentAllocation = seat.getCurrentAllocation();
//   t.truthy(AmountMath.isEmpty(currentAllocation.CharacterKey1, characterBrand));
//   t.truthy(AmountMath.isEqual(currentAllocation.CharacterKey2, characterAmount));
//   t.truthy(AmountMath.isEqual(currentAllocation.Item, itemAmount));
// });

// test("unequipAll", async (t) => {
//   /** @type {Bootstrap} */
//   const {
//     instance: { publicFacet },
//     zoe,
//   } = t.context;

//   // Setup CharacterKey and Item issuers
//   const characterKit = makeIssuerKit("CharacterKey", AssetKind.SET);
//   const itemKit = makeIssuerKit("Item", AssetKind.SET);

//   // Create a character and multiple items
//   const characterBrand = characterKit.brand;
//   const characterAmount = AmountMath.make(characterBrand, [{ id: 1, name: "TestCharacter" }]);
//   const characterPayment = characterKit.mint.mintPayment(characterAmount);

//   const itemBrand = itemKit.brand;
//   const itemAmount1 = AmountMath.make(itemBrand, [{ id: 1, name: "TestItem1", category: "hair" }]);
//   const itemPayment1 = itemKit.mint.mintPayment(itemAmount1);
//   const itemAmount2 = AmountMath.make(itemBrand, [{ id: 2, name: "TestItem2", category: "shirt" }]);
//   const itemPayment2 = itemKit.mint.mintPayment(itemAmount2);

//   // Equip the items to the character first
//   const equipInvitation1 = E(publicFacet).makeEquipInvitation();
//   const equipProposal1 = harden({
//     give: { CharacterKey1: characterAmount, Item: itemAmount1 },
//     want: { CharacterKey2: characterAmount },
//   });
//   const equipPayments1 = harden({ CharacterKey1: characterPayment, Item: itemPayment1 });
//   await E(zoe).offer(equipInvitation1, equipProposal1, equipPayments1);

//   const equipInvitation2 = E(publicFacet).makeEquipInvitation();
//   const equipProposal2 = harden({
//     give: { CharacterKey1: characterAmount, Item: itemAmount2 },
//     want: { CharacterKey2: characterAmount },
//   });
//   const equipPayments2 = harden({ CharacterKey1: characterPayment, Item: itemPayment2 });
//   await E(zoe).offer(equipInvitation2, equipProposal2, equipPayments2);

//   // Now unequip all the items from the character
//   const unequipAllInvitation = E(publicFacet).makeUnequipAllInvitation();
//   const proposal = harden({
//     give: { CharacterKey1: characterAmount },
//     want: { CharacterKey2: characterAmount, Item: AmountMath.add(itemAmount1, itemAmount2) },
//   });
//   const payments = harden({ CharacterKey1: characterPayment });
//   const seat = await E(zoe).offer(unequipAllInvitation, proposal, payments);

//   // Assertions
//   const currentAllocation = seat.getCurrentAllocation();
//   t.truthy(AmountMath.isEmpty(currentAllocation.CharacterKey1, characterBrand));
//   t.truthy(AmountMath.isEqual(currentAllocation.CharacterKey2, characterAmount));
//   t.truthy(AmountMath.isEqual(currentAllocation.Item, AmountMath.add(itemAmount1, itemAmount2)));
// });

// test("swapItems", async (t) => {
//   /** @type {Bootstrap} */
//   const {
//     instance: { publicFacet },
//     zoe,
//   } = t.context;

//   // Setup CharacterKey and Item issuers
//   const characterKit = makeIssuerKit("CharacterKey", AssetKind.SET);
//   const itemKit = makeIssuerKit("Item", AssetKind.SET);

//   // Create a character and items
//   const characterBrand = characterKit.brand;
//   const characterAmount = AmountMath.make(characterBrand, [{ id: 1, name: "TestCharacter" }]);
//   const characterPayment = characterKit.mint.mintPayment(characterAmount);

//   const itemBrand = itemKit.brand;
//   const itemAmount1 = AmountMath.make(itemBrand, [{ id: 1, name: "TestItem1", category: "hair" }]);
//   const itemPayment1 = itemKit.mint.mintPayment(itemAmount1);
//   const itemAmount2 = AmountMath.make(itemBrand, [{ id: 2, name: "TestItem2", category: "clothing" }]);
//   const itemPayment2 = itemKit.mint.mintPayment(itemAmount2);

//   // Equip item1 to the character first
//   const equipInvitation1 = E(publicFacet).makeEquipInvitation();
//   const equipProposal1 = harden({
//     give: { CharacterKey1: characterAmount, Item: itemAmount1 },
//     want: { CharacterKey2: characterAmount },
//   });
//   const equipPayments1 = harden({ CharacterKey1: characterPayment, Item: itemPayment1 });
//   await E(zoe).offer(equipInvitation1, equipProposal1, equipPayments1);

//   // Now swap item1 with item2
//   const swapInvitation = E(publicFacet).makeItemSwapInvitation();
//   const proposal = harden({
//     give: { CharacterKey1: characterAmount, Item1: itemAmount2 },
//     want: { CharacterKey2: characterAmount, Item2: itemAmount1 },
//   });
//   const payments = harden({ CharacterKey1: characterPayment, Item1: itemPayment2 });
//   const seat = await E(zoe).offer(swapInvitation, proposal, payments);

//   // Assertions
//   const currentAllocation = seat.getCurrentAllocation();
//   t.truthy(AmountMath.isEmpty(currentAllocation.CharacterKey1, characterBrand));
//   t.truthy(AmountMath.isEqual(currentAllocation.CharacterKey2, characterAmount));
//   t.truthy(AmountMath.isEqual(currentAllocation.Item1, itemAmount1));
//   t.truthy(AmountMath.isEmpty(currentAllocation.Item2, itemBrand));
// });
