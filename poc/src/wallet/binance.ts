import type { IBinanceAccountInfo } from "../types/binanceApi.alias";
import { IWallet, AddressBook, TSupportedCoins } from "./index.js";
//@ts-ignore
import { Spot } from "@binance/connector";
import { logger } from "../log/index.js";
import { AxiosError, AxiosResponse } from "axios";

export class BinanceWallet implements IWallet {
  private client: BinanceConnectorClient;

  constructor() {
    this.client = new Spot(
      process.env.BINANCE_KEY?.trim(),
      process.env.BINANCE_SECRET?.trim()
    );
  }

  balance = async (coin: TSupportedCoins): Promise<string> => {
    const res = await this.client.account();
    const balance = res.data.balances.find((bal) => bal.asset === coin);
    logger.info("Binance balance", { balance });
    return balance?.free ?? "0";
  };

  buy = async () => {};

  withdraw = async (
    coin: TSupportedCoins,
    address: AddressBook,
    amount: string,
    opts: Partial<{ memo: string; network: string }> = { network: "BSC" }
  ): Promise<boolean> => {
    try {
      logger.info("Withdrawing from Binance", {
        coin,
        address,
        amount,
        network: opts.network,
      });
      const response = await this.client.withdraw(coin, address, amount, opts);
      logger.info("Binance withdraw success", response.data);
      return true;
    } catch (e: any) {
      const error = e as AxiosError;
      logger.error("Error withdrawing from Binance", { error });
      return false;
    }
  };
}

interface BinanceWithdrawOptions {
  /**
   *  Secondary address identifier for coins like XRP,XMR etc.
   */
  addressTag: string;
  /**
   *  When making internal transfer, true for returning the fee to the destination account;
   * <br>false for returning the fee back to the departure account. Default false.
   */
  transactionFeeFlag: boolean;
  /**
   * Description of the address. Space in name should be encoded into %20.
   */
  name: string;
  network: string;
  /**
   * The wallet type for withdraw，0-spot wallet, 1-funding wallet. Default is spot wallet
   */
  walletType: "0" | "1";
  /**
   * The value cannot be greater than 60000
   */
  recvWindow: number;
}

interface BinanceConnectorClient {
  account: () => Promise<AxiosResponse<IBinanceAccountInfo>>;
  withdraw: (
    coin: string,
    address: string,
    amount: string,
    opts?: Partial<BinanceWithdrawOptions>
  ) => Promise<AxiosResponse<{ id: string }>>;
}
