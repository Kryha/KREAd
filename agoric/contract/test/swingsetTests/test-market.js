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

test.serial(
  '---| MARKET - Buy character',
  async (t) => {
    const [result] = await run('buyCharacter');
    t.is(result, 'fulfilled');
  },
);

test.serial(
  '---| MARKET - Buy character not on market',
  async (t) => {
    const [result] = await run('buyCharacterNotOnMarket');
    t.is(result, 'rejected');
  },
);

test.serial(
  '---| MARKET - Sell item',
  async (t) => {
    const [result] = await run('sellItem');
    t.is(result, 'fulfilled');
  },
);

test.serial(
  '---| MARKET - buyItemOfferLessThanAskingPrice',
  async (t) => {
    const [result] = await run('buyItemOfferLessThanAskingPrice');
    t.is(result, 'rejected');
  },
);

test.serial(
  '---| MARKET - buyItem',
  async (t) => {
    const [result] = await run('buyItem');
    t.is(result, 'fulfilled');
  },
);
test.serial(
  '---| MARKET - buyItemNotOnMarket',
  async (t) => {
    const [result] = await run('buyItemNotOnMarket');
    t.is(result, 'rejected');
  },
);
test.serial(
  '---| MARKET - buyCharacterOfferMoreThanAskingPrice',
  async (t) => {
    const [result] = await run('buyCharacterOfferMoreThanAskingPrice');
    t.is(result, 'fulfilled');
  },
);
test.serial(
  '---| MARKET - buyItemOfferMoreThanAskingPrice',
  async (t) => {
    const [result] = await run('buyItemOfferMoreThanAskingPrice');
    t.is(result, 'fulfilled');
  },
);
test.serial(
  '---| MARKET - internalSellItemBatch',
  async (t) => {
    const [result] = await run('internalSellItemBatch');
    t.is(result, 'fulfilled');
  },
);
test.serial(
  '---| MARKET - buyBatchSoldItem',
  async (t) => {
    const [result] = await run('buyBatchSoldItem');
    t.is(result, 'fulfilled');
  },
);
