// const client = new Spot(apiKey, apiSecret);

import { AxiosError } from "axios";
import Big from "big.js";
import { logTrade, logger } from "./log/index.js";
import { AddressBook, binanceWallet, coinspotWallet } from "./wallet/index.js";

function isGreaterThanZero(amount: string | number): boolean {
  return new Big(amount).gt(new Big("0"));
}

function roundTo3Dp(price: string | number | Big) {
  return new Big(price).toFixed(3, Big.roundHalfEven);
}

function truncTo3Dp(price: string | number | Big) {
  return new Big(price).toFixed(3, Big.roundDown);
}

trade2();

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
    logger.info("Binance BNB balance", { balance });

    if (isGreaterThanZero(balance)) {
      binanceWallet.withdraw("BNB", AddressBook.MOODY_CSPOT_BEP20, balance);
    } else {
      logger.info("Balance not greater than zero", { balance });
    }
  });
}
