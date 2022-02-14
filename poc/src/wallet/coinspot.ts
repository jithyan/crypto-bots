import { AddressBook, IWallet, TSupportedCoins } from "./index.js";
import { apiLogger } from "../log/api.js";
import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { logTrade } from "../log/index.js";
import qs from "qs";
import Big from "big.js";
export class CoinspotWallet implements IWallet {
  private apiClient = new BaseClient(
    process.env.COINSPOT_KEY?.trim() ?? "",
    process.env.COINSPOT_SECRET?.trim() ?? "",
    "https://www.coinspot.com.au/api/v2"
  );
  private pubApiClient = new BaseClient(
    process.env.COINSPOT_KEY?.trim() ?? "",
    process.env.COINSPOT_SECRET?.trim() ?? "",
    "https://www.coinspot.com.au/pubapi/v2"
  );
  private v1ApiClient = new BaseClient(
    process.env.COINSPOT_KEY?.trim() ?? "",
    process.env.COINSPOT_SECRET?.trim() ?? "",
    "https://www.coinspot.com.au/pubapi"
  );

  private chartClient = new BaseClient(
    process.env.COINSPOT_KEY?.trim() ?? "",
    process.env.COINSPOT_SECRET?.trim() ?? "",
    "https://www.coinspot.com.au/charts"
  );

  statusCheck = () => {
    return this.apiClient.postRequest("status");
  };

  sell = async (
    cointype: TSupportedCoins,
    amount: string,
    rate: string,
    markettype: "AUD" | "USDT"
  ) => {
    try {
      apiLogger.info("Sell order at Coinspot", {
        cointype,
        amount,
        rate,
      });
      const response: IBuySellOrderResponse = await this.apiClient.postRequest(
        "my/sell",
        {
          cointype,
          amount,
          rate,
        }
      );

      apiLogger.info("Sell order at Coinspot success", { response });
      logTrade({
        amount,
        price: rate,
        action: "SELL",
        from: cointype,
        to: "AUD",
      } as any);

      return true;
    } catch (e: unknown) {
      const error = e as AxiosError;
      apiLogger.error("Error selling at Coinspot", {
        error: error.message,
        errorStatus: error.response?.statusText,
        msg: error.response?.data,
      });
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
      apiLogger.info("Buy order at Coinspot", {
        cointype,
        amount,
        rate,
        markettype,
      });
      const response: IBuySellOrderResponse = await this.apiClient.postRequest(
        "my/buy",
        { cointype, amount, rate, markettype }
      );

      apiLogger.info("Buy order at Coinspot success", { response });
      logTrade({
        amount,
        price: rate,
        action: "BUY",
        from: cointype,
        to: "USDC",
      } as any);

      return true;
    } catch (e: any) {
      const error = e as AxiosError;
      apiLogger.error("Error buying at Coinspot", { error });
      return false;
    }
  };

  swap = async (amount: string): Promise<any> => {
    try {
      const response = await this.apiClient.postRequest<ISwapQuote>(
        "quote/swap/now",
        {
          cointypesell: "BNB",
          cointypebuy: "USDC",
          amount,
        }
      );
      apiLogger.info("Quote for BNB to USDC", { response });
      const rate = Number(new Big(response.rate).mul("1.015").toFixed(8));
      const swapRes = await this.apiClient.postRequest<ISwapQuote>(
        "my/swap/now",
        {
          cointypesell: "BNB",
          cointypebuy: "USDC",
          amount,
          rate,
          threshold: 5,
          direction: "DOWN",
        }
      );
      apiLogger.info("Swapped BNB to USDC", { swapRes });
      return response;
    } catch (e) {
      const error = e as AxiosError;
      apiLogger.error("Error swapping at Coinspot", { error });
      return false;
    }
  };

  balance = async (coin: TSupportedCoins): Promise<string> => {
    const response: IBalanceResponse = await this.apiClient.postRequest(
      `ro/my/balance/${coin}`
    );
    apiLogger.info("Coinspot balance", { response, coin });

    const balance = response.balance[coin]?.balance?.toString() ?? "0";
    const rate = response.balance[coin]?.rate?.toString() ?? "0";

    return balance;
  };

  withdraw = async (
    cointype: TSupportedCoins,
    address: AddressBook,
    amount: string,
    { network = "BSC", memo }: Partial<{ memo: string; network: string }> = {}
  ): Promise<boolean> => {
    try {
      apiLogger.info("Withdrawing from Coinspot", {
        cointype,
        address,
        amount,
        network,
      });
      const response: IStandardCoinspotResponse =
        await this.apiClient.postRequest("my/coin/withdraw/send", {
          address,
          cointype,
          amount,
          network,
          paymentid: memo,
        });
      apiLogger.info("Coinspot withdraw success", { response });
      return true;
    } catch (e) {
      const error = e as AxiosError;
      apiLogger.error("Error withdrawing from Coinspot", { error });
      return false;
    }
  };

  queryPriceFor = async (cointype: TSupportedCoins) => {
    try {
      const [bnbChart, usdtChart] = await Promise.all([
        this.chartClient.getRequest<TChartHistoryResponse>(
          "sellhistory_basic?" + qs.stringify({ symbol: "BNB" })
        ),
        this.chartClient.getRequest<TChartHistoryResponse>(
          "history_basic?" + qs.stringify({ symbol: "USDT" })
        ),
      ]);
      const bnbPrice = bnbChart.pop()?.[1].toString() ?? "0";
      const usdtPrice = usdtChart.pop()?.[1].toString() ?? "0";
      apiLogger.info("Price from coinspot", { bnbPrice, usdtPrice });

      return { bnbPrice, usdtPrice };
    } catch (e) {
      const error = e as AxiosError;
      apiLogger.error("Error querying latest price from Coinspot", {
        error: error.message,
        errorStatus: error.response?.statusText,
        msg: error.response?.data,
      });
      return { bnbPrice: "0", usdtPrice: "0" };
    }
  };
}

type TChartHistoryResponse = number[][];

interface IStandardCoinspotResponse {
  status: "ok" | "error";
  message: "ok" | string;
}

interface ISwapQuote extends IStandardCoinspotResponse {
  rate: number;
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
