import { AddressBook, IWallet, TSupportedCoins } from "./index";
import { logger } from "../log/std.js";
import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { logTrade } from "../log";

interface IStandardCoinspotResponse {
  status: "ok" | "error";
  message: "ok" | string;
}

interface IBuySellOrderResponse extends IStandardCoinspotResponse {
  coin: string;
  /**
   * eg. "BTC/AUD"
   */
  market: string;
  amount: number;
  rate: number;
  /**
   * buy or sell order ID
   */
  id: string;
}

interface IBalanceResponse extends IStandardCoinspotResponse {
  balance: Record<
    string,
    { balance: number; audbalance: number; rate: number }
  >;
}

export class CoinspotWallet implements IWallet {
  private client = new BaseClient(
    process.env.COINSPOT_KEY?.trim() ?? "",
    process.env.COINSPOT_SECRET?.trim() ?? "",
    "https://www.coinspot.com.au/api/v2"
  );

  sell = async (
    cointype: TSupportedCoins,
    amount: string,
    rate: string,
    markettype: "AUD" | "USDT"
  ) => {
    try {
      logger.info("Sell order at Coinspot", {
        cointype,
        amount,
        rate,
        markettype,
      });
      const response: IBuySellOrderResponse = await this.client.postRequest(
        "my/sell",
        {
          cointype,
          amount,
          rate,
          markettype,
        }
      );

      logger.info("Buy order at Coinspot success", { response });
      logTrade({
        amount,
        price: rate,
        action: "BUY",
        from: cointype,
        to: "USDT",
      });

      return true;
    } catch (e: unknown) {
      const error = e as AxiosError;
      logger.error("Error buying at Coinspot", { error });
      return false;
    }
  };

  buy = async (
    cointype: TSupportedCoins,
    amount: string,
    rate: string,
    markettype: "USDT" | "AUD"
  ) => {
    try {
      logger.info("Buy order at Coinspot", {
        cointype,
        amount,
        rate,
        markettype,
      });
      const response: IBuySellOrderResponse = await this.client.postRequest(
        "my/buy",
        { cointype, amount, rate, markettype }
      );

      logger.info("Buy order at Coinspot success", { response });
      logTrade({
        amount,
        price: rate,
        action: "BUY",
        from: cointype,
        to: "USDT",
      });

      return true;
    } catch (e: any) {
      const error = e as AxiosError;
      logger.error("Error buying at Coinspot", { error });
      return false;
    }
  };

  balance = async (coin: TSupportedCoins): Promise<string> => {
    const response: IBalanceResponse = await this.client.postRequest(
      `ro/my/balance/${coin}`
    );
    logger.info("Coinspot balance", { response, coin });

    return response.balance[coin].balance?.toString() ?? "";
  };

  withdraw = async (
    cointype: TSupportedCoins,
    address: AddressBook,
    amount: string,
    { network = "BSC", memo }: Partial<{ memo: string; network: string }> = {}
  ): Promise<boolean> => {
    try {
      logger.info("Withdrawing from Coinspot", {
        cointype,
        address,
        amount,
        network,
      });
      const response: IStandardCoinspotResponse = await this.client.postRequest(
        "my/coin/withdraw/send",
        {
          address,
          cointype,
          amount,
          network,
          paymentid: memo,
        }
      );
      logger.info("Coinspot withdraw success", { response });
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  };
}

class BaseClient {
  constructor(
    private apiKey: string,
    private apiSecret: string,
    public apiUrl: string
  ) {}

  calculateSign<T>(data: T) {
    const nonce = new Date().getTime();
    const postdata = { ...data, nonce };

    const stringmessage = JSON.stringify(postdata);
    const signedMessage = crypto.createHmac("sha512", this.apiSecret);

    signedMessage.update(Buffer.from(stringmessage));

    const sign = signedMessage.digest("hex");
    return {
      sign,
      postdata: stringmessage,
    };
  }

  async postRequest<T>(
    url: string,
    data: { [key: string]: any } = {}
  ): Promise<T> {
    const { sign, postdata } = this.calculateSign(data);
    const headers = {
      key: this.apiKey,
      sign,
      "Content-Type": "application/json",
    };
    const apiUrl = `${this.apiUrl}/${url}`;
    try {
      const res = await axios.post<T>(apiUrl, postdata, {
        headers,
      });
      return res.data;
    } catch (err: any) {
      if (err.isAxiosError && err.response.data.message === "invalid nonce") {
        return await this.postRequest<T>(url, data);
      }

      console.log(err);
      throw err;
    }
  }

  async getRequest<T>(apiPath: string) {
    const res = await axios.get<T>(`${this.apiUrl}/${apiPath}`);
    return res.data;
  }
}
