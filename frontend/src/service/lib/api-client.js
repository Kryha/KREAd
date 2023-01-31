// @ts-check
// eslint-disable-next-line no-redeclare
/* globals window, WebSocket */
import { registerSocket, closeSocket, getActiveSocket } from "./socket.js";

import dappConstants from "../constants.js";

const { API_URL } = dappConstants;

// === WEB SOCKET

function getWebSocketEndpoint(endpoint) {
  // TODO proxy socket.
  const url = new URL(endpoint, API_URL || window.origin);
  url.protocol = url.protocol.replace(/^http/, "ws");
  return url.href;
}

/**
 * @typedef {Object} SocketHandler
 * @property {() => void} [onConnect]
 * @property {(msg: Record<string, unknown>) => void} [onMessage]
 * @property {() => void} [onDisconnect]
 */

const handlerToListener = new Map();

/**
 * JSON.Stringify Alternative
 *
 * @param {object} obj
 */
function objToString(obj) {
  let str = "";
  for (const [p, val] of Object.entries(obj)) {
    str += `${p}::${val}\n`;
  }
  return str;
}

/**
 * Make a new socket to the API handler.
 *
 * @param {SocketHandler} handler
 * @param {string} endpoint
 */
function createSocket({ onConnect, onDisconnect, onMessage }, endpoint) {
  const socket = new WebSocket(getWebSocketEndpoint(endpoint));
  registerSocket(endpoint, {
    close() {
      socket.close();
    },
    send(obj) {
      const objStr = JSON.stringify(obj);
      socket.send(objStr);
    },
    addHandler(handler) {
      const listener = ({ data }) => handler(JSON.parse(data));
      handlerToListener.set(handler, listener);
      socket.addEventListener("message", listener);
    },
    removeHandler(handler) {
      const listener = handlerToListener.get(handler);
      socket.removeEventListener("message", listener);
      handlerToListener.delete(handler);
    },
  });
  if (onConnect) {
    socket.addEventListener("open", () => onConnect());
  }
  if (onDisconnect) {
    socket.addEventListener("close", () => onDisconnect());
  }
  if (onMessage) {
    socket.addEventListener("message", ({ data }) => onMessage(JSON.parse(data)));
  }
}

/**
 * Start a given socket connection.
 *
 * @param {SocketHandler} socketListeners
 * @param {*} endpoint
 */
export function activateSocket(socketListeners = {}, endpoint = "/api") {
  if (getActiveSocket(endpoint)) return;
  createSocket(socketListeners, endpoint);
}

export function deactivateSocket(endpoint = "/api") {
  if (!getActiveSocket(endpoint)) return;
  closeSocket(endpoint);
}

export async function rpc(req, endpoint = "/api") {
  // Use the socket directly.
  const socket = getActiveSocket(endpoint);
  if (!socket) {
    throw Error(`Must activate socket before rpc to ${endpoint}`);
  }

  let resolve;
  const p = new Promise((res) => {
    resolve = res;
  });
  socket.send(req);
  const expectedResponse = `${req.type}Response`;
  function getResponse(obj) {
    // console.log('got', msg);
    if (obj.type === expectedResponse) {
      resolve(obj);
      socket.removeHandler(getResponse);
    }
  }
  socket.addHandler(getResponse);
  return p;
}
