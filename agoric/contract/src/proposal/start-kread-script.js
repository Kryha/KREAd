/* global process */
import { makeHelpers } from '@agoric/deploy-script-support';

import { getManifestForStartKread } from './start-kread-proposal.js';

const fail = (msg) => {
  throw Error(msg);
};

// Build proposal for sim-chain etc.
/** @type {import('@agoric/deploy-script-support/src/externalTypes.js').ProposalBuilder} */
export const defaultProposalBuilder = async (
  { publishRef, install },
  options = {},
) => {
  const theEnv = (name) => process.env[name] || fail(`$${name} required`);

  const {
    royaltyAddr = theEnv('KREAD_ROYALTY_ADDRESS'),
    platformFeeAddr = theEnv('KREAD_PLATFORM_ADDRESS'),
  } = options;

  return harden({
    sourceSpec: './start-kread-proposal.js',
    getManifestCall: [
      getManifestForStartKread.name,
      {
        royaltyAddr,
        platformFeeAddr,
        kreadKitRef: publishRef(
          install('../index.js', '../bundles/bundle-kreadKit.js', {
            persist: true,
          }),
        ),
      },
    ],
  });
};

export default async (homeP, endowments) => {
  const { writeCoreProposal } = await makeHelpers(homeP, endowments);
  await writeCoreProposal('start-kread', defaultProposalBuilder);
};
