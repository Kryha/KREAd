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

/**
 * @typedef {{
 * character: Purse
 * item: Purse
 * payment: Purse
 * }} Purses
 */

/**
 * @typedef {{
 *  name: string
 *  purses: Purses
 *  getItems: () => Item[]
 *  getCharacters: () => any[]
 *  getPaymentBalance: async () => bigint
 *  depositItems: (items) => void
 *  depositCharacters: (characters) => void
 *  depositPayment: (payment) => void
 *  withdrawItems: (items) => Payment
 *  withdrawCharacters: (characters) => Payment
 *  withdrawPayment: (payment) => Payment
 *  getSeat: () => any
 *  setMarketSeat: (seat) => void
 * }} KreadUser
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
 *  governorFacets: import('@agoric/governance/tools/puppetContractGovernor').PuppetContractGovernorKit<import('../../src/kreadV2/index.js').prepare>;
 *  zoe: ZoeService;
 *  purses: {
 *    character: any
 *    item: any
 *    payment: any
 *  };
 *  users: Object.<string, KreadUser>;
 *  storageNode: StorageNode;
 * }} Context
 */
