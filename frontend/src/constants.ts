export const GO_BACK = -1 as const;
export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5001";
export const MIN_PRICE = 0 as const;
export const MAX_PRICE = 10000000 as const;
export const INFORMATION_STEP = 0 as const;
export const WALLET_INTERACTION_STEP = 1 as const;
export const CONFIRMATION_STEP = 2 as const;
export const MINTING_COST = 2 as const;
export const MONEY_DECIMALS = 6 as const;

export const SUCCESSFUL_MINT_REPONSE_MSG = "Character mint successful, use attached public facet to purchase" as const;
export const SELL_CHARACTER_DESCRIPTION = "Sell Character in KREAd marketplace" as const;
export const SELL_ITEM_DESCRIPTION = "Sell Item in KREAd marketplace" as const;
export const MINT_CHARACTER_FLOW_STEPS = 3 as const;
export const BUY_FLOW_STEPS = 2 as const;
export const SELL_FLOW_STEPS = 3 as const;
export const BUY_FLOW_WIDTH = 80 as const;
export const SELL_FLOW_WIDTH = 140 as const;
export const SMALL_SCREEN_WIDTH = 0.4 as const;

export const CTP_LOG_CONFIG = {
  RETURN: false,
  CALL: true,
} as const;
export const SMALL_SCREEN_SIZE = 1600 as const;
export const MEDIUM_SCREEN_SIZE = 1780 as const;
export const LARGE_SCREEN_SIZE = 1920 as const;
export const EXTRA_LARGE_SCREEN_SIZE = 2560 as const;
export const ONE_HUNDRED_PERCENT = 100 as const;

export const UNMOUNTED = "unmounted" as const;
export const EXITED = "exited" as const;
export const ENTERED = "entered" as const;
export const EXITING = "exiting" as const;
export const MILLISECONDS = 1000 as const;

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
} as const;

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

export const SELL_ITEM_INVITATION = "makeSellItemInvitation";
export const SELL_CHARACTER_INVITATION = "makeSellCharacterInvitation";

export const AGORIC_RPC = import.meta.env.VITE_RPC || "http://127.0.0.1:26657";
