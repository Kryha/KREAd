import { test } from '../prepare-test-env-ava.js';
import { run, setup } from './swingset-setup.js';

test.before(async (t) => {
  await setup();

  const [build] = await run('buildV1');
  t.is(build, "fulfilled")
});

test.serial('| GOVERNANCE - Block Methods', async (t) => {
  const [result] = await run('blockMethods');
  t.is(result, 'rejected');
});
