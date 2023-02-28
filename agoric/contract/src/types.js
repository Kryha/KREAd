// ts-check
/**
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
 * @typedef {{
 *   character: ZCFMint<"set">
 *   item: ZCFMint<"set">
 *   paymentFT: ZCFMint<"nat">
 * }} AssetMints
 *
 * * @typedef {{
 *   character: CharacterMarketRecord[]
 *   item: ItemMarketRecord[]
 * }} Market
 *
 * @typedef {{
 *   character: {
 *     name: string
 *     brand: Brand
 *     issuer: Issuer<set>
 *   }
 *   item: {
 *     name: string
 *     brand: Brand
 *     issuer: Issuer<set>
 *   }
 *   paymentFT: {
 *     name: string
 *     brand: Brand
 *     issuer: Issuer<nat>
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
 *   item: object[]
 *   askingPrice: any
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
 *   timerService: TimerService
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
 * @typedef {{
 *   get: {
 *     isReady: () => boolean
 *     isConfigReady: () => boolean
 *     inventory: (name: string) => { items: Item[] }
 *     inventoryPublisher: (name: string) => Publisher<any>
 *     characterKey: (name: string) => { key: Amount }
 *     characterCount: () => number
 *     itemCount: () => number
 *     character: (name: string) => CharacterRecord
 *     time: () => Promise<bigint>
 *     randomBaseCharacter: () => object
 *     assetInfo: () => TokenInfo
 *     defaultItems: () => any[]
 *     powers: () => Powers
 *     config: () => Config
 *     randomItem: () => object
 *     marketPublisher: () => {
 *       characters: {
 *         subscriber: StoredSubscriber<any>;
 *         publisher: Publisher<any>;
 *       };
 *       items: {
 *         subscriber: StoredSubscriber<any>;
 *         publisher: Publisher<...>;
 *       };
 *     }
 *   }
 *   set: {
 *     powers: (powers: Powers, notifiers: Notifiers) => void
 *     boardId: (boardId: string) => void
 *   }
 *   add: {
 *     characters: (characters: CharacterRecord[]) => void
 *     items: (items: ItemRecord[]) => void
 *     updateConfig: (newConfig: Config) => void
 *   }
 *   validate: {
 *     nameIsUnique: (name: string) => boolean
 *   }
 *   public: {
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
 *   }
 * }} KreadState
 */
