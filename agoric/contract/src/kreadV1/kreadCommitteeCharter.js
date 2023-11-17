// @jessie-check

import { M } from '@agoric/store';
import { TimestampShape } from '@agoric/time';
import { prepareExo, provideDurableMapStore } from '@agoric/vat-data';
import '@agoric/zoe/exported.js';
import {
  InstallationShape,
  InstanceHandleShape,
} from '@agoric/zoe/src/typeGuards.js';
import { E } from '@endo/far';

import '@agoric/governance/exported.js';
import '@agoric/zoe/src/contracts/exported.js';

/**
 * @file This contract makes it possible for those who govern the KREAd contract
 *   to call for votes to pause offers.
 */

export const INVITATION_MAKERS_DESC = 'charter member invitation';

/** @type {ContractMeta} */
export const meta = {
  customTermsShape: {
    binaryVoteCounterInstallation: InstallationShape,
  },
  upgradability: 'canUpgrade',
};
harden(meta);

/**
 * @param {ZCF<{ binaryVoteCounterInstallation: Installation }>} zcf
 * @param {undefined} privateArgs
 * @param {import('@agoric/vat-data').Baggage} baggage
 */
export const start = async (zcf, privateArgs, baggage) => {
  const { binaryVoteCounterInstallation: counter } = zcf.getTerms();
  /** @type {MapStore<Instance, GovernorCreatorFacet<any>>} */
  const instanceToGovernor = provideDurableMapStore(
    baggage,
    'instanceToGovernor',
  );

  const makeOfferFilterInvitation = (instance, strings, deadline) => {
    const voteOnOfferFilterHandler = (seat) => {
      seat.exit();

      const governor = instanceToGovernor.get(instance);
      return E(governor).voteOnOfferFilter(counter, deadline, strings);
    };

    return zcf.makeInvitation(voteOnOfferFilterHandler, 'vote on offer filter');
  };

  /**
   * @param {Instance} instance
   * @param {string} methodName
   * @param {string[]} methodArgs
   * @param {import('@agoric/time').TimestampValue} deadline
   */
  const makeApiInvocationInvitation = (
    instance,
    methodName,
    methodArgs,
    deadline,
  ) => {
    const handler = (seat) => {
      seat.exit();

      const governor = instanceToGovernor.get(instance);
      return E(governor).voteOnApiInvocation(
        methodName,
        methodArgs,
        counter,
        deadline,
      );
    };
    return zcf.makeInvitation(handler, 'vote on API invocation');
  };

  const MakerI = M.interface('Charter InvitationMakers', {
    VoteOnPauseOffers: M.call(
      InstanceHandleShape,
      M.arrayOf(M.string()),
      TimestampShape,
    ).returns(M.promise()),
    VoteOnApiCall: M.call(
      InstanceHandleShape,
      M.string(),
      M.arrayOf(M.any()),
      TimestampShape,
    ).returns(M.promise()),
  });

  // durable so that when this contract is upgraded this ocap held
  // by committee members (from their invitations) stay capable
  const invitationMakers = prepareExo(
    baggage,
    'Charter Invitation Makers',
    MakerI,
    {
      VoteOnPauseOffers: makeOfferFilterInvitation,
      VoteOnApiCall: makeApiInvocationInvitation,
    },
  );

  const charterMemberHandler = (seat) => {
    seat.exit();
    return harden({ invitationMakers });
  };

  const CharterCreatorI = M.interface('Charter creatorFacet', {
    addInstance: M.call(InstanceHandleShape, M.any())
      .optional(M.string())
      .returns(),
    makeCharterMemberInvitation: M.call().returns(M.promise()),
  });

  const creatorFacet = prepareExo(
    baggage,
    'Charter creatorFacet',
    CharterCreatorI,
    {
      /**
       * @param {Instance} governedInstance
       * @param {GovernorCreatorFacet<any>} governorFacet
       * @param {string} [label] for diagnostic use only
       */
      addInstance: (governedInstance, governorFacet, label) => {
        console.log('charter: adding instance', label);
        instanceToGovernor.init(governedInstance, governorFacet);
      },
      makeCharterMemberInvitation: () =>
        zcf.makeInvitation(charterMemberHandler, INVITATION_MAKERS_DESC),
    },
  );

  return harden({ creatorFacet });
};
harden(start);

/**
 * @typedef {import('@agoric/zoe/src/zoeService/utils.js').StartedInstanceKit<start>} KreadCharterStartResult
 */
