import { Config } from "../config.js";
import { getExchangeClient } from "../exchange/index.js";
import { generalLogger, apiLogger } from "../log/index.js";
import type { ITradeAssetCycle } from "./assetState/assetState";
import { ISleepStrategy } from "./sleep/BaseSleepStrategy.js";

const client = getExchangeClient(Config.EXCHANGE);

export class PriceBot implements ITradeAssetCycle {
  readonly state = "PriceBot";
  readonly sleep: ISleepStrategy;
  numberOfTimeouts: number;

  constructor(sleep: ISleepStrategy) {
    this.sleep = sleep;
    this.numberOfTimeouts = 0;
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
    } catch (error: any) {
      if (
        error.message?.includes("ETIMEDOUT") ||
        error.message?.includes("ECONNRESET")
      ) {
        generalLogger.warn("API Timeout", {
          error: error.message,
          times: this.numberOfTimeouts,
        });
        this.numberOfTimeouts++;

        if (this.numberOfTimeouts > 3) {
          apiLogger.error("API Timeout retries exceeded", {
            error: error.message,
            times: this.numberOfTimeouts,
          });
        } else {
          await this.sleep.onApiTimeout();
          return this;
        }
      }

      generalLogger.error("Getting all prices failed", error);
      process.exit(1);
    }
  };

  getCurrentState = () => "PriceBot";
}
