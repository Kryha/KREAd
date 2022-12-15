// ts-check
/**
 * @typedef {{
 *   characters: CharacterRecord[]
 *   charactersMarket: CharacterInMarket[]
 *   itemsMarket: ItemInMarket[]
 *   items: ItemRecord[]
 *   config?: Config
 *   itemCount: bigint
 *   characterCount: bigint
 *   assets?: {
 *     character: {
 *       brand: Brand
 *       issuer: Issuer
 *     }
 *     item: {
 *       brand: Brand
 *       issuer: Issuer
 *     }
 *     token: {
 *       brand: Brand
 *       issuer: Issuer
 *     }
 *   }
 *   market: {
 *     characters: CharacterMarketRecord[],
 *     items: ItemMarketRecord[],
 *   }
 *   randomNumber?: Function
 * }} State
 *
 * @typedef  {{
 *   sellerSeat: ZCFSeat
 *   name: string
 *   character: object[]
 *   askingPrice: any
 * }} CharacterMarketRecord
 *
 *
 * @typedef  {{
 *   sellerSeat: ZCFSeat
 *   id: string
 *   item: object[]
 *   askingPrice: any
 * }} ItemMarketRecord
 *
 * @typedef {{
 *   baseCharacters: object[]
 *   defaultItems: object[]
 *   completed: boolean
 *   moneyIssuer: Issuer
 *   moneyBrand: Brand
 *   sellAssetsInstallation: Installation
 *   chainTimerService?: TimerService
 * }} Config
 *
 * @typedef {{
 *   name: string
 *   character: object
 *   inventory: ZCFSeat
 *   seat?: ZCFSeat
 *   auction?: {
 *     instance: Instance,
 *     publicFacet: any,
 *   },
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
 * }} DefaultItems
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
 */
