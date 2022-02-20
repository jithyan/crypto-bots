//@ts-ignore
import { Spot } from "@binance/connector";
import NodeCache from "node-cache";
import { AxiosError, AxiosResponse } from "axios";
import type {
  IBinance24hrTicker,
  IBinanceAccountInfo,
  IBinanceExchangeInfo,
  IBinanceOrderDetails,
  TOrderCreateResponse,
  TTickerPriceResponse,
} from "../types/binanceApi.alias";
import { IWallet, AddressBook, TSupportedCoins, TCoinPair } from "./index.js";
import { apiLogger } from "../log/index.js";
import Big from "big.js";
import { getMaxNumberOfDecimalPlaces } from "../utils.js";

type TFilterRulesField = "min" | "max" | "stepSize";
type TImportantFilterFields = "priceFilter" | "lotSizeFilter";
type TFilterRulesConfig = Record<
  TImportantFilterFields,
  Record<TFilterRulesField, Big> & { precision: number }
>;
interface INodeCached<K, V> {
  get: (key: K) => V | undefined;
  set: (key: K, value: V, ttl?: number) => boolean;
}

export class BinanceApi implements IWallet {
  private client: BinanceConnectorClient;
  private readonly configCache: INodeCached<TCoinPair, TFilterRulesConfig> =
    new NodeCache({
      stdTTL: 60 * 60 * 24,
      useClones: false,
      checkperiod: 60 * 60 * 24 + 2,
      deleteOnExpire: true,
      maxKeys: 2,
    });

  constructor() {
    const key = process.env.BINANCE_KEY?.trim();
    const secret = process.env.BINANCE_SECRET?.trim();

    if (!key || !secret) {
      apiLogger.error("No binance key or secret provided");
      throw new Error("No binance key or secret provided");
    }
    this.client = new Spot(key, secret);
  }

  getExchangeConfig = async (
    volatileAsset: TSupportedCoins,
    stableAsset: TSupportedCoins
  ) => {
    const symbol: TCoinPair = `${volatileAsset}${stableAsset}`;
    const cacheEntry = this.configCache.get(symbol);

    if (cacheEntry) {
      return Promise.resolve(cacheEntry);
    }

    const { data } = await this.client.exchangeInfo({ symbol });
    const symbolRules = data.symbols.find(
      (symbolInfo) => symbolInfo.symbol === symbol
    )?.filters;

    if (symbolRules === undefined) {
      throw new Error(
        "Unable to find exchangeInfo filters for symbol: " + symbol
      );
    }

    const priceFilter = symbolRules.find(
      (filter) => filter.filterType === "PRICE_FILTER"
    );
    const lotSizeFilter = symbolRules.find(
      (filter) => filter.filterType === "LOT_SIZE"
      // Swagger doesn't match actual response!
    ) as Record<"stepSize" | "minQty" | "maxQty", string> | undefined;

    if (priceFilter === undefined || lotSizeFilter === undefined) {
      throw new Error("Unable to find price or lot size filter for " + symbol);
    }

    const result = {
      priceFilter: {
        stepSize: new Big(priceFilter.tickSize),
        min: new Big(priceFilter.minPrice),
        max: new Big(priceFilter.maxPrice),
        precision: getMaxNumberOfDecimalPlaces(new Big(priceFilter.tickSize)),
      },
      lotSizeFilter: {
        stepSize: new Big(lotSizeFilter.stepSize),
        min: new Big(lotSizeFilter.minQty),
        max: new Big(lotSizeFilter.maxQty),
        precision: getMaxNumberOfDecimalPlaces(new Big(lotSizeFilter.stepSize)),
      },
    };

    this.configCache.set(symbol, result);

    return result;
  };

  getValidPricePrecision = (
    price: Big,
    { priceFilter }: TFilterRulesConfig
  ): string => {
    if (price.lt(priceFilter.min)) {
      throw new Error(
        `Price of ${price} does not meet minimum of ${priceFilter.min}`
      );
    } else if (price.gt(priceFilter.max)) {
      throw new Error(
        `Price of ${price} exceeds maximum of ${priceFilter.max}`
      );
    }

    if (priceFilter.stepSize.eq("0")) {
      return price.toString();
    }

    return price.toFixed(priceFilter.precision, Big.roundDown);
  };

  getValidQtyPrecision = (
    qty: Big,
    { lotSizeFilter }: TFilterRulesConfig
  ): string => {
    if (qty.lt(lotSizeFilter.min)) {
      throw new Error(
        `Quantity of ${qty} does not meet minimum of ${lotSizeFilter.min}`
      );
    } else if (qty.gt(lotSizeFilter.max)) {
      apiLogger.warn(`Quantity of ${qty} exceeds max of ${lotSizeFilter.max}`);
      return lotSizeFilter.max.toString();
    }

    if (lotSizeFilter.stepSize.eq("0")) {
      return qty.toString();
    }

    return qty.toFixed(lotSizeFilter.precision, Big.roundDown);
  };

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

  get24hrPriceChangeStats = async (
    volatileAsset: TSupportedCoins,
    stableAsset: TSupportedCoins
  ) => {
    return this.client
      .ticker24hr(`${volatileAsset}${stableAsset}`)
      .then((resp) => resp.data);
  };

  getKlines = async (
    volatileAsset: TSupportedCoins,
    stableAsset: TSupportedCoins,
    period: TBinanceIntervalValue
  ) => {
    const { data } = await this.client.klines(
      `${volatileAsset}${stableAsset}`,
      period,
      { limit: 240 }
    );
    return data.map((candle) => ({
      "Open time": candle[0],
      Open: candle[1],
      High: candle[2],
      Low: candle[3],
      Close: candle[4],
      Volume: candle[5],
      "Close time": candle[6],
      "Quote asset volume": candle[7],
      "Number of trades": candle[8],
      "Taker buy base asset volume": candle[9],
      "Taker buy quote asset volume": candle[10],
    }));
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
  }): Promise<
    TOrderCreateResponse & { qtyBought: string; orderPrice: string }
  > => {
    const filterRules = await this.getExchangeConfig(buyAsset, withAsset);

    const correctedQty = this.getValidQtyPrecision(
      new Big(quantity),
      filterRules
    );
    const correctedPrice = this.getValidPricePrecision(
      new Big(price),
      filterRules
    );

    apiLogger.info("Initiating BUY", {
      buyAsset,
      withAsset,
      price,
      quantity,
      correctedPrice,
      correctedQty,
    });

    try {
      const { data } = await this.client.newOrder(
        `${buyAsset}${withAsset}`,
        "BUY",
        "LIMIT",
        {
          price: correctedPrice,
          quantity: correctedQty,
          timeInForce: "GTC",
        }
      );
      apiLogger.info("BUY success", { data });

      return { ...data, qtyBought: correctedQty, orderPrice: correctedPrice };
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
  }): Promise<
    TOrderCreateResponse & { qtySold: string; orderPrice: string }
  > => {
    const filterRules = await this.getExchangeConfig(sellAsset, forAsset);

    const correctedQty = this.getValidQtyPrecision(
      new Big(quantity),
      filterRules
    );
    const correctedPrice = this.getValidPricePrecision(
      new Big(price),
      filterRules
    );

    apiLogger.info("Initiating SELL", {
      sellAsset,
      forAsset,
      price,
      quantity,
      correctedQty,
      correctedPrice,
    });

    try {
      const { data } = await this.client.newOrder(
        `${sellAsset}${forAsset}`,
        "SELL",
        "LIMIT",
        {
          price: correctedPrice,
          quantity: correctedQty,
          timeInForce: "GTC",
        }
      );
      apiLogger.info("SELL success", { data });

      return { ...data, qtySold: correctedQty, orderPrice: correctedPrice };
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

export type TBinanceIntervalValue =
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "4h"
  | "6h"
  | "8h"
  | "12h"
  | "1d"
  | "3d"
  | "1w"
  | "1M";

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

  ticker24hr: (coin: TCoinPair) => Promise<AxiosResponse<IBinance24hrTicker>>;

  klines: (
    coin: TCoinPair,
    interval: TBinanceIntervalValue,
    opt: { limit: number }
  ) => Promise<AxiosResponse<(number | string)[][]>>;

  exchangeInfo: (opts: {
    symbol: TCoinPair;
  }) => Promise<AxiosResponse<IBinanceExchangeInfo>>;
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
