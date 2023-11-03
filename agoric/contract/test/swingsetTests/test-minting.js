import { test } from '../prepare-test-env-ava.js';
import { setup, run } from './swingset-setup.js';

test.before(async (t) => {
  const [result] = await setup();
  t.is(result, 'fulfilled');

  const [setupMintTests] = await run('setupMintTests');
  t.is(setupMintTests, 'fulfilled');
});

test.serial('--| MINT - Too Long Name', async (t) => {
  const [result] = await run('mintTooLongName');
  t.is(result, 'rejected');
});

test.serial('--| MINT - Invalid Chars in Name', async (t) => {
  const [result] = await run('mintInvalidCharsInname');
  t.is(result, 'rejected');
});

test.serial('--| MINT - Forbidden name: "names"', async (t) => {
  const [result] = await run('mintForbiddenName');
  t.is(result, 'rejected');
});

test.serial('--| MINT - Expected flow', async (t) => {
  const [mintCharacter] = await run('mintExpectedFlow');
  t.is(mintCharacter, 'fulfilled');
});

test.serial('--| MINT - Fee too low', async (t) => {
  const [result] = await run('mintFeeTooLow');
  t.is(result, 'rejected');
});

test.serial('--| MINT - No offerArgs', async (t) => {
  const [result] = await run('mintNoOfferArgs');
  t.is(result, 'rejected');
});

test.serial('--| MINT - Duplicate Name', async (t) => {
  const [result] = await run('mintDuplicateName');
  t.is(result, 'rejected');
});

test.serial('--| MINT - No name', async (t) => {
  const [result] = await run('mintNoName');
  t.is(result, 'rejected');
});

test.serial('--| MINT - No characters available', async (t) => {
  const [result] = await run('mintNoCharactersAvailable');
  t.is(result, 'rejected');
});

test.serial('--| MINT - Inventory check', async (t) => {
  const [result] = await run('mintInventoryCheck');
  t.is(result, 'fulfilled');
});

test.serial('--| MINT - Item - Expected flow', async (t) => {
  const [result] = await run('mintItemExpectedFlow');
  t.is(result, 'fulfilled');
});

test.serial('--| MINT - Item - Mint same item (SFT)', async (t) => {
  const [result] = await run('mintSameItemSFT');
  t.is(result, 'fulfilled');
});

test.serial('--| MINT - Item - Multiple flow', async (t) => {
  const [result] = await run('mintItemMultipleFlow');
  t.is(result, 'fulfilled');
});

test.serial('--| MINT - Item - Multiple different items flow', async (t) => {
  const [result] = await run('mintItemMultipleDifferentFlow');
  t.is(result, 'fulfilled');
});
