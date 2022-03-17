import { generalLogger } from "../log/index.js";
import { TVolatileCoins, TStableCoins } from "../exchange/index.js";
import { hydrate, initialiseAssetState } from "./assetState/index.js";
import { Config } from "../config.js";
import { registerWithBotManager, SERVER_CONTROL } from "../controlServer.js";
import { getSleepStrategy, TSleepStrategyTypes } from "./sleep/index.js";
import { PriceTrendDecisionConfig } from "./decisionEngine/priceTrendDecision.js";
import { PriceBot } from "./PriceBot.js";

export async function* executeTradeCycle({
  enableResume,
  ...args
}: {
  volatileAsset: TVolatileCoins;
  stableAsset: TStableCoins;
  sleepStrategy: TSleepStrategyTypes;
  enableResume: boolean;
  decisionConfig: PriceTrendDecisionConfig;
  enableControlServer: boolean;
}) {
  const symbol = `${args.volatileAsset}${args.stableAsset}`;
  let nextAssetState;

  if (symbol === "PRICEBOT") {
    nextAssetState = new PriceBot(getSleepStrategy(args.sleepStrategy));
  } else if (enableResume) {
    try {
      nextAssetState = hydrate(
        Config.APPSTATE_FILENAME,
        args.sleepStrategy,
        args.decisionConfig
      );
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
    const stateToSend = JSON.parse(JSON.stringify(nextAssetState));

    if (SERVER_CONTROL.shutdown) {
      generalLogger.info("Gracefully shut down as requested");
      console.log("Graceful shutdown initiated");
      await registerWithBotManager({
        status: "OFFLINE",
        lastState: stateToSend,
      }).catch((e) =>
        generalLogger.error("Failed sending offline notification to manager", e)
      );
      process.exit(0);
    }

    if (args.enableControlServer) {
      registerWithBotManager({
        lastState: stateToSend,
      });
    }

    nextAssetState = await nextAssetState.execute();
    yield nextAssetState;
  }
}
