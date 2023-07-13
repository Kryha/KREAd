// eslint-disable-next-line import/order
import { test } from "./prepare-test-env-ava.js";
import { E } from "@endo/eventual-send";
import { AmountMath } from "@agoric/ertp";
import { bootstrapContext } from "./bootstrap.js";
import { flow } from "./flow.js";
import { addCharacterToBootstrap } from "./setup.js";

test.before(async (t) => {
  const bootstrap = await bootstrapContext();
  await addCharacterToBootstrap(bootstrap);
  t.context = bootstrap
});


test.serial("| INVENTORY - Unequip Item", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { characterName, unequip: { message } } = flow.inventory;

  let characterInventory = await E(publicFacet).getCharacterInventory(characterName);
  const hairItem = characterInventory.items.find(i => i.category === 'hair');
  const unequipInvitation = await E(publicFacet).makeUnequipInvitation();
  const characterKeyAmount = AmountMath.make(contractAssets.character.brand, harden([purses.character.getCurrentAmount().value[0]]))
  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
  }

  const wantedKeyId = (characterKeyAmount.value[0].keyId === 1) ? 2 : 1
  
  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
    },
    want: {
      Item: AmountMath.make(contractAssets.item.brand, harden([hairItem])),
      CharacterKey2: AmountMath.make(contractAssets.character.brand, harden([{...characterKeyAmount.value[0], keyId: wantedKeyId }]))
    },
  });

  const userSeat = await E(zoe).offer(unequipInvitation, proposal, payment);
  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result, message, "Unequip returns success message");

  const itemPayout = await E(userSeat).getPayout("Item");
  const characterPayout = await E(userSeat).getPayout("CharacterKey2");

  purses.item.deposit(itemPayout);
  purses.character.deposit(characterPayout);
  
  t.deepEqual(purses.item.getCurrentAmount().value.length, 1, "New Item was added to item purse successfully");
  t.deepEqual(purses.character.getCurrentAmount().value[0].name, characterName, "CharacterKey was returned to character purse successfully");

  characterInventory = await E(publicFacet).getCharacterInventory(characterName);
  t.deepEqual(characterInventory.items.length, 9, "Character Inventory contains 9 items");
});

test.serial("| INVENTORY - Equip Item", async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { characterName, equip: { message } } = flow.inventory;

  const hairItem = purses.item.getCurrentAmount().value.find(i => i.category === 'hair');
  const invitation = await E(publicFacet).makeEquipInvitation();
  const characterKeyAmount = AmountMath.make(contractAssets.character.brand, harden([purses.character.getCurrentAmount().value[0]]))
  const hairAmount = AmountMath.make(contractAssets.item.brand, harden([hairItem]));

  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
    Item: purses.item.withdraw(hairAmount)
  }

  const wantedKeyId = (characterKeyAmount.value[0].keyId === 1) ? 2 : 1
  
  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
      Item: AmountMath.make(contractAssets.item.brand, harden([hairItem])),
    },
    want: {
      CharacterKey2: AmountMath.make(contractAssets.character.brand, harden([{...characterKeyAmount.value[0], keyId: wantedKeyId }]))
    },
  });

  const userSeat = await E(zoe).offer(invitation, proposal, payment);
  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result, message, "Equip returns success message");

  const payout = await E(userSeat).getPayout("Item");
  purses.item.deposit(payout);
  t.deepEqual(purses.item.getCurrentAmount().value.length, 0, "Item was removed to item purse successfully");

  const characterInventory = await E(publicFacet).getCharacterInventory(characterName);
  t.deepEqual(characterInventory.items.length, 10, "Character Inventory contains 9 items");
});
