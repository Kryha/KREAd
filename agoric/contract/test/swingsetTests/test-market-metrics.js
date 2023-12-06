import { test } from '../prepare-test-env-ava.js';
import { run, setup } from './swingset-setup.js';

test.before(async (t) => {
  await setup();

  const [build] = await run('buildV1');
  t.is(build, "fulfilled")

  const [setupMarketMetricsTests] = await run('setupMarketMetricsTests');
  t.is(setupMarketMetricsTests, 'fulfilled');
});

test.serial('---| METRICS - Initialization', async (t) => {
  const [result] = await run('initialization');
  t.is(result, 'fulfilled');
});

test.serial('---| METRICS - Collection size', async (t) => {
  const [result] = await run('collectionSize');
  t.is(result, 'fulfilled');
});

test.serial('---| METRICS - Average levels character', async (t) => {
  const [result] = await run('averageLevelsCharacter');
  t.is(result, 'fulfilled');
});

test.serial('---| METRICS - Amount sold character', async (t) => {
  const [result] = await run('amountSoldCharacter');
  t.is(result, 'fulfilled');
});

test.serial('---| METRICS - Latest sale price character', async (t) => {
  const [result] = await run('latestSalePriceCharacter');
  t.is(result, 'fulfilled');
});
