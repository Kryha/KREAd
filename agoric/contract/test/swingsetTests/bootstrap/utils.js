import { AmountMath, AssetKind, makeIssuerKit } from '@agoric/ertp';
import { E } from '@endo/eventual-send';
import { defaultAssets } from '../data.js';
import { flow } from '../flow.js';
import { makeCopyBag } from '@agoric/store';

/**
 * Mint character and deposit on Context character purse
 *
 * @param {Context} context
 */
export const addCharacterToContext = async (context) => {
  /** @type {Context} */
  const { publicFacet, paymentAsset, purses, zoe } = context;
  const { offerArgs, give } = flow.mintCharacter.expected;

  const mintCharacterInvitation = await E(
    publicFacet,
  ).makeMintCharacterInvitation();

  const payment = {
    Price: paymentAsset.mintMockIST.mintPayment(
      AmountMath.make(paymentAsset.brandMockIST, harden(30000000n)),
    ),
  };

  const priceAmount = AmountMath.make(paymentAsset.brandMockIST, give.Price);

  const proposal = harden({
    give: { Price: priceAmount },
  });

  const userSeat = await E(zoe).offer(
    mintCharacterInvitation,
    proposal,
    payment,
    offerArgs,
  );

  const payout = await E(userSeat).getPayout('Asset');
  await E(purses.character).deposit(payout);
};

/**
 * Mint item and deposit on Bootstrap item purse
 *
 * @param {Context} context
 */
export const addItemToContext = async (context, item) => {
  /** @type {Context} */
  const { creatorFacet, contractAssets, purses, zoe } = context;

  const mintItemInvitation = await E(creatorFacet).makeMintItemInvitation();
  const itemAmount = AmountMath.make(
    contractAssets.item.brand,
    makeCopyBag(harden([[item, 1n]])),
  );

  const proposal = harden({
    want: { Item: itemAmount },
  });

  const userSeat = await E(zoe).offer(mintItemInvitation, proposal);
  const payout = await E(userSeat).getPayout('Asset');
  await E(purses.item).deposit(payout);
};
harden(addItemToContext);

/**
 * @param {AssetConf} [conf]
 * @returns { Assets }
 */
export const setupAssets = (conf) => {
  // fallback to empty arrays when conf undefined
  if (!conf)
    conf = {
      fts: [],
      nfts: [],
    };
  if (!conf.fts) conf.fts = [];
  if (!conf.nfts) conf.nfts = [];

  /** @type {Record<string, AssetObject>} */
  const fts = {};

  /** @type {Record<string, AssetObject>} */
  const nfts = {};

  /** @type {Record<string, AssetObject>} */
  const all = {};

  // Merge asset conf with default assets
  const assetNames = {
    fts: [...new Set([...defaultAssets.fts, ...conf.fts])],
    nfts: [...new Set([...defaultAssets.nfts, ...conf.nfts])],
    all: [...new Set([...defaultAssets.all, ...conf.nfts, ...conf.fts])],
  };

  // Helper methods for creating amounts and payments of a given brand
  /** @type {<K extends AssetKind>(brand: Brand<K>) => (value: any) => Amount<K>} */
  const makeAmount = (brand) => (value) => AmountMath.make(brand, value);
  const makePayment = (mint, brand) => (value) =>
    mint.mintPayment(AmountMath.make(brand, value));

  // Create and store asset object for each nft and ft
  assetNames.nfts.forEach((nftName) => {
    const kit = makeIssuerKit(nftName, AssetKind.SET);
    const assetObject = {
      kit,
      makeAmount: makeAmount(kit.brand),
      makePayment: makePayment(kit.mint, kit.brand),
      name: nftName,
    };
    nfts[nftName] = assetObject;
    all[nftName] = assetObject;
  });

  assetNames.fts.forEach((ftName) => {
    const kit = makeIssuerKit(ftName);
    const assetObject = {
      kit,
      makeAmount: makeAmount(kit.brand),
      makePayment: makePayment(kit.mint, kit.brand),
      name: ftName,
    };
    fts[ftName] = assetObject;
    all[ftName] = assetObject;
  });

  // Create issuerKeywordRecord for use with the contract
  const issuerKeywordRecord = {};

  Object.entries(all).forEach(([name, { kit }]) => {
    const [first, ...rest] = name;
    const keyword = first.toUpperCase() + rest.join('');
    issuerKeywordRecord[keyword] = kit.issuer;
  });

  const assets = {
    nfts,
    fts,
    all,
    issuerKeywordRecord,
  };

  harden(assets);
  return assets;
};
harden(setupAssets);
