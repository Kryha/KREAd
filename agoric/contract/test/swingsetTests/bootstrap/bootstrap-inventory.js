import { addCharacterToContext, addItemToContext } from './utils.js';
import { flow } from '../flow.js';
import { E } from '@endo/eventual-send';
import { makeCopyBag, mustMatch } from '@agoric/store';
import { AmountMath } from '@agoric/ertp';
import { errors } from '../../../src/errors.js';

export async function setupInventoryTests(context) {
  await addCharacterToContext(context);
  return context;
}

const unequipOffer = async (context) => {
  /** @type {Context} */
  const { publicFacet, contractAssets, purses, zoe } = context;
  const { characterName } = flow.inventory;

  const characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const uncommonToLegendary = characterInventory.items
    .map((i) => i[0])
    .filter((i) => i.rarity > 19)[0];

  const legendaryCopyBagAmount = makeCopyBag(
    harden([[uncommonToLegendary, 1n]]),
  );
  const unequipInvitation = await E(publicFacet).makeUnequipInvitation();

  const characterCopyBagAmount = makeCopyBag(
    harden([
      [(await E(purses.character).getCurrentAmount()).value.payload[0][0], 1n],
    ]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );

  const payment = {
    CharacterKey1: await E(purses.character).withdraw(characterKeyAmount),
  };

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
    },
    want: {
      Item: AmountMath.make(contractAssets.item.brand, legendaryCopyBagAmount),
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
  await E(purses.item).deposit(itemPayout);
  await E(purses.character).deposit(characterPayout);
};

export async function unequipItem(context) {
  /** @type {Context} */
  const { publicFacet, purses } = context;
  const { characterName } = flow.inventory;

  await unequipOffer(context);

  assert.equal(
    (await E(purses.item).getCurrentAmount()).value.payload.length,
    1,
    'New Item was not added to item purse',
  );
  assert.equal(
    (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
    characterName,
    'CharacterKey was not returned to character purse',
  );
  const characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  assert.equal(
    characterInventory.items.length,
    2,
    'Character Inventory does not contain 2 items',
  );
}

export async function unequipAlreadyUnequippedItem(context) {
  /** @type {Context} */
  const { publicFacet, contractAssets, purses, zoe } = context;
  const { characterName } = flow.inventory;

  const unequipInvitation = await E(publicFacet).makeUnequipInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([
      [(await E(purses.character).getCurrentAmount()).value.payload[0][0], 1n],
    ]),
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
          harden([
            [(await E(purses.item).getCurrentAmount()).value.payload[0][0], 1n],
          ]),
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
    CharacterKey1: await E(purses.character).withdraw(characterKeyAmount),
  };

  const userSeat = await E(zoe).offer(unequipInvitation, proposal, payment);
  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, errors.rearrangeError);

    const characterPayout = await E(userSeat).getPayout('CharacterKey1');
    await E(purses.character).deposit(characterPayout);
    assert.equal(
      (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
      characterName,
      'CharacterKey was not returned to character purse',
    );
    throw error;
  }
}

export async function unequipWithWrongCharacter(context) {
  /** @type {Context} */
  const { publicFacet, contractAssets, purses, zoe } = context;
  const { characterName } = flow.inventory;
  const initialItemsInPurse = (await E(purses.item).getCurrentAmount()).value
    .payload.length;

  const characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const noseItem = characterInventory.items
    .map((i) => i[0])
    .filter((i) => i.rarity < 59)[0];
  const noseItemCopyBagAmount = makeCopyBag(harden([[noseItem, 1n]]));
  const characterCopyBagAmount = makeCopyBag(
    harden([
      [(await E(purses.character).getCurrentAmount()).value.payload[0][0], 1n],
    ]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );
  const unequipInvitation = await E(publicFacet).makeUnequipInvitation();

  // incorrectly calculate wantedKeyId
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
    CharacterKey1: await E(purses.character).withdraw(characterKeyAmount),
  };

  const userSeat = await E(zoe).offer(unequipInvitation, proposal, payment);
  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, 'Wanted Key and Inventory Key do not match');

    const itemPayout = await E(userSeat).getPayout('Item');
    const characterPayout = await E(userSeat).getPayout('CharacterKey1');
    await E(purses.item).deposit(itemPayout);
    await E(purses.character).deposit(characterPayout);

    assert.equal(
      (await E(purses.item).getCurrentAmount()).value.payload.length,
      initialItemsInPurse,
      'No new Item was not added to item purse',
    );
    assert.equal(
      (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
      characterName,
      'CharacterKey was nnot returned to character purse',
    );
    throw error;
  }
}

export async function equipItem(context) {
  /** @type {Context} */
  const { publicFacet, contractAssets, purses, zoe } = context;
  const {
    characterName,
    equip: { message },
  } = flow.inventory;

  let characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const initialInventorySize = characterInventory.items.length;

  const item = (await E(purses.item).getCurrentAmount()).value.payload[0];
  
  const itemCopyBagAmount = makeCopyBag(harden([[item[0], 1n]]));
  const invitation = await E(publicFacet).makeEquipInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([
      [(await E(purses.character).getCurrentAmount()).value.payload[0][0], 1n],
    ]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );
  const itemAmount = AmountMath.make(
    contractAssets.item.brand,
    itemCopyBagAmount,
  );

  const payment = {
    CharacterKey1: await E(purses.character).withdraw(characterKeyAmount),
    Item: await E(purses.item).withdraw(itemAmount),
  };

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
      Item: AmountMath.make(contractAssets.item.brand, itemCopyBagAmount),
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
  assert.equal(result, message, 'Equip does not return success message');

  const itemPayout = await E(userSeat).getPayout('Item');
  const characterPayout = await E(userSeat).getPayout('CharacterKey2');

  await E(purses.item).deposit(itemPayout);
  await E(purses.character).deposit(characterPayout);
  assert.equal(
    (await E(purses.item).getCurrentAmount()).value.payload.length,
    0,
    'Item was not removed from item purse',
  );
  assert.equal(
    (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
    characterName,
    'CharacterKey was not returned to character purse',
  );

  characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  assert.equal(
    characterInventory.items.length,
    initialInventorySize + 1,
    'Character Inventory size did not increase by one item',
  );

  // t.not(characterInventory.items.find(item => item.id === hairItem.id), undefined, "Character Inventory contains new item")
}

export async function equipItemDuplicateCategory(context) {
  /** @type {Context} */
  const { publicFacet, contractAssets, purses, zoe } = context;
  const { characterName } = flow.inventory;
    const inventory = await E(publicFacet).getCharacterInventory(characterName)
    const existingCategory = inventory.items[0][0].category;
  await addItemToContext(context, {
    name: 'New item',
    category: existingCategory,
    thumbnail: '',
    origin: 'Tempet',
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
  const item = (await E(purses.item).getCurrentAmount()).value.payload.find(
    (i) => i[0].category === existingCategory,
  )[0];
  const itemCopyBagAmount = makeCopyBag(harden([[item, 1n]]));
  const invitation = await E(publicFacet).makeEquipInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([
      [(await E(purses.character).getCurrentAmount()).value.payload[0][0], 1n],
    ]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );
  const hairAmount = AmountMath.make(
    contractAssets.item.brand,
    itemCopyBagAmount,
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
    CharacterKey1: await E(purses.character).withdraw(characterKeyAmount),
    Item: await E(purses.item).withdraw(hairAmount),
  };
  const userSeat = await E(zoe).offer(invitation, proposal, payment);
  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, errors.duplicateCategoryInInventory);

    const characterPayout = await E(userSeat).getPayout('CharacterKey1');
    const itemPayout = await E(userSeat).getPayout('Item');

    await E(purses.character).deposit(characterPayout);
    await E(purses.item).deposit(itemPayout);

    const characterInventory = await E(publicFacet).getCharacterInventory(
      characterName,
    );
    assert.equal(
      characterInventory.items.find(
        (equippedItem) => equippedItem.id === item.id,
        undefined,
      ),
    );
    assert.equal(
      (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
      characterName,
      'CharacterKey was not returned to character purse',
    );
    assert.equal(
      (await E(purses.item).getCurrentAmount()).value.payload[0][0],
      item,
      'Item was not returned to item purse',
    );
    throw error;
  }
}

export async function swapItems(context) {
  /** @type {Context} */
  const { publicFacet, contractAssets, purses, zoe } = context;
  const { characterName } = flow.inventory;

  const invitation = await E(publicFacet).makeItemSwapInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([
      [(await E(purses.character).getCurrentAmount()).value.payload[0][0], 1n],
    ]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );

  const item = (await E(purses.item).getCurrentAmount()).value.payload
    .map((i) => i[0])
    .find(({ rarity }) => rarity > 19);

  const itemGiveCopyBagAmount = makeCopyBag(harden([[item, 1n]]));
  const itemGive = AmountMath.make(
    contractAssets.item.brand,
    itemGiveCopyBagAmount,
  );

  const characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const itemWantValue = characterInventory.items
    .map((i) => i[0])
    .find(({ rarity }) => rarity > 19);
  const itemWantCopyBagAmount = makeCopyBag(
    harden([[itemWantValue, 1n]]),
  );
  const itemWant = AmountMath.make(
    contractAssets.item.brand,
    itemWantCopyBagAmount,
  );

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
      Item1: itemGive,
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
      Item2: itemWant,
    },
  });

  const payment = {
    CharacterKey1: await E(purses.character).withdraw(characterKeyAmount),
    Item1: await E(purses.item).withdraw(itemGive),
  };

  const userSeat = await E(zoe).offer(invitation, proposal, payment);

  const itemPayout = await E(userSeat).getPayout('Item2');
  const characterPayout = await E(userSeat).getPayout('CharacterKey2');

  await E(purses.item).deposit(itemPayout);
  await E(purses.character).deposit(characterPayout);

  assert.equal(
    (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
    characterName,
    'CharacterKey was not returned to character purse',
  );
  mustMatch(
    (await E(purses.item).getCurrentAmount()).value.payload[0][0],
    itemWantValue,
  );

  const updatedCharacterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  mustMatch(
    updatedCharacterInventory.items
      .map((i) => i[0])
      .find((inventoryItem) => inventoryItem.rarity > 19),
    itemGive.value.payload[0][0],
  );
  assert.equal(updatedCharacterInventory.items.length, 3);
}

export async function swapItemsInitiallyEmpty(context) {
  /** @type {Context} */
  const { publicFacet, contractAssets, purses, zoe } = context;
  const { characterName } = flow.inventory;

  await unequipOffer(context);

  const invitation = await E(publicFacet).makeItemSwapInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([
      [(await E(purses.character).getCurrentAmount()).value.payload[0][0], 1n],
    ]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );

  const otherItemGiveCopyBagAmount = makeCopyBag(
    harden([
      [
        (await E(purses.item).getCurrentAmount()).value.payload.find(
          ([item, _supply]) => item.rarity > 19,
        )[0],
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
    CharacterKey1: await E(purses.character).withdraw(characterKeyAmount),
    Item1: await E(purses.item).withdraw(otherItemGive),
  };

  const userSeat = await E(zoe).offer(invitation, proposal, payment);

  const itemPayout = await E(userSeat).getPayout('Item2');
  const characterPayout = await E(userSeat).getPayout('CharacterKey2');

  await E(purses.item).deposit(itemPayout);
  await E(purses.character).deposit(characterPayout);

  assert.equal(
    (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
    characterName,
    'CharacterKey was not returned to character purse',
  );
  assert.equal(
    (await E(purses.item).getCurrentAmount()).value.payload.length,
    1,
  );
  const updatedCharacterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  mustMatch(
    updatedCharacterInventory.items
      .map((i) => i[0])
      .find((inventoryItem) => inventoryItem.rarity > 19),
    otherItemGive.value.payload[0][0],
    'New Item was not added to inventory',
  );
}

export async function swapItemsDifferentCategories(context) {
  /** @type {Context} */
  const { publicFacet, contractAssets, purses, zoe } = context;
  const { characterName } = flow.inventory;

  const invitation = await E(publicFacet).makeItemSwapInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([
      [(await E(purses.character).getCurrentAmount()).value.payload[0][0], 1n],
    ]),
  );
  const characterKeyAmount = AmountMath.make(
    contractAssets.character.brand,
    characterCopyBagAmount,
  );

  const itemGiveCopyBagAmount = makeCopyBag(
    harden([
      [
        (await E(purses.item).getCurrentAmount()).value.payload.find(
          ([item, _supply]) => item.rarity > 19,
        )[0],
        1n,
      ],
    ]),
  );

  const itemGive = AmountMath.make(
    contractAssets.item.brand,
    itemGiveCopyBagAmount,
  );

  const characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const itemWantValue = characterInventory.items
    .map((i) => i[0])
    .find((item) => item.rarity < 20);
  const clothingItemWantCopyBagAmount = makeCopyBag(
    harden([[itemWantValue, 1n]]),
  );
  const itemWant = AmountMath.make(
    contractAssets.item.brand,
    clothingItemWantCopyBagAmount,
  );

  const wantedKeyId =
    characterKeyAmount.value.payload[0][0].keyId === 1 ? 2 : 1;

  const proposal = harden({
    give: {
      CharacterKey1: characterKeyAmount,
      Item1: itemGive,
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
      Item2: itemWant,
    },
  });

  const payment = {
    CharacterKey1: await E(purses.character).withdraw(characterKeyAmount),
    Item1: await E(purses.item).withdraw(itemGive),
  };

  const userSeat = await E(zoe).offer(invitation, proposal, payment);
  try {
    await E(userSeat).getOfferResult();
  } catch (error) {
    assert.equal(error.message, errors.duplicateCategoryInInventory);

    const itemPayout = await E(userSeat).getPayout('Item1');
    const characterPayout = await E(userSeat).getPayout('CharacterKey1');

    await E(purses.item).deposit(itemPayout);
    await E(purses.character).deposit(characterPayout);
    assert.equal(
      (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
      characterName,
      'CharacterKey was not returned to character purse',
    );
    mustMatch(
      await E(purses.item).getCurrentAmount(),
      itemGive,
      'Item not returned to purse',
    );

    const updatedInventory = await E(publicFacet).getCharacterInventory(
      characterName,
    );
    mustMatch(
      updatedInventory.items.map((i) => i[0]).find((item) => item.rarity < 20),
      itemWantValue,
      'Clothing item was not still in inventory',
    );
    throw error;
  }
}

export async function unequipAll(context) {
  const { publicFacet, contractAssets, purses, zoe } = context;
  const { characterName } = flow.inventory;

  let characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  const initialInventorySize = characterInventory.items.length;
  const initialPurseSize = (await E(purses.item).getCurrentAmount()).value
    .payload.length;

  const invitation = await E(publicFacet).makeUnequipAllInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([
      [(await E(purses.character).getCurrentAmount()).value.payload[0][0], 1n],
    ]),
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
    CharacterKey1: await E(purses.character).withdraw(characterKeyAmount),
  };

  const userSeat = await E(zoe).offer(invitation, proposal, payment);

  const itemPayout = await E(userSeat).getPayout('Item');
  const characterPayout = await E(userSeat).getPayout('CharacterKey2');

  await E(purses.item).deposit(itemPayout);
  await E(purses.character).deposit(characterPayout);

  assert.equal(
    (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
    characterName,
    'CharacterKey was not returned to character purse',
  );
  assert.equal(
    (await E(purses.item).getCurrentAmount()).value.payload.length,
    initialInventorySize + initialPurseSize,
  );

  characterInventory = await E(publicFacet).getCharacterInventory(
    characterName,
  );
  assert.equal(characterInventory.items.length, 0);
}

export async function unequipAllEmptyInventory(context) {
  const { publicFacet, contractAssets, purses, zoe } = context;

  const { characterName } = flow.inventory;

  const invitation = await E(publicFacet).makeUnequipAllInvitation();
  const characterCopyBagAmount = makeCopyBag(
    harden([
      [(await E(purses.character).getCurrentAmount()).value.payload[0][0], 1n],
    ]),
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
    CharacterKey1: await E(purses.character).withdraw(characterKeyAmount),
  };

  const userSeat = await E(zoe).offer(invitation, proposal, payment);

  const itemPayout = await E(userSeat).getPayout('Item');
  const characterPayout = await E(userSeat).getPayout('CharacterKey2');
  await E(purses.character).deposit(characterPayout);

  mustMatch(
    (await E(contractAssets.item.issuer).getAmountOf(itemPayout)).value.payload,
    harden([]),
    'Inventory was not empty',
  );
  assert.equal(
    (await E(purses.character).getCurrentAmount()).value.payload[0][0].name,
    characterName,
    'CharacterKey was not returned to character purse',
  );
}
