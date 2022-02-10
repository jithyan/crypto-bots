//@ts-ignore
import { Spot } from "@binance/connector";

const apiKey = process.env.API_KEY?.trim();
const apiSecret = process.env.API_SECRET?.trim();

export enum ADDRESS_BOOK {
  AaronBep20 = "0x02770a548f1c66c0d6fe4bab5db00183ac18a027",
}

// const client = new Spot(apiKey, apiSecret);

// client.account().then((response: any) => {
//   const res = response.data.balances.filter((t: any) => t.asset === "BNB");
//   const available = res[0].free;
//   console.log("Available BNB", available);
//   client
//     .withdraw("BNB", ADDRESSES.aaronBep20, available, { network: "BSC" })
//     .then((resp: any) => {
//       client.logger.log(response.data);
//       console.log("SUCCESS");
//     })
//     .catch((err: any) => {
//       console.error(JSON.stringify(err, undefined, 2));
//     });
// });

export interface IWallet {
  withdraw: (
    coin: "BNB" | "USDT",
    address: ADDRESS_BOOK,
    amount: string,
    opts?: Partial<{ memo: string; network: string }>
  ) => Promise<boolean>;
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

export class Binance implements IWallet {
  client: BinanceConnectorClient;

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
