/* global process */
import { makeHelpers } from '@agoric/deploy-script-support';

import { getManifestForInviteCommittee } from './kread-committee-proposal.js';

const fail = msg => {
  throw Error(msg)
}

// Build proposal for sim-chain etc.
/** @type {import('@agoric/deploy-script-support/src/externalTypes.js').ProposalBuilder} */
export const defaultProposalBuilder = async (
  { publishRef, install },
  options = {},
) => {
  const config = name => process.env[name] || fail(`$${name} required`);
  const {
    KREAD_COMMITTEE_ADDRESSES = config('KREAD_COMMITTEE_ADDRESSES'),
    committeeName = config('KREAD_COMMITTEE_NAME'),
    voterAddresses = JSON.parse(KREAD_COMMITTEE_ADDRESSES),
  } = options;

  assert(voterAddresses, 'KREAD_COMMITTEE_ADDRESSES is required');

  return harden({
    sourceSpec: './kread-committee-proposal.js',
    getManifestCall: [
      getManifestForInviteCommittee.name,
      {
        voterAddresses,
        committeeName,
        kreadCommitteeCharterRef: publishRef(
          install(
            '../kreadV1/kreadCommitteeCharter.js',
            '../bundles/bundle-kreadCommitteeCharter.js',
            {
              persist: true,
            },
          ),
        ),
      },
    ],
  });
};

export default async (homeP, endowments) => {
  const { writeCoreProposal } = await makeHelpers(homeP, endowments);
  await writeCoreProposal('kread-invite-committee', defaultProposalBuilder);
};
