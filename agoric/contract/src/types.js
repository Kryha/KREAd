// ts-check
/**
 * @typedef {{
 * characterNames: string[]
 * characters: CharacterRecord[]
 * config?: Config
 * }} State
 * @typedef {{
 * baseCharacters: object[]
 * defaultItems: object[]
 * completed?: boolean
 * }} Config
 * @typedef {{
 * name: string
 * character: object
 * inventory: ZCFSeat
 * seat?: ZCFSeat
 * auction?: {
 *   instance: Instance,
 *   publicFacet: any,
 * },
 * }} CharacterRecord
 * @typedef {{
 * noseline?: Item;
 * midBackground?: Item;
 * mask?: Item;
 * headPiece?: Item;
 * hair?: Item;
 * frontMask?: Item;
 * liquid?: Item;
 * background?: Item;
 * airResevoir?: Item;
 * clothing?: Item;
 * }} DefaultItems
 * @typedef {{
 * name: string;
 * category: string;
 * id: string;
 * description: string;
 * image: string;
 * level: number;
 * rarity: number;
 * effectiveness?: number;
 * layerComplexity?: number;
 * forged: string;
 * baseMaterial: string;
 * colors: string[];
 * projectDescription: string;
 * price: number;
 * details: any;
 * date: string;
 * slots?: any[];
 * activity: any[];
 * }} Item
 *
 * // PRIVATE STORAGE
 * @typedef {{
 * id: number;
 * add?: string[];
 * remove?: string[];
 * }} InventoryEvent
 * @typedef {{
 * seat?: ZCFSeat;
 * name: string;
 * history: InventoryEvent[];
 * }} InventoryKeyRecord
 * @typedef {InventoryKeyRecord[]} InventoryKeyStorage
 */
