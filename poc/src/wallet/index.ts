import { BinanceWallet } from "./binance";

export const apiKey = process.env.API_KEY?.trim();
export const apiSecret = process.env.API_SECRET?.trim();

export enum ADDRESS_BOOK {
  AaronBep20 = "0x02770a548f1c66c0d6fe4bab5db00183ac18a027",
}

export interface IWallet {
  withdraw: (
    coin: "BNB" | "USDT",
    address: ADDRESS_BOOK,
    amount: string,
    opts?: Partial<{ memo: string; network: string }>
  ) => Promise<boolean>;
}

export const binanceWallet = new BinanceWallet();
