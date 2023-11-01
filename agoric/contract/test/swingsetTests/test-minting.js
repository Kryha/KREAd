import { test } from '../prepare-test-env-ava.js';
import { setup, run } from './swingset-setup.js';

test.before(async (t) => {
  const [result] = await setup();
  t.is(result, 'fulfilled');

  const [setupMintTests] = await run('setupMintTests');
  t.is(setupMintTests, 'fulfilled');
});

test.serial('--| MINT - Expected flow', async (t) => {
  const [mintCharacter] = await run('mintCharacter');
  t.is(mintCharacter, 'fulfilled');
});
