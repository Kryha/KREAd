import { E } from '@endo/far';

import { reserveThenGetNamePaths } from './start-kread-proposal.js';

const { Fail } = assert;

// These should be exported by Agoric, somewhere.
const pathSegmentPattern = /^[a-zA-Z0-9_-]{1,100}$/;
/** @type {(name: string) => void} */
const assertPathSegment = (name) => {
  pathSegmentPattern.test(name) ||
    Fail`Path segment names must consist of 1 to 100 characters limited to ASCII alphanumerics, underscores, and/or dashes: ${name}`;
};

/** @type {(name: string) => string} */
const sanitizePathSegment = (name) => {
  const candidate = name.replace(/[ ,]/g, '_');
  assertPathSegment(candidate);
  return candidate;
};

const { values } = Object;

/**
 * @typedef {object} KreadCommitteeOptions
 * @property {string} [committeeName]
 * @property {number} [committeeSize]
 */

/**
 * @param {import('@agoric/inter-protocol/src/proposals/econ-behaviors.js').EconomyBootstrapPowers} powers
 * @param {object} config
 * @param {object} [config.options]
 * @param {KreadCommitteeOptions} [config.options.kreadCommitteeOptions]
 */
export const startKreadCommittee = async (
  {
    consume: { board, chainStorage, diagnostics, zoe },
    produce: { kreadCommitteeKit, kreadCommitteeCreatorFacet },
    installation: {
      consume: { committee },
    },
    instance: {
      produce: { kreadCommittee },
    },
  },
  { options },
) => {
  const COMMITTEES_ROOT = 'committees';
  const {
    // NB: the electorate (and size) of the committee may change, but the name must not
    committeeName = 'KREAd Committee',
    voterAddresses,
    ...rest
  } = options;
  const committeeSize = Object.keys(voterAddresses).length;

  const [storageNode, marshaller] = await Promise.all([
    E(E(chainStorage).makeChildNode(COMMITTEES_ROOT)).makeChildNode(
      sanitizePathSegment(committeeName),
    ),
    E(board).getPublishingMarshaller(),
  ]);

  const privateArgs = {
    storageNode,
    marshaller,
  };
  const startResult = await E(zoe).startInstance(
    committee,
    {},
    { committeeName, committeeSize, ...rest },
    privateArgs,
    'kreadCommittee',
  );
  kreadCommitteeKit.resolve(
    harden({ ...startResult, label: 'kreadCommittee' }),
  );

  await E(diagnostics).savePrivateArgs(startResult.instance, privateArgs);

  kreadCommitteeCreatorFacet.resolve(startResult.creatorFacet);
  kreadCommittee.resolve(startResult.instance);
};
harden(startKreadCommittee);

/** @type {<X, Y>(xs: X[], ys: Y[]) => [X, Y][]} */
const zip = (xs, ys) => xs.map((x, i) => [x, ys[i]]);

/**
 * @param {string} debugName
 * @param {ERef<import('@agoric/vats').NameAdmin>} namesByAddressAdmin
 * @param {string} addr
 * @param {ERef<Payment>[]} payments
 */
export const reserveThenDeposit = async (
  debugName,
  namesByAddressAdmin,
  addr,
  payments,
) => {
  const [depositFacet] = await reserveThenGetNamePaths(namesByAddressAdmin, [
    [addr, 'depositFacet'],
  ]);
  await Promise.allSettled(
    payments.map(async (paymentP, i) => {
      const payment = await paymentP;
      await E(depositFacet).receive(payment);
      console.info(
        `confirmed deposit ${i + 1}/${payments.length} for`,
        debugName,
      );
    }),
  );
};

/**
 * @param {import('@agoric/inter-protocol/src/proposals/econ-behaviors').EconomyBootstrapPowers} powers
 * @param {{ options: { voterAddresses: Record<string, string> } }} param1
 */
export const inviteCommitteeMembers = async (
  { consume: { namesByAddressAdmin, kreadCommitteeCreatorFacet } },
  { options: { voterAddresses } },
) => {
  const invitations = await E(kreadCommitteeCreatorFacet).getVoterInvitations();
  assert.equal(invitations.length, values(voterAddresses).length);

  /** @param {[string, Promise<Invitation>][]} addrInvitations */
  const distributeInvitations = async (addrInvitations) => {
    await Promise.all(
      addrInvitations.map(async ([addr, invitationP]) => {
        const debugName = `kread committee member ${addr}`;
        await reserveThenDeposit(debugName, namesByAddressAdmin, addr, [
          invitationP,
        ]).catch((err) => console.error(`failed deposit to ${debugName}`, err));
      }),
    );
  };

  // This doesn't resolve until the committee members create their smart wallets.
  void distributeInvitations(zip(values(voterAddresses), invitations));
};
harden(inviteCommitteeMembers);

/** @param {import('@agoric/inter-protocol/src/proposals/econ-behaviors').EconomyBootstrapPowers} powers */
export const startKreadCharter = async ({
  consume: { zoe },
  produce: { kreadCharterKit },
  installation: {
    consume: { binaryVoteCounter: counterP, kreadCommitteeCharter: installP },
  },
  instance: {
    produce: { kreadCommitteeCharter: instanceP },
  },
}) => {
  const [charterInstall, counterInstall] = await Promise.all([
    installP,
    counterP,
  ]);
  const terms = harden({
    binaryVoteCounterInstallation: counterInstall,
  });

  /** @type {Promise<import('./kreadCommitteeCharter').KreadCharterStartResult>} */
  const startResult = E(zoe).startInstance(
    charterInstall,
    undefined,
    terms,
    undefined,
    'kreadCommitteeCharter',
  );
  instanceP.resolve(E.get(startResult).instance);
  kreadCharterKit.resolve(startResult);
};
harden(startKreadCharter);

/**
 * Introduce charter to governed creator facets.
 *
 * @param {import('@agoric/inter-protocol/src/proposals/econ-behaviors').EconomyBootstrapPowers} powers
 */
export const addGovernorToKreadCharter = async ({
  consume: { kreadCharterKit, kreadKit },
  instance: { consume: { kread } },
}) => {
  const { creatorFacet } = E.get(kreadCharterKit);

  await Promise.all(
    [
      {
        label: 'kread',
        instanceP: kread,
        facetP: E.get(kreadKit).governorCreatorFacet,
      },
    ].map(async ({ label, instanceP, facetP }) => {
      const [instance, govFacet] = await Promise.all([instanceP, facetP]);

      return E(creatorFacet).addInstance(instance, govFacet, label);
    }),
  );
};
harden(addGovernorToKreadCharter);

/**
 * @param {import('@agoric/inter-protocol/src/proposals/econ-behaviors').EconomyBootstrapPowers} powers
 * @param {{ options: { voterAddresses: Record<string, string> } }} param1
 */
export const inviteToKreadCharter = async (
  { consume: { namesByAddressAdmin, kreadCharterKit } },
  { options: { voterAddresses } },
) => {
  const { creatorFacet } = E.get(kreadCharterKit);

  // This doesn't resolve until the committee members create their smart wallets.
  // Don't block bootstrap on it.
  void Promise.all(
    values(voterAddresses).map(async (addr) => {
      const debugName = `KREAd charter member ${addr}`;
      reserveThenDeposit(debugName, namesByAddressAdmin, addr, [
        E(creatorFacet).makeCharterMemberInvitation(),
      ]).catch((err) => console.error(`failed deposit to ${debugName}`, err));
    }),
  );
};
harden(inviteToKreadCharter);

export const getManifestForInviteCommittee = async (
  { restoreRef },
  { voterAddresses, kreadCommitteeCharterRef, committeeName },
) => ({
  manifest: {
    [startKreadCommittee.name]: {
      consume: {
        board: true,
        chainStorage: true,
        diagnostics: true,
        zoe: true,
      },
      produce: {
        kreadCommitteeKit: true,
        kreadCommitteeCreatorFacet: 'kreadCommittee',
      },
      installation: {
        consume: { committee: 'zoe' },
      },
      instance: {
        produce: { kreadCommittee: 'kreadCommittee' },
      },
    },
    [inviteCommitteeMembers.name]: {
      consume: {
        namesByAddressAdmin: true,
        kreadCommitteeCreatorFacet: true,
        highPrioritySendersManager: true,
      },
    },
    [startKreadCharter.name]: {
      consume: { zoe: true },
      produce: { kreadCharterKit: true },
      installation: {
        consume: { binaryVoteCounter: true, kreadCommitteeCharter: true },
      },
      instance: {
        produce: { kreadCommitteeCharter: true },
      },
    },
    [addGovernorToKreadCharter.name]: {
      consume: {
        kreadCharterKit: true,
        zoe: true,
        agoricNames: true,
        namesByAddressAdmin: true,
        kreadCommitteeCreatorFacet: true,
        kreadKit: true,
      },
      installation: {
        consume: { binaryVoteCounter: true },
      },
      instance: {
        consume: { kread: true },
      },
    },
    [inviteToKreadCharter.name]: {
      consume: { namesByAddressAdmin: true, kreadCharterKit: true },
    },
  },
  installations: {
    kreadCommitteeCharter: restoreRef(kreadCommitteeCharterRef),
  },
  options: { voterAddresses, committeeName },
});
