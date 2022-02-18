import Big from "big.js";
import { startNewPriceTrendDecisionEngine } from "./bot/decisionEngine/index.js";
import { IDecisionEngine } from "./bot/decisionEngine/priceTrendDecision.js";
import { executeTradeCycle } from "./bot/index.js";
import { generalLogger } from "./log/index.js";
import {
  truncTo4Dp,
  isMinimumTradeableBalance,
  sleep,
  roundTo4Dp,
} from "./utils.js";
import {
  AddressBook,
  binanceClient,
  TStableCoins,
  TVolatileCoins,
} from "./exchange/index.js";

runCryptoBot({
  volatileAsset: process.env.VOLATILE_COIN as any,
  stableAsset: process.env.STABLE_COIN as any,
  enableResume: true,
});

async function runCryptoBot(args: {
  volatileAsset: TVolatileCoins;
  stableAsset: TStableCoins;
  enableResume: boolean;
}) {
  if (!args.volatileAsset && args.stableAsset) {
    throw new Error("Invalid args " + args);
  }
  generalLogger.info(
    `Starting bot version: ${process.env.APP_VERSION} ${args.volatileAsset}${args.stableAsset}`,
    args
  );
  for await (const _ of executeTradeCycle(args)) {
  }
}

async function* simulateBuySellCycle(decision: IDecisionEngine) {
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
  const price = await binanceClient.getLatestPrice("BNB", "BUSD");
  const decision: IDecisionEngine = startNewPriceTrendDecisionEngine(price);
  for await (const nextDecision of simulateBuySellCycle(decision)) {
  }
}

async function trade2() {
  const bnbBal = await binanceClient.balance("BNB").then(truncTo4Dp);

  if (isMinimumTradeableBalance(bnbBal)) {
    const latestBnbPrice = await binanceClient.getLatestPrice("BNB", "BUSD");
    const askPrice = new Big(
      new Big(latestBnbPrice).mul(new Big("1.005"))
    ).toFixed(1);
    const qty = new Big(bnbBal).mul(new Big(askPrice));
    binanceClient
      .sell({
        sellAsset: "BNB",
        forAsset: "BUSD",
        price: new Big(latestBnbPrice).toFixed(1),
        quantity: bnbBal,
      })
      .then((res) => {
        console.log("Fin", res);
      });
  }
}

async function transferBnbFromBinanceToCoinspot() {
  binanceClient.balance("BNB").then((balance) => {
    generalLogger.info("Binance BNB balance", { balance });

    if (isMinimumTradeableBalance(balance)) {
      binanceClient.withdraw("BNB", AddressBook.MOODY_CSPOT_BEP20, balance);
    } else {
      generalLogger.info("Balance not greater than zero", { balance });
    }
  });
}
