import { BinanceApi } from "./binance.js";

export enum AddressBook {
  AARON_CSPOT_BEP20 = "0x02770a548f1c66c0d6fe4bab5db00183ac18a027",
  MOODY_CSPOT_BEP20 = "0xc81cd087a9754fc1f4fcbf6c3b7ddf8344ae4ce0",
  MOODY_BIN_BEP20 = "0xaebe7f59ed68dff03dd8ba83bf711e86fccd26af",
  MOODY_POLONIEX = "0xa32a2a6fca43ba7ca8a2415aaf5f266fff21c0b4",
}

export type TVolatileCoins =
  | "BNB"
  | "AVAX"
  | "ETH"
  | "MVR"
  | "CVX"
  | "LUNA"
  | "MOVR"
  | "NEAR"
  | "XRP";

export type TStableCoins = "UST" | "USDT" | "BUSD" | "USDC";
export type TSupportedCoins = TStableCoins | TVolatileCoins;
export type TCoinPair = `${TSupportedCoins}${TSupportedCoins}`;
export type TExchange = "binance";

export interface IWallet {
  withdraw: (
    coin: TSupportedCoins,
    address: AddressBook,
    amount: string,
    opts?: Partial<{ memo: string; network: string }>
  ) => Promise<boolean>;

  balance: (coin: TSupportedCoins) => Promise<string>;
}

export function getExchangeClient(exchange: TExchange) {
  if (exchange === "binance") {
    return new BinanceApi();
  } else {
    throw new Error("Invalid exchange:" + exchange);
  }
}
