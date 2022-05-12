import Big from "big.js";
import NodeCache from "node-cache";
import { TCoinPair, TSupportedCoins } from ".";
import { Config } from "../config";
import { apiLogger } from "../log";
import {
  IBinanceOrderDetails,
  TOrderCreateResponse,
} from "../types/binanceApi.alias";
import { BinanceApi, INodeCached } from "./binance";

export class Simulation extends BinanceApi {
  private readonly orderCache: INodeCached<
    string,
    Record<"price" | "qty", string>
  > = new NodeCache({
    stdTTL: 60 * 60 * 1,
    useClones: false,
    checkperiod: 60 * 60 * 0.5 + 2,
    deleteOnExpire: true,
  });

  balance = async (coin: TSupportedCoins): Promise<string> => {
    const volatileCoin = Config.SYMBOL.replace(/BUSD/i, "") as TSupportedCoins;
    const price = await this.getLatestPrice(volatileCoin, "BUSD");
    const bal = new Big(Config.MAX_BUY_AMOUNT)
      .div(price)
      .round(8, Big.roundDown);

    const filterRules = await this.getExchangeConfig(volatileCoin, "BUSD");
    const correctedQty = this.getValidQtyPrecision(
      new Big(bal.toString()),
      filterRules
    );

    return correctedQty;
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
      const data: TOrderCreateResponse = {
        symbol: `${buyAsset}${withAsset}`,
        clientOrderId: Math.trunc(Math.random() * 1000_000_000).toString(),
        orderId: 123,
        orderListId: 9302,
        origQty: correctedQty,
        transactTime: 12,
        price: correctedPrice,
      };
      this.orderCache.set(data.clientOrderId, {
        qty: correctedQty,
        price: correctedPrice,
      });

      return { ...data, qtyBought: correctedQty, orderPrice: correctedPrice };
    } catch (err) {
      apiLogger.error("BUY failed", err);
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
      const data: TOrderCreateResponse = {
        symbol: `${sellAsset}${forAsset}`,
        clientOrderId: Math.trunc(Math.random() * 1000_000_000).toString(),
        orderId: 123,
        orderListId: 9302,
        origQty: correctedQty,
        transactTime: 12,
        price: correctedPrice,
      };
      this.orderCache.set(data.clientOrderId, {
        qty: correctedQty,
        price: correctedPrice,
      });
      apiLogger.info("SELL success", { data });

      return { ...data, qtySold: correctedQty, orderPrice: correctedPrice };
    } catch (err) {
      apiLogger.error("SELL failed", err);
      throw err;
    }
  };

  checkOrderStatus = async (
    origClientOrderId: string,
    coinPair: TCoinPair
  ): Promise<IBinanceOrderDetails> => {
    apiLogger.info("Checking order status", {
      origClientOrderId,
      symbol: coinPair,
    });

    const { price, qty } = this.orderCache.get(origClientOrderId) ?? {};

    if (price !== undefined && qty !== undefined) {
      const data: IBinanceOrderDetails = {
        price,
        origQty: qty,
        executedQty: qty,
        symbol: coinPair,
        orderId: Number(origClientOrderId),
        origQuoteOrderQty: qty,
        clientOrderId: origClientOrderId,
        orderListId: Number(origClientOrderId),
        status: "FILLED",
        type: "LIMIT",
        cummulativeQuoteQty: qty,
        timeInForce: "GTC",
        side: "",
        stopPrice: "",
        icebergQty: qty,
        time: 10,
        updateTime: 20,
        isWorking: false,
      };

      apiLogger.info("Order status", { data });
      return Promise.resolve(data);
    }

    apiLogger.error("Order status failed - no data for orderId", {
      origClientOrderId,
    });
    throw new Error("Order status failed - no data for orderId");
  };
}
