export const GO_BACK = -1;
export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5001";
export const MIN_PRICE = 0;
export const MAX_PRICE = 10000000;
export const INFORMATION_STEP = 0;
export const WALLET_INTERACTION_STEP = 1;
export const CONFIRMATION_STEP = 2;
export const MINTING_COST = 2;
export const MONEY_DECIMALS = 6;

export const SUCCESSFUL_MINT_REPONSE_MSG = "Character mint successful, use attached public facet to purchase";
export const SELL_CHARACTER_DESCRIPTION = "Sell Character in KREAd marketplace";
export const SELL_ITEM_DESCRIPTION = "Sell Item in KREAd marketplace";
export const MINT_CHARACTER_FLOW_STEPS = 3;
export const BUY_FLOW_STEPS = 2;
export const SELL_FLOW_STEPS = 3;
export const BUY_FLOW_WIDTH = 80;
export const SELL_FLOW_WIDTH = 140;
export const SMALL_SCREEN_WIDTH = 0.4;

export const CTP_LOG_CONFIG = {
  RETURN: false,
  CALL: true,
};
export const SMALL_SCREEN_SIZE = 1600;
export const MEDIUM_SCREEN_SIZE = 1780;
export const LARGE_SCREEN_SIZE = 1920;
export const EXTRA_LARGE_SCREEN_SIZE = 2560;
export const ONE_HUNDRED_PERCENT = 100;

export const UNMOUNTED = "unmounted";
export const EXITED = "exited";
export const ENTERED = "entered";
export const EXITING = "exiting";
export const MILLISECONDS = 1000;

export const ITEM_CATEGORIES = {
  all: [
    "noseline",
    "midBackground",
    "mask",
    "headPiece",
    "hair",
    "airReservoir",
    "liquid",
    "background",
    "frontMask",
    "clothing",
    "forSale",
    "equipped",
  ],
  allCategories: "allCategories",
  noseline: "noseline",
  midBackground: "midBackground",
  mask: "mask",
  headPiece: "headPiece",
  hair: "hair",
  airReservoir: "airReservoir",
  liquid: "liquid",
  background: "background",
  frontMask: "frontMask",
  clothing: "clothing",
  forSale: "forSale",
  equipped: "equipped",
};

export const CHARACTER_CATEGORIES = ["tempetScavenger", "forSale", "equipped"];

export const AGORIC_LINK = "https://agoric.com/";
export const KRYHA_LINK = "https://kryha.io/";

export const MAX_CHARACTER_LENGTH = 16;
export const SLIDER_TIME = 4.5;
export const PAGE_SIZE = 10;

export const FIRST_TIME = "first_time";
export const CHARACTER_PURSE_NAME = "KREA";
export const ITEM_PURSE_NAME = "KREAITEM";

export const EVENT_TYPE = {
  mint: "mint",
  sell: "sell",
  buy: "buy",
};

export const STORAGE_NODE_SPEC_MARKET_ITEMS = ":published.kread.market-items";
export const STORAGE_NODE_SPEC_MARKET_CHARACTERS = ":published.kread.market-characters";

export const STORAGE_NODE_SPEC_INVENTORY = ":published.kread.inventory-";

export const isDevelopmentMode = process.env.NODE_ENV === "development";

export const DOWNLOAD_CANVAS_WIDTH = 2500;
export const DOWNLOAD_CANVAS_HEIGHT = 2500;

export const networkConfigs = {
  mainnet: {
    label: "Agoric Mainnet",
    url: "https://main.agoric.net/network-config",
  },
  testnet: {
    label: "Agoric Testnet",
    url: "https://testnet.agoric.net/network-config",
    chainId: "agoriclocal",
  },
  devnet: {
    label: "Agoric Devnet",
    url: "https://devnet.agoric.net/network-config",
  },
  ollinet: {
    label: "Agoric Ollinet",
    url: "https://ollinet.agoric.net/network-config",
  },
  emerynet: {
    label: "Agoric Emerynet",
    url: "https://emerynet.agoric.net/network-config",
  },
  localhost: {
    label: "Local Network",
    url: "http://localhost:3000/wallet/network-config",
  },
  localDevnet: {
    label: "Local Devnet",
    url: "https://wallet.agoric.app/wallet/network-config", //"https://wallet.agoric.app/wallet/network-config",
  },
};

export const localBridgeHref = "http://localhost:3000/wallet/bridge.html";
export const prodBridgeHref = "https://wallet.agoric.app/wallet/bridge.html";
export const devBridgeHref = "https://main.wallet-app.pages.dev/wallet/bridge.html";

export const bridgeHref = import.meta.env.VITE_BRIDGE_HREF || localBridgeHref;

export const walletUiHref = () => {
  const bridgeUrl = new URL(prodBridgeHref);
  return bridgeUrl ? bridgeUrl.origin + "/wallet/" : "";
};

export const IST_IDENTIFIER = "IST";
export const KREAD_IDENTIFIER = "kread";
export const ITEM_IDENTIFIER = "KREAdITEM";
export const CHARACTER_IDENTIFIER = "KREAdCHARACTER";

export const AGORIC_RPC = import.meta.env.VITE_RPC || "http://127.0.0.1:26657";
