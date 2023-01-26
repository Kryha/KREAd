/**
 * @file
 *
 * This is a script for use with swingset.CoreEval.
 *
 * It's a script, not a module, so we can't use `import`.
 * But E, Far, etc. are in scope, provided by the
 * `new Compartment(globals)` call in
 * `bridgeCoreEval()` in packages/vats/src/core/chain-behaviors.js
 */
// @ts-check
// uncomment the following line to typecheck, for example, in vs-code.
// import { E } from '@endo/far';

const contractInfo = {
  storagePath: 'kread',

  // see discussion of publish-bundle and bundleID
  // from Dec 14 office hours
  // https://github.com/Agoric/agoric-sdk/issues/6454#issuecomment-1351949397
  bundleID:
    'b1-0855c6b9a1604951fb0435dbdb1afc3617a29ac9e8cec1efe9fb6902f3ae7a907169765c5e90c50cfab55552642dea9db289cab2204902df6378b2ee7a42aaa9',
};

const fail = (reason) => {
  throw reason;
};

/**
 * Execute a proposal to start a contract that publishes bake sales.
 *
 * See also:
 * BLDer DAO governance using arbitrary code injection: swingset.CoreEval
 * https://community.agoric.com/t/blder-dao-governance-using-arbitrary-code-injection-swingset-coreeval/99
 *
 * @param {BootstrapPowers} powers see the `behavior(powers)` call
 *   in `bridgeCoreEval()`
 */
const executeProposal = async (powers) => {
  // Destructure the powers that we use.
  // See also bakeSale-permit.json
  const {
    consume: { board, chainStorage, zoe },
    // @ts-expect-error bakeSaleKit isn't declared in vats/src/core/types.js
    produce: { kreadKit },
    instance: {
      // @ts-expect-error bakeSaleKit isn't declared in vats/src/core/types.js
      produce: { kread },
    },
  } = powers;

  const chainStorageSettled =
    (await chainStorage) || fail(Error('no chainStorage - sim chain?'));

  const storageNode = E(chainStorageSettled).makeChildNode(
    contractInfo.storagePath,
  );
  const marshaller = await E(board).getReadonlyMarshaller();

  const privateArgs = harden({ storageNode, marshaller });

  const installation = await E(zoe).installBundleID(contractInfo.bundleID);
  const noIssuers = harden({});
  const noTerms = harden({});
  const facets = await E(zoe).startInstance(
    installation,
    noIssuers,
    noTerms,
    privateArgs,
  );

  // Share instance widely via E(agoricNames).lookup('instance', 'bakeSale')
  kread.resolve(facets.instance);

  // Share the publicFacet, creatorFacet, and adminFacet in the bootstrap space
  // for use by other CoreEval behaviors.
  kreadKit.resolve(facets);
};
harden(executeProposal);

// "export" the function as the script completion value
executeProposal;
