import bundleSource from '@endo/bundle-source';
import { E } from '@endo/eventual-send';
import { setupZoe, setupAssets } from './setup.js';
import { makeFakeBoard } from '@agoric/vats/tools/board-utils.js';
import { makeMockChainStorageRoot } from '@agoric/internal/src/storage-test-utils.js';
import buildManualTimer from '@agoric/zoe/tools/manualTimer.js';
import { defaultCharacters } from './characters.js';
import { defaultItems } from './items.js';
import { makeIssuerKit } from '@agoric/ertp';

/**
 * @param {BootstrapConf} [conf]
 * @returns {Promise<Bootstrap>}
 */
export const bootstrapContext = async (conf) => {
  const { zoe } = setupZoe();

  // Setup fungible and non-fungible assets
  const assets = setupAssets(conf?.assets);

  const {
    mint: mintMockIST,
    issuer: issuerMockIST,
    brand: brandMockIST,
  } = makeIssuerKit('IST-mock', 'nat');

  const royaltyPurse = issuerMockIST.makeEmptyPurse();
  const platformFeePurse = issuerMockIST.makeEmptyPurse();
  const royaltyDepositFacet = royaltyPurse.getDepositFacet();
  const platformFeeDepositFacet = platformFeePurse.getDepositFacet();

  const royaltyRate = 0.2;
  const platformFeeRate = 0.2;

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
    seed: 0,
    royaltyRate,
    platformFeeRate,
    royaltyDepositFacet: royaltyDepositFacet,
    platformFeeDepositFacet: platformFeeDepositFacet,
    paymentBrand: brandMockIST,
  };

  // Start contract instance
  const instance = await E(zoe).startInstance(
    installation,
    { Money: issuerMockIST },
    undefined,
    harden(privateArgs),
  );
  const { creatorFacet } = instance;
  const terms = await E(zoe).getTerms(instance.instance);
  await E(creatorFacet).initializeBaseAssets(defaultCharacters, defaultItems);

  const {
    issuers: {
      KREAdCHARACTER: characterIssuer,
      KREAdITEM: itemIssuer,
    },
    brands: {
      KREAdCHARACTER: characterBrand,
      KREAdITEM: itemBrand,
    }
  } = terms;

  const contractAssets = {
    character: { issuer: characterIssuer, brand: characterBrand },
    item: { issuer: itemIssuer, brand: itemBrand },
  };

  const purses = {
    character: characterIssuer.makeEmptyPurse(),
    item: itemIssuer.makeEmptyPurse(),
    payment: issuerMockIST.makeEmptyPurse(),
  };

  const result = {
    contractAssets,
    assets,
    instance,
    purses,
    zoe,
    paymentAsset: {
      mintMockIST,
      issuerMockIST,
      brandMockIST,
    },
    royaltyPurse,
    platformFeePurse,
    royaltyRate,
    platformFeeRate,
  };

  harden(result);
  return result;
};

harden(bootstrapContext);
