// eslint-disable-next-line import/order
import { test } from './prepare-test-env-ava.js';
import { E } from '@endo/eventual-send';
import { AmountMath } from '@agoric/ertp';
import { bootstrapContext } from './bootstrap.js';
import { flow } from './flow.js';
import { addCharacterToBootstrap, addItemToBootstrap } from './setup.js';
import { makeCopyBag } from '@agoric/store';
import { errors } from '../src/errors.js';

test.before(async (t) => {
  const bootstrap = await bootstrapContext();
  await addCharacterToBootstrap(bootstrap);
  t.context = bootstrap;
});

const unequipOffer = async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const {
    characterName,
    unequip: { message },
  } = flow.inventory;

  const characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const hairItem = characterInventory.items
    .map((i) => i[0])
    .find((i) => i.category === 'hair');

  const hairItemCopyBagAmount = makeCopyBag(harden([[hairItem, 1n]]));
  const unequipInvitation = await E(publicFacet).makeUnequipInvitation();

  const characterCopyBagAmount = makeCopyBag(
    harden([[purses.character.getCurrentAmount().value.payload[0][0], 1n]]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );

  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
  };

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
    },
    want: {
      Item: AmountMath.make(contractAssets.item.brand, hairItemCopyBagAmount),
      CharacterKey2: AmountMath.make(
        contractAssets.character.brand,
        makeCopyBag(
          harden([
            [
              { ...characterKeyAmount.value.payload[0][0], keyId: wantedKeyId },
              1n,
            ],
          ]),
        ),
      ),
    },
  });

  const userSeat = await E(zoe).offer(unequipInvitation, proposal, payment);
  const itemPayout = await E(userSeat).getPayout('Item');
  const characterPayout = await E(userSeat).getPayout('CharacterKey2');
  purses.item.deposit(itemPayout);
  purses.character.deposit(characterPayout);
};

test.serial('| INVENTORY - Unequip Item', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    purses,
  } = t.context;
  const {
    characterName,
    unequip: { message },
  } = flow.inventory;

  await unequipOffer(t);

  t.deepEqual(
    purses.item.getCurrentAmount().value.payload.length,
    1,
    'New Item was added to item purse successfully',
  );
  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    characterName,
    'CharacterKey was returned to character purse successfully',
  );
  const characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  t.deepEqual(
    characterInventory.items.length,
    9,
    'Character Inventory contains 9 items',
  );
});

test.serial('| INVENTORY - Unequip already unequipped item', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { characterName } = flow.inventory;

  const unequipInvitation = await E(publicFacet).makeUnequipInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([[purses.character.getCurrentAmount().value.payload[0][0], 1n]]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
    },
    want: {
      Item: AmountMath.make(
        contractAssets.item.brand,
        makeCopyBag(
          harden([[purses.item.getCurrentAmount().value.payload[0][0], 1n]]),
        ),
      ),
      CharacterKey2: AmountMath.make(
        contractAssets.character.brand,
        makeCopyBag(
          harden([
            [
              { ...characterKeyAmount.value.payload[0][0], keyId: wantedKeyId },
              1n,
            ],
          ]),
        ),
      ),
    },
  });

  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
  };

  const userSeat = await E(zoe).offer(unequipInvitation, proposal, payment);
  const result = await E(userSeat).getOfferResult();

  t.deepEqual(result.substring(0, 19), 'Swap assets error: ');

  const characterPayout = await E(userSeat).getPayout('CharacterKey1');
  purses.character.deposit(characterPayout);
  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    characterName,
    'CharacterKey was returned to character purse successfully',
  );
});

test.serial('| INVENTORY - Unequip - wrong character', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const {
    characterName,
    unequip: { message },
  } = flow.inventory;
  const initialItemsInPurse =
    purses.item.getCurrentAmount().value.payload.length;

  let characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const noseItem = characterInventory.items
    .map((i) => i[0])
    .find((i) => i.category === 'noseline');
  const noseItemCopyBagAmount = makeCopyBag(harden([[noseItem, 1n]]));
  const characterCopyBagAmount = makeCopyBag(
    harden([[purses.character.getCurrentAmount().value.payload[0][0], 1n]]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );
  const unequipInvitation = await E(publicFacet).makeUnequipInvitation();

  //incorrectly calculate wantedKeyId
  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 1 : 2;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
    },
    want: {
      Item: AmountMath.make(contractAssets.item.brand, noseItemCopyBagAmount),
      CharacterKey2: AmountMath.make(
        contractAssets.character.brand,
        makeCopyBag(
          harden([
            [
              { ...characterKeyAmount.value.payload[0][0], keyId: wantedKeyId },
              1n,
            ],
          ]),
        ),
      ),
    },
  });

  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
  };

  const userSeat = await E(zoe).offer(unequipInvitation, proposal, payment);
  await t.throwsAsync(
    E(userSeat).getOfferResult(),
    undefined,
    'Wanted Key and Inventory Key do not match',
  );

  const itemPayout = await E(userSeat).getPayout('Item');
  const characterPayout = await E(userSeat).getPayout('CharacterKey1');
  purses.item.deposit(itemPayout);
  purses.character.deposit(characterPayout);

  t.deepEqual(
    purses.item.getCurrentAmount().value.payload.length,
    initialItemsInPurse,
    'No new Item was added to item purse',
  );
  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    characterName,
    'CharacterKey was returned to character purse successfully',
  );
});

test.serial('| INVENTORY - Equip Item', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const {
    characterName,
    equip: { message },
  } = flow.inventory;

  let characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const initialInventorySize = characterInventory.items.length;

  const hairItem = purses.item
    .getCurrentAmount()
    .value.payload.find((i) => i[0].category === 'hair');
  const hairItemCopyBagAmount = makeCopyBag(harden([[hairItem[0], 1n]]));
  const invitation = await E(publicFacet).makeEquipInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([[purses.character.getCurrentAmount().value.payload[0][0], 1n]]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );
  const hairAmount = AmountMath.make(
    contractAssets.item.brand,
    hairItemCopyBagAmount,
  );

  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
    Item: purses.item.withdraw(hairAmount),
  };

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
      Item: AmountMath.make(contractAssets.item.brand, hairItemCopyBagAmount),
    },
    want: {
      CharacterKey2: AmountMath.make(
        contractAssets.character.brand,
        harden(
          makeCopyBag([
            [
              { ...characterKeyAmount.value.payload[0][0], keyId: wantedKeyId },
              1n,
            ],
          ]),
        ),
      ),
    },
  });

  const userSeat = await E(zoe).offer(invitation, proposal, payment);
  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result, message, 'Equip returns success message');

  const itemPayout = await E(userSeat).getPayout('Item');
  const characterPayout = await E(userSeat).getPayout('CharacterKey2');

  purses.item.deposit(itemPayout);
  purses.character.deposit(characterPayout);
  t.deepEqual(
    purses.item.getCurrentAmount().value.payload.length,
    0,
    'Item was removed to item purse successfully',
  );
  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    characterName,
    'CharacterKey was returned to character purse successfully',
  );

  characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  t.deepEqual(
    characterInventory.items.length,
    initialInventorySize + 1,
    'Character Inventory size increased by one item',
  );

  // t.not(characterInventory.items.find(item => item.id === hairItem.id), undefined, "Character Inventory contains new item")
});

test.serial('| INVENTORY - Equip Item duplicate category', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { characterName } = flow.inventory;

  await addItemToBootstrap(t.context, {
    name: 'New item',
    category: 'hair',
    thumbnail: '',
    rarity: 0,
    level: 0,
    projectDescription: '',
    layerComplexity: 0,
    effectiveness: 0,
    forged: '',
    details: { boardId: '', brand: '', artist: '', metadata: '' },
    description: '',
    date: {},
    colors: [''],
    baseMaterial: '',
    id: 10000,
    image: '',
  });

  const hairItem = purses.item
    .getCurrentAmount()
    .value.payload.find((i) => i[0].category === 'hair')[0];
  const hairItemCopyBagAmount = makeCopyBag(harden([[hairItem, 1n]]));
  const invitation = await E(publicFacet).makeEquipInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([[purses.character.getCurrentAmount().value.payload[0][0], 1n]]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );
  const hairAmount = AmountMath.make(
    contractAssets.item.brand,
    hairItemCopyBagAmount,
  );

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
      Item: hairAmount,
    },
    want: {
      CharacterKey2: AmountMath.make(
        contractAssets.character.brand,
        harden(
          makeCopyBag([
            [
              { ...characterKeyAmount.value.payload[0][0], keyId: wantedKeyId },
              1n,
            ],
          ]),
        ),
      ),
    },
  });

  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
    Item: purses.item.withdraw(hairAmount),
  };

  const userSeat = await E(zoe).offer(invitation, proposal, payment);
  const result = await E(userSeat).getOfferResult();
  t.deepEqual(result, errors.duplicateCategoryInInventory);

  const characterPayout = await E(userSeat).getPayout('CharacterKey1');
  const itemPayout = await E(userSeat).getPayout('Item');

  purses.character.deposit(characterPayout);
  purses.item.deposit(itemPayout);

  const characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  t.deepEqual(
    characterInventory.items.find((item) => item.id === hairItem.id, undefined),
  );
  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    characterName,
    'CharacterKey was returned to character purse successfully',
  );
  t.deepEqual(
    purses.item.getCurrentAmount().value.payload[0][0],
    hairItem,
    'Item was returned to item purse successfully',
  );
});

test.serial('| INVENTORY - Swap Items', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { characterName } = flow.inventory;

  const invitation = await E(publicFacet).makeItemSwapInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([[purses.character.getCurrentAmount().value.payload[0][0], 1n]]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );

  const hairItem = purses.item
    .getCurrentAmount()
    .value.payload.map((i) => i[0])
    .find((i) => i.category === 'hair');

  const hairItemGiveCopyBagAmount = makeCopyBag(harden([[hairItem, 1n]]));
  const hairItemGive = AmountMath.make(
    contractAssets.item.brand,
    hairItemGiveCopyBagAmount,
  );

  const characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const hairItemWantValue = characterInventory.items
    .map((i) => i[0])
    .find((i) => i.category === 'hair');
  const hairItemWantCopyBagAmount = makeCopyBag(
    harden([[hairItemWantValue, 1n]]),
  );
  const hairItemWant = AmountMath.make(
    contractAssets.item.brand,
    hairItemWantCopyBagAmount,
  );

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
      Item1: hairItemGive,
    },
    want: {
      CharacterKey2: AmountMath.make(
        contractAssets.character.brand,
        makeCopyBag(
          harden([
            [
              { ...characterKeyAmount.value.payload[0][0], keyId: wantedKeyId },
              1n,
            ],
          ]),
        ),
      ),
      Item2: hairItemWant,
    },
  });

  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
    Item1: purses.item.withdraw(hairItemGive),
  };

  const userSeat = await E(zoe).offer(invitation, proposal, payment);

  const itemPayout = await E(userSeat).getPayout('Item2');
  const characterPayout = await E(userSeat).getPayout('CharacterKey2');

  purses.item.deposit(itemPayout);
  purses.character.deposit(characterPayout);

  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    characterName,
    'CharacterKey was returned to character purse successfully',
  );
  t.deepEqual(
    purses.item.getCurrentAmount().value.payload[0][0],
    hairItemWantValue,
  );

  const updatedCharacterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  t.deepEqual(
    updatedCharacterInventory.items
      .map((i) => i[0])
      .find((item) => item.category === 'hair'),
    hairItemGive.value.payload[0][0],
  );
  t.deepEqual(updatedCharacterInventory.items.length, 10);
});

test.serial('| INVENTORY - Swap Items - Initially empty', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { characterName } = flow.inventory;

  await unequipOffer(t);

  const invitation = await E(publicFacet).makeItemSwapInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([[purses.character.getCurrentAmount().value.payload[0][0], 1n]]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );

  const otherItemGiveCopyBagAmount = makeCopyBag(
    harden([
      [
        purses.item
          .getCurrentAmount()
          .value.payload.find(([item, supply]) => item.category === 'hair')[0],
        1n,
      ],
    ]),
  );
  const otherItemGive = AmountMath.make(
    contractAssets.item.brand,
    otherItemGiveCopyBagAmount,
  );

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
      Item1: otherItemGive,
    },
    want: {
      CharacterKey2: AmountMath.make(
        contractAssets.character.brand,
        makeCopyBag(
          harden([
            [
              { ...characterKeyAmount.value.payload[0][0], keyId: wantedKeyId },
              1n,
            ],
          ]),
        ),
      ),
      Item2: AmountMath.make(
        contractAssets.item.brand,
        makeCopyBag(harden([])),
      ),
    },
  });

  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
    Item1: purses.item.withdraw(otherItemGive),
  };

  const userSeat = await E(zoe).offer(invitation, proposal, payment);

  const itemPayout = await E(userSeat).getPayout('Item2');
  const characterPayout = await E(userSeat).getPayout('CharacterKey2');

  purses.item.deposit(itemPayout);
  purses.character.deposit(characterPayout);

  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    characterName,
    'CharacterKey was returned to character purse successfully',
  );
  t.deepEqual(purses.item.getCurrentAmount().value.payload.length, 1);
  const updatedCharacterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  t.deepEqual(
    updatedCharacterInventory.items
      .map((i) => i[0])
      .find((item) => item.category === 'hair'),
    otherItemGive.value.payload[0][0],
    'New Item added to inventory',
  );
});

test.serial('| INVENTORY - Swap Items - Different categories', async (t) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { characterName } = flow.inventory;

  const invitation = await E(publicFacet).makeItemSwapInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([[purses.character.getCurrentAmount().value.payload[0][0], 1n]]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );

  const hairItemGiveCopyBagAmount = makeCopyBag(
    harden([
      [
        purses.item
          .getCurrentAmount()
          .value.payload.find(([item, supply]) => item.category === 'hair')[0],
        1n,
      ],
    ]),
  );
  const hairItemGive = AmountMath.make(
    contractAssets.item.brand,
    hairItemGiveCopyBagAmount,
  );

  const characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const clothingItemWantValue = characterInventory.items
    .map((i) => i[0])
    .find((item) => item.category === 'clothing');
  const clothingItemWantCopyBagAmount = makeCopyBag(
    harden([[clothingItemWantValue, 1n]]),
  );
  const clothingItemWant = AmountMath.make(
    contractAssets.item.brand,
    clothingItemWantCopyBagAmount,
  );

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
      Item1: hairItemGive,
    },
    want: {
      CharacterKey2: AmountMath.make(
        contractAssets.character.brand,
        makeCopyBag(
          harden([
            [
              { ...characterKeyAmount.value.payload[0][0], keyId: wantedKeyId },
              1n,
            ],
          ]),
        ),
      ),
      Item2: clothingItemWant,
    },
  });

  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
    Item1: purses.item.withdraw(hairItemGive),
  };

  const userSeat = await E(zoe).offer(invitation, proposal, payment);
  const result = await E(userSeat).getOfferResult();

  t.deepEqual(result, errors.duplicateCategoryInInventory);

  const itemPayout = await E(userSeat).getPayout('Item1');
  const characterPayout = await E(userSeat).getPayout('CharacterKey1');

  purses.item.deposit(itemPayout);
  purses.character.deposit(characterPayout);
  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    characterName,
    'CharacterKey was returned to character purse successfully',
  );
  t.deepEqual(
    purses.item.getCurrentAmount(),
    hairItemGive,
    'Hair item returned to purse',
  );

  const updatedInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  t.deepEqual(
    updatedInventory.items
      .map((i) => i[0])
      .find((item) => item.category === 'clothing'),
    clothingItemWantValue,
    'Clothing item still in inventory',
  );
});

test.serial('| INVENTORY - Unequip all', async (t) => {
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;
  const { characterName } = flow.inventory;

  let characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const initialInventorySize = characterInventory.items.length;
  const initialPurseSize = purses.item.getCurrentAmount().value.payload.length;

  const invitation = await E(publicFacet).makeUnequipAllInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([[purses.character.getCurrentAmount().value.payload[0][0], 1n]]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
    },
    want: {
      CharacterKey2: AmountMath.make(
        contractAssets.character.brand,
        makeCopyBag(
          harden([
            [
              { ...characterKeyAmount.value.payload[0][0], keyId: wantedKeyId },
              1n,
            ],
          ]),
        ),
      ),
    },
  });

  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
  };

  const userSeat = await E(zoe).offer(invitation, proposal, payment);

  const itemPayout = await E(userSeat).getPayout('Item');
  const characterPayout = await E(userSeat).getPayout('CharacterKey2');

  purses.item.deposit(itemPayout);
  purses.character.deposit(characterPayout);

  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    characterName,
    'CharacterKey was returned to character purse successfully',
  );
  t.deepEqual(
    purses.item.getCurrentAmount().value.payload.length,
    initialInventorySize + initialPurseSize,
  );

  characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  t.deepEqual(characterInventory.items.length, 0);
});

test.serial('| INVENTORY - UnequipAll empty inventory', async (t) => {
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = t.context;

  const { characterName } = flow.inventory;

  const invitation = await E(publicFacet).makeUnequipAllInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([[purses.character.getCurrentAmount().value.payload[0][0], 1n]]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
    },
    want: {
      CharacterKey2: AmountMath.make(
        contractAssets.character.brand,
        makeCopyBag(
          harden([
            [
              { ...characterKeyAmount.value.payload[0][0], keyId: wantedKeyId },
              1n,
            ],
          ]),
        ),
      ),
    },
  });

  const payment = {
    CharacterKey1: purses.character.withdraw(characterKeyAmount),
  };

  const userSeat = await E(zoe).offer(invitation, proposal, payment);

  const itemPayout = await E(userSeat).getPayout('Item');
  const characterPayout = await E(userSeat).getPayout('CharacterKey2');
  purses.character.deposit(characterPayout);

  t.deepEqual(
    (await contractAssets.item.issuer.getAmountOf(itemPayout)).value.payload,
    [],
    'No items returned as inventory was empty',
  );
  t.deepEqual(
    purses.character.getCurrentAmount().value.payload[0][0].name,
    characterName,
    'CharacterKey was returned to character purse successfully',
  );
});
