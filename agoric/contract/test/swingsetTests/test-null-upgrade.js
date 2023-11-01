import { test } from '../prepare-test-env-ava.js';
import { setup, run } from './swingset-setup.js';

test.before(async (t) => {
  const [result] = await setup();
  t.is(result, 'fulfilled');

});

test.serial('null upgrade', async (t) => {
  const [result] = await run('nullUpgrade');
  t.is(result, 'fulfilled');
});

