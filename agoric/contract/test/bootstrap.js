import bundleSource from "@endo/bundle-source";
import { E } from "@endo/eventual-send";
import { setupZoe, setupAssets } from "./setup.js";
import { makeFakeBoard } from "@agoric/vats/tools/board-utils.js";
import { makeMockChainStorageRoot } from "@agoric/internal/src/storage-test-utils.js";
import buildManualTimer from "@agoric/zoe/tools/manualTimer.js";

/**
 * @param {BootstrapConf} [conf]
 * @returns {Promise<Bootstrap>}
 */
export const bootstrap = async (conf) => {
  const { zoe } = setupZoe();

  // Setup fungible and non-fungible assets
  const assets = setupAssets(conf?.assets);

  // Bundle and install contract
  const contractBundle = await bundleSource("./src/index.js");
  const installation = await E(zoe).install(contractBundle);

  const privateArgs = {
    powers: {
      storageNode: makeMockChainStorageRoot().makeChildNode("thisElectorate"),
      marshaller: makeFakeBoard().getReadonlyMarshaller(),
    },
    chainTimerService: buildManualTimer(),
    defaultCharacters: [
      {
        id: 1,
        name: "TestCharacter",
      },
    ],
    defaultItems: [
      {
        id: 1,
        name: "TestItem",
        category: "hair",
      },
    ],
  };

  // Start contract instance
  const instance = await E(zoe).startInstance(installation, undefined, undefined, privateArgs);
  const { publicFacet } = instance;
  const contractAssets = await E(publicFacet).getTokenInfo();
  // const {
  //   character: { issuer: characterIssuer, brand: characterBrand },
  //   item: { issuer: itemIssuer, brand: itemBrand },
  //   paymentFT: { issuer: tokenIssuer, brand: tokenBrand },
  // } = contractAssets;

  const result = {
    contractAssets,
    assets,
    instance,
    zoe,
  };

  harden(result);
  return result;
};

harden(bootstrap);
