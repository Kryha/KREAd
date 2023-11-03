import { test } from '../prepare-test-env-ava.js';
import { run, setup } from './swingset-setup.js';

test.before(async (t) => {
  const [result] = await setup();
  t.is(result, 'fulfilled');
});

test.serial('| GOVERNANCE - Block Methods', async (t) => {
  const [result] = await run('blockMethods');
  t.is(result, 'rejected');
});
