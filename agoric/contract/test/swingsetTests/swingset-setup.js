import { test } from '../prepare-test-env-ava.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { resolve as importMetaResolve } from 'import-meta-resolve';
import { buildVatController } from '@agoric/swingset-vat';
import { assert } from '@agoric/assert';

const bfile = (name) => new URL(name, import.meta.url).pathname;
const kreadV1BundleName = 'kreadV1';

let c;

/**
 * Queues a function into the bootstrap vat with the given arguments
 *
 * @param {string} name
 * @param {any} args
 * @returns
 */
export const run = async (name, args = []) => {
  assert(Array.isArray(args));
  const kpid = c.queueToVatRoot('bootstrap', name, args);
  await c.run();
  const status = c.kpStatus(kpid);
  const capdata = c.kpResolution(kpid);
  return [status, capdata];
};

/**
 * Sets up swingset and starts v1 of kread contract
 */
export async function setup() {
  const config = {
    includeDevDependencies: true,
    defaultManagerType: 'local',
    bootstrap: 'bootstrap',
    vats: {
      bootstrap: {
        sourceSpec: bfile('bootstrap/bootstrap-upgradable.js'),
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

  c = await buildVatController(config);
  c.pinVatRoot('bootstrap');
  await c.run();

  await run('buildV1', []);
}
