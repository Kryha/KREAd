import { test } from '../prepare-test-env-ava.js';
import { setup } from './swingset-setup.js';

test.before(async (t) => {
  await setup();
});

// test("")
