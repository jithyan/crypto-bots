// const client = new Spot(apiKey, apiSecret);

import Big from "big.js";
import { logTrade, logger } from "./log/index.js";
import { AddressBook, binanceWallet, coinspotWallet } from "./wallet/index.js";

function isGreaterThanZero(amount: string | number): boolean {
  return new Big(amount).gt(new Big("0"));
}

binanceWallet.balance("BNB");

async function swapCoins() {
  const balance = await coinspotWallet.balance("BNB");
  coinspotWallet.swap(balance);
}

async function sellCoin() {
  const balance = await coinspotWallet.balance("BNB");
  const { bnbPrice, usdtPrice } = await coinspotWallet.queryPriceFor("BNB");
  const rate = new Big(bnbPrice).mul(new Big("1.001")).toFixed(2);
  if (isGreaterThanZero(balance)) {
    coinspotWallet.sell("BNB", balance, rate, "AUD");
  } else {
    logger.info("Balance not greater than zero", { balance });
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

async function transferBnbFromCoinspotToBinance() {
  coinspotWallet.balance("BNB").then(async (balance) => {
    if (isGreaterThanZero(balance)) {
      const withdrawRes = await coinspotWallet.withdraw(
        "BNB",
        AddressBook.MOODY_BIN_BEP20,
        balance
      );
      logger.info("Withdraw result", { withdrawRes });
    } else {
      logger.info("Balance not greater than zero", { balance });
    }
  });
}
