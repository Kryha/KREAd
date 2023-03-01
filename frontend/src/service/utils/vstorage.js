import { decodeToJustin } from "@endo/marshal";
import { LOCAL_DEVNET_RPC, networkConfigs } from "../../constants";

export const vstorage = {
  url: (path = 'published', { kind = 'children', height = 0 } = {}) =>
    `http://localhost:26657/abci_query?path=%22/custom/vstorage/${kind}/${path}%22&height=${height}`,
  decode: ({ result: { response } }) => {
    const { code } = response;
    if (code !== 0) {
      throw response;
    }
    const { value } = response;
    const decoded = atob(value);
    console.log("hello")
    const sanitized = (JSON.stringify(decoded)).replace(/\\/g, '');
    const result = sanitized.slice(15, sanitized.length - 4);
    // console.log(JSON.parse(result))
    return result;
  },
  /**
   * @param {string} path
   * @param {(url: string, data: object) => Promise<any>} getJSON
   */
  read: async (path = 'kread', getJSON) => {
    // console.log(vstorage.url(path, { kind: 'data' }));
    const kind = 'children';
    const data = {
      jsonrpc: "2.0",
      id:1432,
      method:"abci_query",
      params: { path:`/custom/vstorage/data/published.kread.info`}
    };
    const raw = await getJSON(LOCAL_DEVNET_RPC, data);
    /** @type {{ value: string }} */
    const { value } = JSON.parse(raw);
    console.log(JSON.parse(value));
    return vstorage.decode(raw);
  },
  /**
   * @param {string} path
   * @param {*} getJSON
   * @param {number} [height]
   * @returns {Promise<{blockHeight: number, values: string[]}>}
   */
  readAt: async (path, getJSON, height = undefined) => {
    const raw = await getJSON(vstorage.url(path, { kind: 'data', height }));
    const txt = vstorage.decode(raw);
    /** @type {{ value: string }} */
    const { value } = JSON.parse(txt);
    return JSON.parse(value);
  },
  readAll: async (path, getJSON) => {
    const parts = [];
    let blockHeight;
    do {
      let values;
      try {
        ({ blockHeight, values } = await vstorage.readAt(
          path,
          getJSON,
          blockHeight && blockHeight - 1,
        ));
      } catch (err) {
        if ('log' in err && err.log.match(/unknown request/)) {
          break;
        }
        throw err;
      }
      // console.debug(blockHeight, values.length);
      parts.push(values);
    } while (blockHeight > 0);
    return parts.flat();
  },
};

