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
 * Return value from bootstrap.js
 *
 * @typedef {{
 *  assets: Assets
 *  contractAssets: ContractAssets
 *  zoe: ZoeService
 *  purses: {
 *    character: any
 *    item: any
 *    payment: any
 *  }
 *  instance: StartInstanceResult
 * }} Bootstrap
 */

/**
 * Configuration options for bootstrapping
 *
 * @typedef {{
 *  assets: AssetConf
 *  content: RequirementObject[]
 * }} BootstrapConf
 */
