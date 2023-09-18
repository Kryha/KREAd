export const GO_BACK = -1;
export const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:5001";
export const MIN_PRICE = 0;
export const MAX_PRICE = 10000000;
export const INFORMATION_STEP = 0;
export const PAYMENT_STEP = 1;
export const CONFIRMATION_STEP = 2;
export const MINTING_COST = 2;
export const MONEY_DECIMALS = 6;

export const SUCCESSFUL_MINT_REPONSE_MSG =
  "Character mint successful, use attached public facet to purchase";
export const BUY_FLOW_STEPS = 3;
export const SELL_FLOW_STEPS = 2;
export const BUY_FLOW_WIDTH = 80;
export const SELL_FLOW_WIDTH = 140;
export const SMALL_SCREEN_WIDTH = 0.4;

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

export const COLORS = ["#B1A2A2", "#7B5B7B", "#968996", "#FFFFFF", "#0000006", "#3063A5"] as const;

export const SECTION = {
  SHOP: "shop",
  INVENTORY: "inventory",
} as const;

export const CHARACTER_CATEGORIES = ["tempetScavenger", "forSale", "equipped"] as const;

export const ASSET_TYPE = {
  CHARACTER: "character",
  ITEM: "item",
};

export const AGORIC_LINK = "https://agoric.com/" as const;
export const KRYHA_LINK = "https://kryha.io/" as const;

export const MAX_CHARACTER_LENGTH = 20 as const;
export const SLIDER_TIME = 4.5 as const;
export const PAGE_SIZE = 10 as const;
export const ASSETS_PER_PAGE = 10 as const;

export const FIRST_TIME = "first_time" as const;
export const CHARACTER_PURSE_NAME = "KREA" as const;
export const ITEM_PURSE_NAME = "KREAITEM" as const;

export const EVENT_TYPE = {
  mint: "mint",
  sell: "sell",
  buy: "buy",
};
