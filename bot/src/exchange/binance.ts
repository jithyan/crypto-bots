//@ts-ignore
import { Spot } from "@binance/connector";
import { AxiosError, AxiosResponse } from "axios";
import type {
  IBinanceAccountInfo,
  IBinanceOrderDetails,
  TOrderCreateResponse,
  TTickerPriceResponse,
} from "../types/binanceApi.alias";
import { IWallet, AddressBook, TSupportedCoins, TCoinPair } from "./index.js";
import { apiLogger } from "../log/index.js";

export class BinanceApi implements IWallet {
  private client: BinanceConnectorClient;

  constructor() {
    this.client = new Spot(
      process.env.BINANCE_KEY?.trim(),
      process.env.BINANCE_SECRET?.trim()
    );
  }

  checkOrderStatus = async (
    origClientOrderId: string,
    coinPair: TCoinPair
  ): Promise<IBinanceOrderDetails> => {
    apiLogger.info("Checking order status", {
      origClientOrderId,
      symbol: coinPair,
    });

    try {
      const { data } = await this.client.getOrder(coinPair, {
        origClientOrderId,
      });
      apiLogger.info("Order status", { data });

      return data;
    } catch (err) {
      handleAxiosError("BUY failed", err);
      throw err;
    }
  };

  getLatestPrice = async (
    assetToBuy: TSupportedCoins,
    usingAsset: TSupportedCoins
  ) => {
    const assetPair: TCoinPair = `${assetToBuy}${usingAsset}`;
    const { data } = await this.client.tickerPrice(assetPair);

    apiLogger.info("Latest price", { assetPair, data });

    if (!Array.isArray(data)) {
      return data.price;
    } else {
      throw new Error("Unexpected price response");
    }
  };

  balance = async (coin: TSupportedCoins): Promise<string> => {
    const res = await this.client.account();
    const balance = res.data.balances.find((bal) => bal.asset === coin);
    apiLogger.info("Binance balance", { balance });
    return balance?.free ?? "0";
  };

  buy = async ({
    buyAsset,
    withAsset,
    price,
    quantity,
  }: {
    buyAsset: TSupportedCoins;
    withAsset: TSupportedCoins;
    price: string;
    quantity: string;
  }): Promise<TOrderCreateResponse> => {
    apiLogger.info("Initiating BUY", {
      buyAsset,
      withAsset,
      price,
      quantity,
    });

    try {
      const { data } = await this.client.newOrder(
        `${buyAsset}${withAsset}`,
        "BUY",
        "LIMIT",
        {
          price,
          quantity,
          timeInForce: "GTC",
        }
      );
      apiLogger.info("BUY success", { data });

      return data;
    } catch (err) {
      handleAxiosError("BUY failed", err);
      throw err;
    }
  };

  sell = async ({
    sellAsset,
    forAsset,
    price,
    quantity,
  }: {
    sellAsset: TSupportedCoins;
    forAsset: TSupportedCoins;
    price: string;
    quantity: string;
  }): Promise<TOrderCreateResponse> => {
    apiLogger.info("Initiating SELL", {
      sellAsset,
      forAsset,
      price,
      quantity,
    });

    try {
      const { data } = await this.client.newOrder(
        `${sellAsset}${forAsset}`,
        "SELL",
        "LIMIT",
        {
          price,
          quantity,
          timeInForce: "GTC",
        }
      );
      apiLogger.info("SELL success", { data });

      return data;
    } catch (err) {
      handleAxiosError("SELL failed", err);
      throw err;
    }
  };

  withdraw = async (
    coin: TSupportedCoins,
    address: AddressBook,
    amount: string,
    opts: Partial<{ memo: string; network: string }> = { network: "BSC" }
  ): Promise<boolean> => {
    try {
      apiLogger.info("Withdrawing from Binance", {
        coin,
        address,
        amount,
        network: opts.network,
      });
      const response = await this.client.withdraw(coin, address, amount, opts);
      apiLogger.info("Binance withdraw success", response.data);
      return true;
    } catch (e: any) {
      handleAxiosError("Error withdrawing from Binance", e);
      return false;
    }
  };
}

function handleAxiosError(message: string, e: unknown): void {
  const error = e as AxiosError;

  apiLogger.error(message, {
    request: {
      url: error.config.url,
      data: error.config.data,
      params: error.config.params,
    },
    errorData: error.response?.data,
    status: error.response?.status,
    statusText: error.response?.statusText,
  });
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

  newOrder: (
    assetPair: TCoinPair,
    orderType: TOrderSide,
    type: TOrderType,
    opts: {
      price: string;
      quantity: string;
      timeInForce: TTimeInForce;
    }
  ) => Promise<AxiosResponse<TOrderCreateResponse>>;

  getOrder: (
    symbol: string,
    options: Record<"origClientOrderId", string>
  ) => Promise<AxiosResponse<IBinanceOrderDetails>>;

  tickerPrice: (
    coin: TCoinPair
  ) => Promise<AxiosResponse<TTickerPriceResponse>>;
}

type TOrderType =
  | "LIMIT"
  | "MARKET"
  | "STOP_LOSS"
  | "STOP_LOSS_LIMIT"
  | "TAKE_PROFIT"
  | "TAKE_PROFIT_LIMIT"
  | "LIMIT_MAKER";

/**
 * - Good Till Cancelled: An order will be on the book unless the order is canceled.
 * - Immediate Or Cancel: An order will try to fill the order as much as it can before the order expires.
 * - Fill or Kill: An order will expire if the full order cannot be filled upon execution.
 */
type TTimeInForce = "GTC" | "IOC" | "FOK";

type TOrderSide = "BUY" | "SELL";
