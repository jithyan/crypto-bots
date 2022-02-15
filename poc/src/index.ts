import Big from "big.js";
import { startNewPriceTrendDecisionEngine } from "./bot/decisionEngine/index.js";
import { IDecisionEngine } from "./bot/decisionEngine/priceTrendDecision.js";
import { generalLogger } from "./log/index.js";
import { truncTo3Dp, isGreaterThanZero, sleep } from "./utils.js";
import { AddressBook, binanceWallet } from "./wallet/index.js";

async function* iterate(decision: IDecisionEngine) {
  let bought = false;
  let nextDecision: IDecisionEngine = decision;

  while (true) {
    const price = await binanceWallet.getLatestPrice("AVAX", "BUSD");
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

async function runIteration() {
  const price = await binanceWallet.getLatestPrice("AVAX", "BUSD");
  const decision: IDecisionEngine = startNewPriceTrendDecisionEngine(price);
  for await (const nextDecision of iterate(decision)) {
  }
}

runIteration();

// binanceWallet
//   .balance("BNB")
//   .then(truncTo3Dp)
//   .then(() => binanceWallet.getLatestPrice("BNB", "BUSD"));

async function trade2() {
  const bnbBal = await binanceWallet.balance("BNB").then(truncTo3Dp);

  if (isGreaterThanZero(bnbBal)) {
    const latestBnbPrice = await binanceWallet.getLatestPrice("BNB", "BUSD");
    const askPrice = new Big(
      new Big(latestBnbPrice).mul(new Big("1.005"))
    ).toFixed(1);
    const qty = new Big(bnbBal).mul(new Big(askPrice));
    binanceWallet
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

async function tradeCycle() {
  const usdtBal = await binanceWallet.balance("USDT");

  if (isGreaterThanZero(usdtBal)) {
    const latestBusdPrice = await binanceWallet.getLatestPrice("BUSD", "USDT");
    const qtyToBuy = new Big(usdtBal)
      .div(new Big(latestBusdPrice).mul(new Big("1.01")))
      .toFixed(3);
    binanceWallet
      .buy({
        buyAsset: "BUSD",
        withAsset: "USDT",
        price: latestBusdPrice,
        quantity: "13",
      })
      .then((res) => {
        console.log("Fin", res);
      });
  }
}

async function transferBnbFromBinanceToCoinspot() {
  binanceWallet.balance("BNB").then((balance) => {
    generalLogger.info("Binance BNB balance", { balance });

    if (isGreaterThanZero(balance)) {
      binanceWallet.withdraw("BNB", AddressBook.MOODY_CSPOT_BEP20, balance);
    } else {
      generalLogger.info("Balance not greater than zero", { balance });
    }
  });
}
