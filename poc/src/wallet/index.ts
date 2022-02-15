import { BinanceWallet } from "./binance.js";
import { CoinspotWallet } from "./coinspot.js";

export enum AddressBook {
  AARON_CSPOT_BEP20 = "0x02770a548f1c66c0d6fe4bab5db00183ac18a027",
  MOODY_CSPOT_BEP20 = "0xc81cd087a9754fc1f4fcbf6c3b7ddf8344ae4ce0",
  MOODY_BIN_BEP20 = "0xaebe7f59ed68dff03dd8ba83bf711e86fccd26af",
  MOODY_POLONIEX = "0xa32a2a6fca43ba7ca8a2415aaf5f266fff21c0b4",
}

export type TVolatileCoins = "BNB" | "AVAX" | "ETH";
export type TStableCoins = "TUST" | "USDT" | "BUSD" | "USDC";
export type TSupportedCoins = TStableCoins | TVolatileCoins;
export type TCoinPair = `${TSupportedCoins}${TSupportedCoins}`;

export interface IWallet {
  withdraw: (
    coin: TSupportedCoins,
    address: AddressBook,
    amount: string,
    opts?: Partial<{ memo: string; network: string }>
  ) => Promise<boolean>;

  balance: (coin: TSupportedCoins) => Promise<string>;
}

export const binanceWallet = new BinanceWallet();
export const coinspotWallet = new CoinspotWallet();
