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
 * @typedef  {{
 *   sellerSeat: ZCFSeat
 *   name: string
 *   character: object[]
 *   askingPrice: any
 * }} CharacterMarketRecord
 *
 * @typedef  {{
 *   sellerSeat: ZCFSeat
 *   id: string
 *   asset: object[]
 *   askingPrice: any
 *   isFirstSale: boolean
 *   royalty: Amount<AssetKind>
 *   platformFee: Amount<AssetKind>
 *   recorderKit: import("./utils.js").RecorderKit
 * }} ItemMarketRecord
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
 *   name: string
 *   character: object
 *   inventory: ZCFSeat
 *   seat?: ZCFSeat
 *   notifier?: Notifier
 *   publisher: Publisher<any>
 * }} CharacterRecord
 *
 * @typedef {{
 *   noseline?: Item;
 *   midBackground?: Item;
 *   mask?: Item;
 *   headPiece?: Item;
 *   hair?: Item;
 *   frontMask?: Item;
 *   liquid?: Item;
 *   background?: Item;
 *   airReservoir?: Item;
 *   clothing?: Item;
 * }} DefaultItem
 *
 * @typedef {{
 *   id: bigint
 *   character: object
 *   inventory: ZCFSeat
 *   seat?: ZCFSeat
 *   sell: {
 *     instance: Instance
 *     publicFacet: any
 *     price: bigint
 *   }
 * }} CharacterInMarket
 *
 * @typedef {{
 *   name: string;
 *   category: string;
 *   id: string;
 *   description: string;
 *   image: string;
 *   level: number;
 *   rarity: number;
 *   effectiveness?: number;
 *   layerComplexity?: number;
 *   forged: string;
 *   baseMaterial: string;
 *   colors: string[];
 *   projectDescription: string;
 *   price: number;
 *   details: any;
 *   date: string;
 *   activity: any[];
 * }} Item
 *
 * @typedef {{
 *   id: bigint
 *   item: object
 * }} ItemRecord
 *
 * @typedef {{
 *   id: bigint
 *   item: Item
 *   sell: {
 *     instance: Instance
 *     publicFacet: any
 *     price: bigint
 *  }
 * }} ItemInMarket
 *
 * // PRIVATE STORAGE
 * @typedef {{
 *   id: bigint;
 *   add?: string[];
 *   remove?: string[];
 * }} InventoryEvent
 *
 * @typedef {{
 *   seat?: ZCFSeat;
 *   name: string;
 *   history: InventoryEvent[];
 * }} InventoryKeyRecord
 *
 * @typedef {InventoryKeyRecord[]} InventoryKeyStorage
 *
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
