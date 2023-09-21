// eslint-disable-next-line import/order
import { test } from './prepare-test-env-ava.js';
import { E } from '@endo/eventual-send';
import { AmountMath } from '@agoric/ertp';
import { bootstrapContext } from './bootstrap.js';
import { flow } from './flow.js';
import { makeCopyBag } from '@agoric/store';
import {addCharacterToBootstrap} from './setup.js';

test.before(async (t) => {
  const bootstrap =
    await bootstrapContext();

  const { zoe, contractAssets, assets, purses, publicFacet, governorFacets } =
    bootstrap;

  t.context = {
    publicFacet,
    contractAssets,
    assets,
    purses,
    zoe,
    governorFacets,
  };
});

test.serial('block methods', async (t) => {
  /** @type {Bootstrap} */
  const {
    publicFacet,
    governorFacets,
    contractAssets,
    purses,
    zoe,
  } = t.context;

  await E(governorFacets.creatorFacet).setFilters(['mintCharacterNfts']);

  console.log(`TG `, purses.item.getCurrentAmount().value.payload);

  const { want } = flow.mintCharacter.expected;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();
  const copyBagAmount = makeCopyBag(harden([[want, 1n]]));
  const proposal = harden({
    want: {
      Asset: AmountMath.make(
        contractAssets.character.brand,
        harden(copyBagAmount),
      ),
    },
  });

  await t.throwsAsync(
    () => E(zoe).offer(mintCharacterInvitation, proposal),
    { message: 'not accepting offer with description "mintCharacterNfts"' },
  );
});
