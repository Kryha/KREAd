import { test } from '../prepare-test-env-ava.js';
import { setup, run } from './swingset-setup.js';

test.before(async (t) => {
  await setup();
});

test.serial('buildV1', async (t) => {
  const [build] = await run('buildV1');
  t.is(build, 'fulfilled');
})

test.serial('testBefore', async (t) => {
  const [build] = await run('mint');
  t.is(build, 'fulfilled');
})

test.serial('null upgrade', async (t) => {
  const [result] = await run('nullUpgrade');
  t.is(result, 'fulfilled');
});

test.serial('test after', async (t) => {
  const [result] = await run('mint');
  t.is(result, 'rejected');
});
