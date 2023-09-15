import { BUY_FLOW_STEPS, BUY_FLOW_WIDTH, SELL_FLOW_WIDTH, SMALL_SCREEN_WIDTH } from "../constants";

export const tabWidth = (width: number, amount: number) =>
  width * SMALL_SCREEN_WIDTH - (amount === BUY_FLOW_STEPS ? BUY_FLOW_WIDTH : SELL_FLOW_WIDTH);
