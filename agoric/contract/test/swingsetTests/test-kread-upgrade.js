import { test } from '../prepare-test-env-ava.js';
import { setup, run } from './swingset-setup.js';

test.before(async (t) => {
  const [result] = await setup();
  t.is(result, 'fulfilled');

});

test.serial('--| MINT - Too Long Name', async (t) => {
  const [mintCharacter] = await run('mintCharacter', ['example']);
  t.is(mintCharacter, 'fulfilled');
});

test.serial('--| MINT - Expected flow', async (t) => {
  const [mintCharacter] = await run('mintCharacter', ['example']);
  t.is(mintCharacter, 'rejected');
});
