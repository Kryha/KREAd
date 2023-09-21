/* global process */
import { makeHelpers } from '@agoric/deploy-script-support';

import { getManifestForStartKread } from './start-kread-proposal.js';

// Build proposal for sim-chain etc.
/** @type {import('@agoric/deploy-script-support/src/externalTypes.js').ProposalBuilder} */
export const defaultProposalBuilder = async (
  { publishRef, install },
) => {
  return harden({
    sourceSpec: './start-kread-proposal.js',
    getManifestCall: [getManifestForStartKread.name, {
      kreadKitRef: publishRef(
        install(
          '../index.js',
          '../bundles/bundle-kreadKit.js',
          {
            persist: true,
          },
        ),
      ),
    }],
  });
};

export default async (homeP, endowments) => {
  const { writeCoreProposal } = await makeHelpers(homeP, endowments);
  await writeCoreProposal('start-kread', defaultProposalBuilder);
};
