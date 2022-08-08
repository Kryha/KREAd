export const GO_BACK = -1;
export const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5001";
export const MIN_PRICE = 0;
export const MAX_PRICE = 10000000;
export const INFORMATION_STEP = 0;
export const PAYMENT_STEP = 1;
export const CONFIRMATION_STEP = 2;
export const MINTING_COST = 2;
export const MONEY_DECIMALS = 6;

export const SUCCESSFUL_MINT_REPONSE_MSG = "Character mint successful, use attached public facet to purchase";
export const BUY_FLOW_STEPS = 3;
export const SELL_FLOW_STEPS = 2;
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

export const FIRST_TIME = "first_time";
export const CHARACTER_PURSE_NAME = "KREA";
export const ITEM_PURSE_NAME = "KREAITEM";
