import Big from "big.js";
import { startNewPriceTrendDecisionEngine } from "./bot/decisionEngine/index.js";
import { IDecisionEngine } from "./bot/decisionEngine/priceTrendDecision.js";
import { executeTradeCycle } from "./bot/index.js";
import { generalLogger } from "./log/index.js";
import {
  truncTo4Dp,
  isBalanceGreaterThanZero,
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
  volatileAsset: "CVX",
  stableAsset: "BUSD",
  enableResume: true,
});

async function runCryptoBot(args: {
  volatileAsset: TVolatileCoins;
  stableAsset: TStableCoins;
  enableResume: boolean;
}) {
  generalLogger.info("Starting bot version: " + process.env.APP_VERSION, args);
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

  if (isBalanceGreaterThanZero(bnbBal)) {
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

    if (isBalanceGreaterThanZero(balance)) {
      binanceClient.withdraw("BNB", AddressBook.MOODY_CSPOT_BEP20, balance);
    } else {
      generalLogger.info("Balance not greater than zero", { balance });
    }
  });
}
