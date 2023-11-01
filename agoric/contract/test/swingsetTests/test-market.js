import { test } from '../prepare-test-env-ava.js';
import { setup, run } from './swingset-setup.js';

test.before(async (t) => {
  await setup();
  const [setupMarketTests] = await run('setupMarketTests');
  t.is(setupMarketTests, 'fulfilled');
});

test.serial('--| MARKET - Sell character', async (t) => {
  const [result] = await run('sellCharacter');
  t.is(result, 'fulfilled');
});

test.serial(
  '---| MARKET - Buy character; offer less than asking price',
  async (t) => {
    const [result] = await run('buyCharacterOfferLessThanAskingPrice');
    t.is(result, 'rejected');
  },
);
