import { startNewPriceTrendDecisionEngine } from "./bot/decisionEngine/index.js";
import { IDecisionEngine } from "./bot/decisionEngine/priceTrendDecision.js";
import { executeTradeCycle } from "./bot/index.js";
import { generalLogger } from "./log/index.js";
import { sleep } from "./utils.js";
import {
  getExchangeClient,
  TStableCoins,
  TVolatileCoins,
} from "./exchange/index.js";
import { Config } from "./config.js";
import { startControlServer } from "./controlServer.js";
import { TSleepStrategyTypes } from "./bot/sleep/BaseSleepStrategy.js";

runCryptoBot({
  volatileAsset: process.env.VOLATILE_COIN?.toUpperCase().trim() as any,
  stableAsset: process.env.STABLE_COIN?.toUpperCase().trim() as any,
  enableResume: true,
  sleepStrategy: Config.SLEEP_STRATEGY,
});

async function runCryptoBot(args: {
  volatileAsset: TVolatileCoins;
  stableAsset: TStableCoins;
  enableResume: boolean;
  sleepStrategy: TSleepStrategyTypes;
}) {
  if (!args.volatileAsset && args.stableAsset) {
    throw new Error("Invalid args " + args);
  }
  startControlServer();
  generalLogger.info(
    `Starting bot version: ${process.env.APP_VERSION} ${args.volatileAsset}${args.stableAsset}`,
    args
  );
  for await (const _ of executeTradeCycle(args)) {
  }
}

async function* simulateBuySellCycle(decision: IDecisionEngine) {
  const binanceClient = getExchangeClient(Config.EXCHANGE);

  let bought = false;
  let nextDecision: IDecisionEngine = decision;

  while (true) {
    const price = await binanceClient.getLatestPrice("BNB", "BUSD");

    if (bought) {
      const next = nextDecision.shouldSell(price);
      nextDecision = next.nextDecision;
      bought = !next.sell;
    } else {
      const next = nextDecision.shouldBuy(price);
      nextDecision = next.nextDecision;
      bought = next.buy;
    }

    await sleep();
    yield nextDecision;
  }
}

async function runPriceTrendDryRun() {
  const binanceClient = getExchangeClient(Config.EXCHANGE);

  const price = await binanceClient.getLatestPrice("BNB", "BUSD");
  const decision: IDecisionEngine = startNewPriceTrendDecisionEngine(price);
  for await (const nextDecision of simulateBuySellCycle(decision)) {
  }
}
