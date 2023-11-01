/**
 * Configuration options for seting up asset kits
 *
 * @typedef {{
 *  fts?: string[]
 *  nfts?: string[]
 * }} AssetConf
 */

/**
 * AssetObject
 *
 * @typedef {{
 *  kit: IssuerKit,
 *   makeAmount: {
 *    brand: Brand,
 *    value: bigint
 *   },
 *   name: string
 * }} AssetObject
 */

/**
 * Return value from setup-assets.js
 *
 * @typedef {{
 *  fts: {[key: string]: AssetObject}
 *  nfts: {[key: string]: AssetObject}
 *  all: {[key: string]: AssetObject}
 *  issuerKeywordRecord: IssuerKeywordRecord
 * }} Assets
 */

/**
 * Contract assets as returned from getTokenInfo
 *
 * @typedef {{
 *  character: { brand: Brand, issuer: Issuer, name: string }
 *  item: { brand: Brand, issuer: Issuer, name: string }
 * }} ContractAssets
 */

// XXX approximate
/**
 * Testing context
 *
 * @typedef {{
 *  assets: Assets;
 *  creatorFacet: unknown;
 *  contractAssets: ContractAssets;
 *  publicFacet: unknown;
 *  zoe: ZoeService;
 *  purses: {
 *    character: any
 *    item: any
 *    payment: any
 *  };
 * }} Context
 */
