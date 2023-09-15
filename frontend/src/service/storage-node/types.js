/**
 * @template Slot
 * @typedef {object} CapData
 * @property {string} body A JSON.stringify of an Encoding
 * @property {Slot[]} slots
 */

/**
 * @template Slot
 * @callback ToCapData
 * @param {Passable} val
 * @returns {CapData<Slot>}
 */

/**
 * @template Slot
 * @callback FromCapData
 * @param {CapData<Slot>} data
 * @returns {Passable}
 */

/**
 * @template Slot
 * @typedef {object} Marshal
 * @property {ToCapData<Slot>} serialize use toCapData
 * @property {FromCapData<Slot>} unserialize use fromCapData
 * @property {ToCapData<Slot>} toCapData
 * @property {FromCapData<Slot>} fromCapData
 */
