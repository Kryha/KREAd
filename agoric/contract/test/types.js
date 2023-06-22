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
 *  fts: Object.<string, AssetObject>
 *  nfts: Object.<string, AssetObject>
 *  all: Object.<string, AssetObject>
 *  issuerKeywordRecord: IssuerKeywordRecord
 * }} Assets
 */

/**
 * Return value from bootstrap.js
 *
 * @typedef {{
 *  assets: Assets
 *  zoe: ZoeService
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
