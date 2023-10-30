import { test } from '../prepare-test-env-ava.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { resolve as importMetaResolve } from 'import-meta-resolve';
import { buildVatController } from '@agoric/swingset-vat';
import { assert } from '@agoric/assert';

const bfile = (name) => new URL(name, import.meta.url).pathname;
const kreadV1BundleName = 'kreadV1';

const modulePath = async (sourceRoot) => {
  const url = await importMetaResolve(sourceRoot, import.meta.url);
  return new URL(url).pathname;
};

test('kread upgrade', async (t) => {
  /** @type {SwingSetConfig} */
  const config = {
    includeDevDependencies: true,
    defaultManagerType: 'local',
    bootstrap: 'bootstrap',
    vats: {
      bootstrap: {
        sourceSpec: bfile('bootstrap-upgradable.js'),
      },
      zoe: {
        sourceSpec: await importMetaResolve(
          '@agoric/vats/src/vat-zoe.js',
          import.meta.url,
        ).then((href) => new URL(href).pathname),
      },
    },
    bundles: {
      zcf: {
        sourceSpec: await importMetaResolve(
          '@agoric/zoe/src/contractFacet/vatRoot.js',
          import.meta.url,
        ).then((href) => new URL(href).pathname),
      },
      committee: {
        sourceSpec: await importMetaResolve(
          '@agoric/governance/src/committee.js',
          import.meta.url,
        ).then((href) => new URL(href).pathname),
      },
      puppetContractGovernor: {
        sourceSpec: await importMetaResolve(
          '@agoric/governance/tools/puppetContractGovernor.js',
          import.meta.url,
        ).then((href) => new URL(href).pathname),
      },
      [kreadV1BundleName]: {
        sourceSpec: await importMetaResolve(
          '../../src/index.js',
          import.meta.url,
        ).then((href) => new URL(href).pathname),
      },
    },
  };

  t.log('buildVatController');
  const c = await buildVatController(config);
  t.log(c.vatNameToID('bootstrap'));

  c.pinVatRoot('bootstrap');
  t.log('run-controller');
  await c.run();

  const run = async (name, args = []) => {
    assert(Array.isArray(args));
    const kpid = c.queueToVatRoot('bootstrap', name, args);
    await c.run();
    const status = c.kpStatus(kpid);
    const capdata = c.kpResolution(kpid);
    return [status, capdata];
  };

  t.log('create initial version');
  const [buildV1] = await run('buildV1', []);
  t.is(buildV1, 'fulfilled');

  t.log('test functionality');
  const [mintCharacter] = await run('mintCharacter', ["example"]);
  t.is(mintCharacter, 'fulfilled');

  t.log('test null upgrade');
  const [nullUpgrade] = await run('nullUpgrade', []);
  t.is(nullUpgrade, 'fulfilled');

  t.log('test functionality after upgrade');
  const [mintCharacterAfterUpgrade] = await run('mintCharacter', ["example"]);
  t.is(mintCharacterAfterUpgrade, 'rejected'); // name has already been minted
});
