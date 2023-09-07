import bundleSource from '@endo/bundle-source';
import { E } from '@endo/eventual-send';
import { setupZoe, setupAssets } from './setup.js';
import { makeFakeBoard } from '@agoric/vats/tools/board-utils.js';
import { makeMockChainStorageRoot } from '@agoric/internal/src/storage-test-utils.js';
import buildManualTimer from '@agoric/zoe/tools/manualTimer.js';
import { defaultCharacters } from './characters.js';
import { defaultItems } from './items.js';

/**
 * @param {BootstrapConf} [conf]
 * @returns {Promise<Bootstrap>}
 */
export const bootstrapContext = async (conf) => {
  const { zoe } = setupZoe();

  // Setup fungible and non-fungible assets
  const assets = setupAssets(conf?.assets);
  const timerService = buildManualTimer();
  // Bundle and install contract
  const contractBundle = await bundleSource('./src/index.js');
  const installation = await E(zoe).install(contractBundle);
  const privateArgs = {
    powers: {
      storageNode: makeMockChainStorageRoot().makeChildNode('thisElectorate'),
      marshaller: makeFakeBoard().getReadonlyMarshaller(),
    },
    clock: timerService.getClock(),
    defaultCharacters,
    defaultItems,
    seed: 0,
  };

  // Start contract instance
  const instance = await E(zoe).startInstance(
    installation,
    undefined,
    undefined,
    harden(privateArgs),
  );
  const { publicFacet } = instance;
  const contractAssets = await E(publicFacet).getTokenInfo();

  const {
    character: { issuer: characterIssuer, brand: characterBrand },
    item: { issuer: itemIssuer, brand: itemBrand },
    payment: { issuer: tokenIssuer, brand: tokenBrand },
  } = contractAssets;

  const purses = {
    character: characterIssuer.makeEmptyPurse(),
    item: itemIssuer.makeEmptyPurse(),
    payment: tokenIssuer.makeEmptyPurse(),
  };

  const result = {
    contractAssets,
    assets,
    instance,
    purses,
    zoe,
  };

  harden(result);
  return result;
};

harden(bootstrapContext);
