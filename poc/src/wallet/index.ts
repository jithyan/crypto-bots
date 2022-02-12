import { BinanceWallet } from "./binance";
import { CoinspotWallet } from "./coinspot";

export enum AddressBook {
  AARON_CSPOT_BEP20 = "0x02770a548f1c66c0d6fe4bab5db00183ac18a027",
  MOODY_CSPOT_BEP20 = "0xc81cd087a9754fc1f4fcbf6c3b7ddf8344ae4ce0",
  MOODY_BIN_BEP20 = "0xaebe7f59ed68dff03dd8ba83bf711e86fccd26af",
}

export type TSupportedCoins = "BNB" | "USDT";

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
