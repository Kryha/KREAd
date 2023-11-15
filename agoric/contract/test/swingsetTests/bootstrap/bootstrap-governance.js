import { AmountMath } from '@agoric/ertp';
import { makeCopyBag } from '@agoric/store';
import { E } from '@endo/far';
import { flow } from '../flow.js';

export async function blockMethods(context) {
  /** @type {Context} */
  const { publicFacet, governorFacets, contractAssets, purses, zoe } = context;

  await E(governorFacets.creatorFacet).setFilters(['mintCharacterNfts']);

  console.log(`TG `, (await E(purses.item).getCurrentAmount()).value.payload);

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

  try {
    await E(zoe).offer(mintCharacterInvitation, proposal);
  } catch (error) {
    assert.equal(
      error.message,
      'not accepting offer with description "mintCharacterNfts"',
    );
    throw error;
  }
}
