import { test } from '../prepare-test-env-ava.js';
import { run, setup } from './swingset-setup.js';

test.before(async (t) => {
  await setup();

  const [build] = await run('buildV1');
  t.is(build, "fulfilled")

  const [setupInventoryTests] = await run('setupInventoryTests');
  t.is(setupInventoryTests, 'fulfilled');
});

test.serial('| INVENTORY - Unequip Item', async (t) => {
  const [result] = await run('unequipItem');
  t.is(result, 'fulfilled');
});

test.serial('| INVENTORY - Unequip already unequipped item', async (t) => {
  const [result] = await run('unequipAlreadyUnequippedItem');
  t.is(result, 'rejected');
});

test.serial('| INVENTORY - Unequip - wrong character', async (t) => {
  const [result] = await run('unequipWithWrongCharacter');
  t.is(result, 'rejected');
});

test.serial('| INVENTORY - Equip Item', async (t) => {
  const [result] = await run('equipItem');
  t.is(result, 'fulfilled');
});

test.serial('| INVENTORY - Equip Item duplicate category', async (t) => {
  const [result] = await run('equipItemDuplicateCategory');
  t.is(result, 'rejected');
});

test.serial('| INVENTORY - Swap Items', async (t) => {
  const [result] = await run('swapItems');
  t.is(result, 'fulfilled');
});

test.serial('| INVENTORY - Swap Items - Initially empty', async (t) => {
  const [result] = await run('swapItemsInitiallyEmpty');
  t.is(result, 'fulfilled');
});

test.serial('| INVENTORY - Swap Items - Different categories', async (t) => {
  const [result] = await run('swapItemsDifferentCategories');
  t.is(result, 'rejected');
});

test.serial('| INVENTORY - Unequip all', async (t) => {
  const [result] = await run('unequipAll');
  t.is(result, 'fulfilled');
});

test.serial('| INVENTORY - UnequipAll empty inventory', async (t) => {
  const [result] = await run('unequipAllEmptyInventory');
  t.is(result, 'fulfilled');
});
