import { AmountMath, AssetKind, makeIssuerKit } from "@agoric/ertp";
import { makeZoeKit } from "@agoric/zoe";
import { makeFakeVatAdmin } from "@agoric/zoe/tools/fakeVatAdmin.js";
import { E } from "@endo/eventual-send";
import { defaultAssets } from "./data.js";
import { flow } from "./flow.js";

export const setupZoe = () => {
  const { admin: fakeVatAdmin, vatAdminState } = makeFakeVatAdmin();
  const { zoeService: zoe } = makeZoeKit(fakeVatAdmin);

  const result = {
    zoe,
    vatAdminState,
  };
  harden(result);
  return result;
};
harden(setupZoe);

/**
 * Mint character and deposit on Bootstrap character purse
 * 
 * @param {Bootstrap} bootstrap 
 */
export const addCharacterToBootstrap = async (bootstrap) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = bootstrap;

  const { want } = flow.mintCharacter.expected;

  const mintCharacterInvitation = await E(publicFacet).makeMintCharacterInvitation();
  const asset = AmountMath.make(contractAssets.character.brand, harden([want]))

  const proposal = harden({
    want: { Asset: asset },
  });

  const userSeat = await E(zoe).offer(mintCharacterInvitation, proposal);
  const payout = await E(userSeat).getPayout("Asset");
  purses.character.deposit(payout);
};
harden(addCharacterToBootstrap);

/**
 * Mint item and deposit on Bootstrap item purse
 * 
 * @param {Bootstrap} bootstrap 
 */
export const addItemToBootstrap = async (bootstrap, item) => {
  /** @type {Bootstrap} */
  const {
    instance: { publicFacet },
    contractAssets,
    purses,
    zoe,
  } = bootstrap;

  const mintItemInvitation = await E(publicFacet).makeMintItemInvitation();
  const itemAmount = AmountMath.make(contractAssets.item.brand, harden([item]))

  const proposal = harden({
    want: { Item: itemAmount },
  });

  const userSeat = await E(zoe).offer(mintItemInvitation, proposal);
  const payout = await E(userSeat).getPayout("Asset");
  purses.item.deposit(payout);
};
harden(addItemToBootstrap);

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

  /** @type {object.<string, AssetObject>} */
  const fts = {};

  /** @type {object.<string, AssetObject>} */
  const nfts = {};

  /** @type {object.<string, AssetObject>} */
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
  const makePayment = (mint, brand) => (value) => mint.mintPayment(AmountMath.make(brand, value));

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
    const keyword = first.toUpperCase() + rest.join("");
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
