import { generalLogger, priceLogger } from "../log/index.js";
import cron from "node-cron";
import {
  TVolatileCoins,
  TStableCoins,
  getExchangeClient,
} from "../exchange/index.js";
import { hydrate, initialiseAssetState } from "./assetState/index.js";
import { Config } from "../config.js";
import { SERVER_CONTROL } from "../controlServer.js";

export async function* executeTradeCycle({
  enableResume,
  ...args
}: {
  volatileAsset: TVolatileCoins;
  stableAsset: TStableCoins;
  enableResume: boolean;
}) {
  const symbol = `${args.volatileAsset}${args.stableAsset}`;
  let nextAssetState;

  if (enableResume) {
    try {
      nextAssetState = hydrate(Config.APPSTATE_FILENAME);
      generalLogger.info(`Successfully hydrated: ${symbol}`, {
        state: nextAssetState,
      });
    } catch (err: any) {
      if (err?.message?.includes("no such file or directory")) {
        generalLogger.warn(
          "No state file found, not resuming from prior session",
          { symbol, err }
        );
      } else {
        generalLogger.error("Unable to resume: " + symbol, err);
      }
      nextAssetState = await initialiseAssetState(args);
    }
  } else {
    generalLogger.info(
      `Resuming is not enabled, using initialisation logic: ${symbol}`
    );
    nextAssetState = await initialiseAssetState(args);
  }

  console.log("Successfully started");

  if (Config.COLLECT_PRICE_STATS) {
    cron.schedule("0 8 * * *", () => recordPriceStatistics(args));
  }

  while (true) {
    if (enableResume) {
      nextAssetState.dehydrate();
    }
    if (SERVER_CONTROL.shutdown) {
      generalLogger.info("Gracefully shut down as requested");
      console.log("Graceful shutdown initiated");
      process.exit(0);
    }
    nextAssetState = await nextAssetState.execute();
    yield nextAssetState;
  }
}

async function recordPriceStatistics({
  volatileAsset,
  stableAsset,
}: {
  volatileAsset: TVolatileCoins;
  stableAsset: TStableCoins;
}): Promise<void> {
  const symbol = `${volatileAsset}${stableAsset}`;
  try {
    const priceChange24HrWindow = await getExchangeClient(
      Config.EXCHANGE
    ).get24hrPriceChangeStats(volatileAsset, stableAsset);

    priceLogger.info(`${symbol}`, { priceChange24HrWindow });
  } catch (err) {
    priceLogger.error(`${symbol} - Detailed price collection failed`, err);
  }
}
