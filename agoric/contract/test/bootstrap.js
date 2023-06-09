// eslint-disable-next-line import/order
import bundleSource from "@endo/bundle-source";
import { E } from "@endo/eventual-send";
import { setupZoe, setupAssets } from "./setup.js";
import { makeFakeBoard } from "@agoric/vats/tools/board-utils.js";
import { makeMockChainStorageRoot } from "@agoric/internal/src/storage-test-utils.js";

/**
 * @param {BootstrapConf} [conf]
 * @returns {Promise<Bootstrap>}
 */
export const bootstrap = async (conf) => {
  const { zoe } = setupZoe();

  // Setup fungible and non-fungible assets
  const assets = setupAssets(conf?.assets);

  // Bundle and install contract
  const contractBundle = await bundleSource(conf?.contractPath);
  const installation = await E(zoe).install(contractBundle);
  console.log({ installation });
  console.log("PARGS", conf.privateArgs);

  const privateArgs = {
    storageNode: makeMockChainStorageRoot().makeChildNode("thisElectorate"),
    marshaller: makeFakeBoard().getReadonlyMarshaller(),
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
  // console.log("IKR", assets.issuerKeywordRecord);
  const instance = await E(zoe).startInstance(installation, assets.issuerKeywordRecord, undefined, privateArgs);
  console.log({ instance });

  const result = {
    assets,
    instance,
    zoe,
  };
  console.log({ result });

  harden(result);
  return result;
};

harden(bootstrap);
