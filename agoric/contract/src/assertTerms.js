import { isNat } from '@agoric/nat';

const assertTerms = (terms) => {
  const { nftName, pricePerNFT } = terms;
  assert.typeof(
    nftName,
    'string',
    assert.details`A name for the NFTs must be provided, not ${nftName}`,
  );
  assert(
    typeof pricePerNFT.value === 'bigint' && isNat(pricePerNFT.value),
    assert.details`A pricePerNFT must be provided, not ${pricePerNFT}`,
  );
};

export { assertTerms };
