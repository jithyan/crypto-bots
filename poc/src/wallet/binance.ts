import { IWallet, apiKey, apiSecret, ADDRESS_BOOK } from ".";
//@ts-ignore
import { Spot } from "@binance/connector";

export class BinanceWallet implements IWallet {
  private client: BinanceConnectorClient;

  constructor() {
    this.client = new Spot(apiKey, apiSecret);
  }

  withdraw = async (
    coin: "USDT" | "BNB",
    address: ADDRESS_BOOK,
    amount: string,
    opts: Partial<{ memo: string; network: string }> = { network: "BSC" }
  ): Promise<boolean> => {
    try {
      const response = await this.client.withdraw(coin, address, amount, opts);
      console.log(response.data);
      return true;
    } catch (err: any) {
      console.log(err);
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
  account: () => Promise<{ data: any }>;
  withdraw: (
    coin: string,
    address: string,
    amount: string,
    opts?: Partial<BinanceWithdrawOptions>
  ) => Promise<{ data: any }>;
}
