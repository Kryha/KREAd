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
 * Holds contract data
 *
 * @typedef {{
 *   config: Config
 *   assetMints: AssetMints
 *   tokenInfo: TokenInfo
 *   notifiers: Notifiers
 *   characters: CharacterRecord[]
 *   items: ItemRecord[]
 *   randomNumber?: Function
 *   market: Market
 *   ready: boolean
 *   boardId?: string
 * }} State
 *
 * Assets
 * @typedef {{
 *   character: ZCFMint<"copyBag">
 *   item: ZCFMint<"copyBag">
 * }} AssetMints
 *
 * @typedef {{
 *   character: CharacterMarketRecord[]
 *   item: ItemMarketRecord[]
 * }} Market
 *
 * @typedef {{
 *   character: {
 *     name: string
 *     brand: Brand
 *     issuer: Issuer<'set'>
 *   }
 *   item: {
 *     name: string
 *     brand: Brand
 *     issuer: Issuer<'set'>
 *   }
 * }} TokenInfo
 *
 * @typedef {{
 *    storageNode: StorageNode
 *    marshaller: Marshaller
 * }} Powers
 *
 * @typedef {{
 *   tokenData: {
 *     characters: object[]
 *     items: object[]
 *   }
 *   defaultPaymentToken?: {
 *      brand: Brand<"nat">
 *      issuer: Issuer<"nat">
 *   }
 *   timerService: import('@agoric/time/src/types').TimerService
 *   powers: Powers
 * }} Config
 *
 * @typedef {{
 *    market: {
 *      characters: {
 *        subscriber: StoredSubscriber<any>
 *        publisher: Publisher<any>
 *      }
 *      items: {
 *        subscriber: StoredSubscriber<any>
 *        publisher: Publisher<any>
 *      }
 *    }
 *    inventory: {
 *      subscriber: StoredSubscriber<any>
 *      publisher: Publisher<any>
 *    }
 *    info: {
 *      subscriber: StoredSubscriber<any>
 *      publisher: Publisher<any>
 *    }
 * }} Notifiers
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
 *   inventoryKit: unknown
 *   history: HistoryEntry[]
 * }} CharacterEntry
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
 *   seat: ZCFSeat
 *   recorderKit: unknown
 *   askingPrice: Amount<'nat'>
 *   royalty: Amount<'nat'>
 *   platformFee: Amount<'nat'>
 *   asset: Character | Item
 *   isFirstSale: boolean
 * }} MarketEntry
 *
 * @typedef {{
 *  isReady: () => boolean
 *  isConfigReady: () => boolean
 *  inventory: (name: string) => { items: Item[] }
 *  inventoryPublisher: (name: string) => Publisher<any>
 *  characterKey: (name: string) => { key: Amount }
 *  characterCount: () => number
 *  itemCount: () => number
 *  character: (name: string) => CharacterRecord
 *  time: () => Promise<bigint>
 *  randomBaseCharacter: () => object
 *  assetInfo: () => TokenInfo
 *  defaultItems: () => any[]
 *  powers: () => Powers
 *  config: () => Config
 *  randomItem: () => object
 *  marketPublisher: () => {
 *    characters: {
 *      subscriber: StoredSubscriber<any>
 *      publisher: Publisher<any>
 *    }
 *    items: {
 *      subscriber: StoredSubscriber<any>
 *      publisher: Publisher<any>
 *    }
 * }
 * }} KreadState_get
 *
 * @typedef {{
 *     powers: (powers: Powers, notifiers: Notifiers) => void
 *     publishKreadInfo: (boardId: string, publicFacet: object) => void
 * }} KreadState_set
 *
 * @typedef {{
 * characters: (characters: CharacterRecord[]) => void
 *     items: (items: ItemRecord[]) => void
 *     updateConfig: (newConfig: Config) => void
 * }} KreadState_add
 *
 * @typedef {{ nameIsUnique: NameIsUniqueFn }} KreadState_validate
 *
 * @typedef {{
 *     isReady: () => boolean
 *     isValidName: () => boolean
 *     getInventory: (name: string) => { items: Item[] }
 *     getCharacterKey: (name: string) => { key: Amount }
 *     getCount: () => { characters: bigint, items: bigint }
 *     getCharacter: (name: string) => CharacterRecord
 *     getTime: () => Promise<bigint>
 *     getRandomBaseCharacter: () => object
 *     getTokenInfo: () => TokenInfo
 *     getDefaultItems: () => any[]
 *     getPowers: () => Powers | undefined
 *     getConfig: () => Config
 *     getRandomItem: () => object
 *     getCharacterCount: () => number
 *     getItemCount: () => number
 *     getCharacterMarket: () => CharacterMarketRecord[]
 *     getCharacterMarketRange: () => CharacterMarketRecord[]
 *     getItemMarket: () => ItemMarketRecord[]
 *     getItemMarketRange: () => ItemMarketRecord[]
 *   }} KreadState_public
 *
 *   @typedef {{
 *     get: KreadState_get
 *     set: KreadState_set
 *     add: KreadState_add
 *     validate: KreadState_validate
 *     public: KreadState_public
 * }} KreadState
 *
 * @typedef {(name: string) => boolean} NameIsUniqueFn
 *
 * @typedef {Partial<{
 *     averageLevel: UpdateAverage
 *     marketplaceAverageLevel: UpdateAverage
 *     latestSalePrice: number
 *     collectionSize: boolean
 *     amountSold: boolean,
 *     putForSaleCount: boolean
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
 *     type: ("add" | "remove")
 *     value: number
 * }} UpdateAverage
 *
 * @typedef {{
 *     numerator: bigint,
 *     denominator: bigint,
 *  }} RatioObject
 *
 * @typedef {{
 *     success: boolean,
 *     error: string,
 * }} HelperFunctionReturn
 */
