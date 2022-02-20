import { generalLogger } from "../log/index.js";
import { TVolatileCoins, TStableCoins } from "../exchange/index.js";
import { hydrate, initialiseAssetState } from "./assetState/index.js";
import { Config } from "../config.js";
import { SERVER_CONTROL } from "../controlServer.js";

const version = process.env.APP_VERSION;

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
