import { Config } from "../config.js";
import { getExchangeClient } from "../exchange/index.js";
import { generalLogger, apiLogger } from "../log/index.js";
import type { ITradeAssetCycle } from "./assetState/assetState";
import { ISleepStrategy } from "./sleep/BaseSleepStrategy.js";

const client = getExchangeClient(Config.EXCHANGE);

export class PriceBot implements ITradeAssetCycle {
  readonly state = "PriceBot";
  readonly sleep: ISleepStrategy;

  constructor(sleep: ISleepStrategy) {
    this.sleep = sleep;
  }

  dehydrate = () => {};

  execute = async () => {
    try {
      const priceList = await client.getLatestPriceOfAllCoins();
      if (Array.isArray(priceList)) {
        const busdPrices = priceList.filter((p) => p.symbol.endsWith("BUSD"));
        apiLogger.info("PRICE_LIST", { prices: busdPrices });
      } else {
        throw new Error("Unexpected price response");
      }
      await this.sleep.onHoldStableAsset();
      return new PriceBot(this.sleep);
    } catch (err) {
      generalLogger.error("Getting all prices failed", err);
      process.exit(1);
    }
  };

  getCurrentState = () => "PriceBot";
}
