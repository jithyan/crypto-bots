// const client = new Spot(apiKey, apiSecret);

import { logTrade, logger } from "./log";
import { AddressBook, binanceWallet, coinspotWallet } from "./wallet";

logTrade({
  action: "buy",
  price: "123",
  value: "321",
  amount: "1",
  timestamp: "123",
});
binanceWallet.balance("BNB").then((balance) => {
  logger.info("Binance BNB balance", { balance });
});

// coinspotWallet.balance("BNB").then(async (res) => {
//   console.log("balance", res);
//   // const withdrawRes = await coinspotWallet.withdraw(
//   //   "BNB",
//   //   ADDRESS_BOOK.MoodyBinanceBep20,
//   //   res.balance.toString()
//   // );
//   // logger.info("Withdraw result", { withdrawRes });
// });
