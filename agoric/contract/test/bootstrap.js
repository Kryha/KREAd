// eslint-disable-next-line import/order
import bundleSource from "@endo/bundle-source";
import { E } from "@endo/eventual-send";
import { setupZoe, setupAssets } from "./setup.js";

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

  // Start contract instance
  console.log("IKR", assets.issuerKeywordRecord);
  const instance = await E(zoe).startInstance(installation, assets.issuerKeywordRecord);
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
