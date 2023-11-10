// @ts-check

/**
 * @typedef {{
 *   mintFee: bigint,
 *   royaltyRate: RatioObject,
 *   platformFeeRate: RatioObject,
 *   mintRoyaltyRate: RatioObject,
 *   mintPlatformFeeRate: RatioObject,
 *   royaltyDepositFacet: DepositFacet,
 *   platformFeeDepositFacet: DepositFacet,
 *   assetNames: { character: string, item: string },
 *   minUncommonRating: number
 * }} KREAdTerms
 */

/**
 * @typedef {{
 *    storageNode: StorageNode
 *    marshaller: Marshaller
 * }} Powers
 *
 * @typedef {{
 *   type: string,
 *   data: any,
 *   timestamp: object
 * }} HistoryEntry
 *
 *  @typedef {{
 *  title: string,
 *  description: string,
 *  origin: string,
 *  level: number,
 *  artistMetadata: string,
 *  image: string,
 *  characterTraits: string
 * }} BaseCharacter
 *
 * @typedef {{
 *  title: string,
 *  description: string,
 *  origin: string,
 *  level: number,
 *  artistMetadata: string,
 *  image: string,
 *  characterTraits: string,
 *  name: string,
 *  keyId: number,
 *  id: number,
 *  date: object
 * }} Character
 *
 * @typedef {{
 *   name: string
 *   character: Character
 *   inventory: ZCFSeat
 *   inventoryKit: import('@agoric/zoe/src/contractSupport').RecorderKit<[Item, bigint][]>
 *   history: HistoryEntry[]
 * }} CharacterEntry
 *
 *  @typedef {{
 *   name: string
 *   character: Character
 *   inventoryKit: import('@agoric/zoe/src/contractSupport').RecorderKit<[Item, bigint][]>
 *   history: HistoryEntry[]
 * }} CharacterRecorder
 *
 * @typedef {{
 *   name: string;
 *   category: string;
 *   description: string;
 *   functional: boolean;
 *   origin: string;
 *   image: string;
 *   thumbnail: string;
 *   rarity: number;
 *   level: number;
 *   filtering: number;
 *   weight: number;
 *   sense: number;
 *   reserves: number;
 *   durability: number;
 *   colors: string[];
 *   artistMetadata: string;
 * }} Item
 *
 * @typedef {{
 *   id: number
 *   item: Item
 *   history: HistoryEntry[]
 * }} ItemEntry
 *
 * @typedef {{
 *   id: number
 *   item: Item
 *   history: HistoryEntry[]
 * }} ItemRecorder
 *
 * @typedef {{
 *   id: number
 *   seat: ZCFSeat
 *   recorderKit: import('@agoric/zoe/src/contractSupport').RecorderKit<MarketRecorder>
 *   askingPrice: Amount<'nat'>
 *   royalty: Amount<'nat'>
 *   platformFee: Amount<'nat'>
 *   asset: Character | Item
 *   isFirstSale: boolean
 * }} MarketEntry
 *
 * @typedef {{
 *   id: number
 *   askingPrice: Amount<'nat'>
 *   royalty: Amount<'nat'>
 *   platformFee: Amount<'nat'>
 *   asset: Character | Item
 *   isFirstSale: boolean
 * } | ""} MarketRecorder
 *
 * @typedef {Partial<{
 *   averageLevel: UpdateAverage
 *   marketplaceAverageLevel: UpdateAverage
 *   latestSalePrice: number
 *   collectionSize: boolean
 *   amountSold: boolean,
 *   putForSaleCount: boolean
 * }>} UpdateMetrics
 *
 * @typedef {{
 *  amountSold: number
 *  collectionSize: number
 *  averageLevel: number
 *  marketplaceAverageLevel: number
 *  latestSalePrice: number
 *  putForSaleCount: number
 * }} MarketMetrics
 *
 * @typedef {{
 *   type: ("add" | "remove")
 *   value: number
 * }} UpdateAverage
 *
 * @typedef {{
 *   numerator: bigint,
 *   denominator: bigint,
 *  }} RatioObject
 *
 * @typedef {{
 *   success: boolean,
 *   error: string,
 * }} HelperFunctionReturn
 *
 * @typedef {{
 *   infoKit: import('@agoric/zoe/src/contractSupport').RecorderKit<unknown>;
 *   characterKit: import('@agoric/zoe/src/contractSupport').RecorderKit<CharacterRecorder>;
 *   itemKit: import('@agoric/zoe/src/contractSupport').RecorderKit<ItemRecorder>;
 *   marketCharacterKit: import('@agoric/zoe/src/contractSupport').RecorderKit<MarketRecorder[]>;
 *   marketItemKit: import('@agoric/zoe/src/contractSupport').RecorderKit<MarketRecorder[]>;
 *   marketCharacterMetricsKit: import('@agoric/zoe/src/contractSupport').RecorderKit<MarketMetrics>;
 *   marketItemMetricsKit: import('@agoric/zoe/src/contractSupport').RecorderKit<MarketMetrics>;
 * }} KreadKitRecorderKits
 *
 * @typedef {Object.<keyof KreadKitRecorderKits, Pattern>} KreadKitRecorderKitPaths
 * @typedef {Object.<keyof KreadKitRecorderKits, string>} KreadKitRecorderKitMatchers
 *
 */
