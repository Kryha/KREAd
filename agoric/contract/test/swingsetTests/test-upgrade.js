import { defaultItems } from './items.js';
import { test } from '../prepare-test-env-ava.js';
import { setup, run } from './swingset-setup.js';
import { defaultCharacters } from '../characters.js';

test.before(async (t) => {
  await setup();

  const [build] = await run('buildV1', [
    [
      ...defaultCharacters,
      [
        2,
        {
          title: 'Citizen',
          origin: 'Sage',
          description:
            'A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.',
          level: 1,
          artistMetadata: '',
          characterTraits: '',
          image:
            'https://ipfs.io/ipfs/QmSkCL11goTK7qw1qLjbozUJ1M7mJtSyH1PnL1g8AB96Zg',
        },
      ],
    ],
    defaultItems,
  ]);
  t.is(build, 'fulfilled');

  const [setupUpgradeTests] = await run('setupUpgradeTests');
  t.is(setupUpgradeTests, 'fulfilled');
});

test.serial('test functionality before upgrade', async (t) => {
  const [result] = await run('testFunctionalityBeforeUpgrade');
  t.is(result, 'fulfilled');
});

test.serial('upgrade to V2', async (t) => {
  const [result] = await run('upgradeV2');
  t.is(result, 'fulfilled');
});

test.serial('test functionality after upgrade', async (t) => {
  const [result] = await run('testFunctionalityAfterUpgrade');
  t.is(result, 'fulfilled');
});

// test.serial()
