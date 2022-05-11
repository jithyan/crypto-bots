import Big from "big.js";
import { TSupportedCoins } from ".";
import { Config } from "../config";
import { apiLogger } from "../log";
import { TOrderCreateResponse } from "../types/binanceApi.alias";
import { BinanceApi } from "./binance";

export class Simulation extends BinanceApi {
  balance = async (coin: TSupportedCoins): Promise<string> => {
    const price = await this.getLatestPrice(coin, "BUSD");
    const bal = new Big(Config.MAX_BUY_AMOUNT)
      .div(price)
      .round(8, Big.roundDown);

    const filterRules = await this.getExchangeConfig(
      coin.replace(/BUSD/i, "") as TSupportedCoins,
      "BUSD"
    );
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
        clientOrderId: Math.trunc(Math.random() * 10000).toString(),
        orderId: 123,
        orderListId: 9302,
        origQty: correctedQty,
        transactTime: 12,
        price: correctedPrice,
      };
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
        clientOrderId: Math.trunc(Math.random() * 10_000).toString(),
        orderId: 123,
        orderListId: 9302,
        origQty: correctedQty,
        transactTime: 12,
        price: correctedPrice,
      };
      apiLogger.info("SELL success", { data });

      return { ...data, qtySold: correctedQty, orderPrice: correctedPrice };
    } catch (err) {
      apiLogger.error("SELL failed", err);
      throw err;
    }
  };
}
