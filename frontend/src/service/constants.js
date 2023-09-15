/* eslint-disable */

/* global process */
// Taken from window.DAPP_CONSTANTS_JSON in index.html, defaulting to .env.local.
import defaults from "./conf/defaults.js";

export default import.meta.env.VITE_DAPP_CONSTANTS_JSON ? JSON.parse(import.meta.env.VITE_DAPP_CONSTANTS_JSON) : defaults;
