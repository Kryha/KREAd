import { iterateLatest, makeFollower } from "@agoric/casting";

import { dappConfig, KREAD_STORAGE_NODE_PATH } from "../../constants";

export const watchInstanceIds = async (leader: any, walletUnserializer: any) => {
  const f = await makeFollower(":published.kread.info", leader, {
    unserializer: walletUnserializer,
    proof: "none",
  });

  console.log("watching", f.getLatestIterable());
  const watchedAnchors = new Set();

  for await (const { value } of iterateLatest(f)) {
    // const INSTANCE_NAME_PREFIX = 'psm-IST-';
    // // Remove "psm-IST-" prefix so they're like ["AUSD", "board012"]
    // const PSMEntries = (value as [string, string][])
    //   .filter(entry => entry[0].startsWith(INSTANCE_NAME_PREFIX))
    //   .map(
    //     ([key, boardId]) =>
    //       [key.slice(INSTANCE_NAME_PREFIX.length), boardId] as [string, string]
    //   );

    console.log(value);

    // PSMEntries.forEach(([anchorPetname]) => {
    //   if (!watchedAnchors.has(anchorPetname)) {
    //     watchedAnchors.add(anchorPetname);
    //   }
    // });
  }
};

// declare type ContractSetters = {
//   setInstanceIds: (ids: [string, string][]) => void;
//   setMetricsIndex: (metrics: [string, Metrics][]) => void;
//   setGovernedParamsIndex: (params: [string, GovernedParams][]) => void;
// };

// export const watchContract = async (
//   chainConnection: { leader: any; unserializer: Marshal<any> },
//   setters: ContractSetters
// ) => {
//   const { leader, unserializer } = chainConnection;

//   watchInstanceIds(leader, setters, unserializer).catch((err: Error) =>
//     console.error('got loadInstanceIds err', err)
//   );
// };
