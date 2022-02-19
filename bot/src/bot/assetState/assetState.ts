import Big from "big.js";
import fs from "fs";
import { AxiosError } from "axios";
import {
  apiLogger,
  logTrade,
  priceLogger,
  stateLogger,
} from "../../log/index.js";
import { sleep } from "../../utils.js";
import {
  getExchangeClient,
  TCoinPair,
  TStableCoins,
  TSupportedCoins,
  TVolatileCoins,
} from "../../exchange/index.js";
import { IDecisionEngine } from "../decisionEngine/priceTrendDecision.js";
import { Config } from "../../config.js";

const binanceClient = getExchangeClient(Config.EXCHANGE);

export interface ITradeAssetCycle {
  execute: () => Promise<ITradeAssetCycle>;
  dehydrate: () => void;
}

export type TAssetStates =
  | "HoldVolatileAsset"
  | "HoldStableAsset"
  | "VolatileAssetOrderPlaced"
  | "StableAssetOrderPlaced";

interface IAssetStateArguments<VolatileAsset, StableAsset> {
  volatileAsset: VolatileAsset;
  stableAsset: StableAsset;
  state: TAssetStates;
  isStableAssetClass: boolean;
  decisionEngine: IDecisionEngine;
}

type TAssetStateParentOnlyArguments = "state" | "isStableAssetClass";

type TAssetStateChildArguments<VolatileAsset, StableAsset> = Omit<
  IAssetStateArguments<VolatileAsset, StableAsset>,
  TAssetStateParentOnlyArguments
>;

export class AssetState<
  VolatileAsset extends TVolatileCoins,
  StableAsset extends TStableCoins
> implements ITradeAssetCycle
{
  readonly symbol: TCoinPair;
  readonly state: TAssetStates;
  readonly stableAsset: StableAsset;
  readonly volatileAsset: VolatileAsset;
  readonly isStableAssetClass: boolean;
  readonly decisionEngine: IDecisionEngine;

  constructor({
    volatileAsset,
    stableAsset,
    state,
    isStableAssetClass,
    decisionEngine,
  }: IAssetStateArguments<VolatileAsset, StableAsset>) {
    this.symbol = `${volatileAsset}${stableAsset}`;
    this.state = state;
    this.stableAsset = stableAsset;
    this.volatileAsset = volatileAsset;
    this.isStableAssetClass = isStableAssetClass;
    this.decisionEngine = decisionEngine;

    stateLogger.info(`CREATE new ${this.state}:${this.symbol}`, this);
  }

  dehydrate = () => {
    fs.writeFileSync(
      Config.APPSTATE_FILENAME,
      JSON.stringify({ ...this, version: Config.APP_VERSION }, undefined, 2)
    );
  };

  recordPriceStatistics = async (latestPrice: string): Promise<void> => {
    try {
      const priceChange24HrWindow = await binanceClient.get24hrPriceChangeStats(
        this.volatileAsset,
        this.stableAsset
      );
      const klines1Hr = await binanceClient.getKlines(
        this.volatileAsset,
        this.stableAsset,
        "1h"
      );
      const klines4Hr = await binanceClient.getKlines(
        this.volatileAsset,
        this.stableAsset,
        "4h"
      );

      priceLogger.info(`${this.symbol}`, {
        latestPrice,
        klines1Hr,
        klines4Hr,
        priceChange24HrWindow,
      });
    } catch (err) {
      priceLogger.error(
        `${this.symbol} - Detailed price collection failed`,
        err
      );
    }
  };

  isOrderFilled = async (clientOrderId: string): Promise<boolean> => {
    const { status, executedQty } = await binanceClient.checkOrderStatus(
      clientOrderId,
      this.symbol
    );
    const result = status.toUpperCase() === "FILLED";

    stateLogger.debug(`Is order ${clientOrderId} filled for ${this.symbol}?`, {
      clientOrderId,
      status,
      executedQty,
      result,
      state: this,
    });

    return result;
  };

  getBalance = async (): Promise<string> => {
    const asset = this.isStableAssetClass
      ? this.stableAsset
      : this.volatileAsset;
    const balance = await binanceClient.balance(asset);

    stateLogger.debug(`Checking balance of ${asset}`, {
      state: this,
      balance,
    });

    return balance;
  };

  handleError = async (error: AxiosError) => {
    stateLogger.error("API ERROR - not changing state for " + this.symbol, {
      error: error.message,
      config: error.config,
    });

    if (error.request.status === 429) {
      stateLogger.error(
        "Making too many requests, going to sleep for 15 minutes"
      );
      await sleep(15);
    }

    if (error.message?.toLowerCase().includes("insufficient balance")) {
      stateLogger.log("Error: Insufficient balance for " + this.symbol, {
        error,
        state: this,
      });
      await sleep(15);
      return this;
    }

    if (error.response?.data.code === -2015) {
      apiLogger.error(
        "FATAL BINANCE REJECTION - Update IP/Key",
        error.response.data
      );
      throw new Error("FATAL BINANCE REJECTION - Update IP/Key");
    } else if (error.response?.data.code == -2010) {
      apiLogger.error(
        "FATAL BINANCE REJECTION - Crypto pair not supported",
        error.response.data
      );
      throw new Error("FATAL BINANCE REJECTION - Crypto pair not supported");
    }

    await sleep(1);
    return this;
  };

  getPrice = async (): Promise<string> => {
    const price = await binanceClient.getLatestPrice(
      this.volatileAsset,
      this.stableAsset
    );

    stateLogger.debug(`Checking price of ${this.symbol}`, {
      state: this,
      price,
    });

    if (Config.COLLECT_PRICE_STATS) {
      this.recordPriceStatistics(price);
    }

    return price;
  };

  execute: () => Promise<ITradeAssetCycle> = () => Promise.resolve(this);
}

export class HoldVolatileAsset<
  VolatileAsset extends TVolatileCoins,
  StableAsset extends TStableCoins
> extends AssetState<VolatileAsset, StableAsset> {
  constructor(args: TAssetStateChildArguments<VolatileAsset, StableAsset>) {
    super({ ...args, isStableAssetClass: false, state: "HoldVolatileAsset" });
  }

  private genSellOrder = (sellPrice: string, qtyToSell: string) => {
    const sellOrder = {
      sellAsset: this.volatileAsset,
      forAsset: this.stableAsset,
      price: sellPrice,
      quantity: qtyToSell,
    };

    stateLogger.debug("Buy order for " + this.symbol, sellOrder);
    return sellOrder;
  };

  execute: () => Promise<ITradeAssetCycle> = async () => {
    try {
      const latestPrice = await this.getPrice();
      const { sell, nextDecision } =
        this.decisionEngine.shouldSell(latestPrice);

      if (sell) {
        const volatileAssetBalance = await this.getBalance();

        const { clientOrderId, orderPrice, qtySold } = await binanceClient.sell(
          this.genSellOrder(latestPrice, volatileAssetBalance)
        );

        const nextState = new StableAssetOrderPlaced(
          { ...this, decisionEngine: nextDecision },
          clientOrderId
        );

        stateLogger.info("SOLD VOLATILE ASSET " + this.symbol, {
          state: this,
          nextState,
          price: orderPrice,
          quantity: qtySold,
          clientOrderId,
        });

        logTrade({
          lastPurchasePrice: this.decisionEngine.lastPurchasePrice,
          price: orderPrice,
          amount: qtySold,
          from: this.volatileAsset,
          to: this.stableAsset,
          action: "SELL",
        });

        await sleep();
        return nextState;
      } else {
        stateLogger.info(
          "HOLD VOLATILE ASSET - No state change " + this.symbol,
          {
            state: this,
            latestPrice,
          }
        );

        await sleep();
        return new HoldVolatileAsset({ ...this, decisionEngine: nextDecision });
      }
    } catch (err: any) {
      return this.handleError(err);
    }
  };
}

export class HoldStableAsset<
  VolatileAsset extends TVolatileCoins,
  StableAsset extends TStableCoins
> extends AssetState<VolatileAsset, StableAsset> {
  constructor(args: TAssetStateChildArguments<VolatileAsset, StableAsset>) {
    super({ ...args, isStableAssetClass: true, state: "HoldStableAsset" });
  }

  getMaxTradeableBalance = async (): Promise<string> => {
    const bal = await this.getBalance().then((b) => new Big(b));

    if (bal.gte(Config.MAX_BUY_AMOUNT)) {
      return Config.MAX_BUY_AMOUNT.toString();
    } else if (bal.gte("20") && bal.lt(Config.MAX_BUY_AMOUNT)) {
      return bal.toString();
    } else {
      throw new Error("Insufficient balance " + bal.toString());
    }
  };

  private genBuyOrder = (
    qtyStable: Big | string,
    buyPrice: Big | string
  ): {
    buyAsset: TSupportedCoins;
    withAsset: TSupportedCoins;
    price: string;
    quantity: string;
  } => {
    const price = new Big(buyPrice).toString();
    const quantity = new Big(qtyStable).mul("0.99").div(buyPrice).toString();

    const buyOrder = {
      buyAsset: this.volatileAsset,
      withAsset: this.stableAsset,
      price,
      quantity,
    };

    stateLogger.debug("Buy order for " + this.symbol, buyOrder);
    return buyOrder;
  };

  execute: () => Promise<ITradeAssetCycle> = async () => {
    try {
      const latestPrice = await this.getPrice();
      const { buy, nextDecision } = this.decisionEngine.shouldBuy(latestPrice);

      if (buy) {
        const stableAssetBalance = await this.getMaxTradeableBalance();

        const { clientOrderId, qtyBought, orderPrice } =
          await binanceClient.buy(
            this.genBuyOrder(stableAssetBalance, latestPrice)
          );

        const nextState = new VolatileAssetOrderPlaced(
          { ...this, decisionEngine: nextDecision },
          clientOrderId
        );

        stateLogger.info("BOUGHT VOLATILE ASSET " + this.symbol, {
          state: this,
          nextState,
          orderPrice,
          clientOrderId,
          qtyBought,
        });

        await sleep();

        logTrade({
          lastPurchasePrice: "N/A",
          price: orderPrice,
          amount: qtyBought,
          from: this.stableAsset,
          to: this.volatileAsset,
          action: "BUY",
        });

        return nextState;
      } else {
        stateLogger.info("HOLD STABLE ASSET - No state change " + this.symbol, {
          state: this,
          latestPrice,
        });

        await sleep();
        return new HoldStableAsset({ ...this, decisionEngine: nextDecision });
      }
    } catch (err: any) {
      return this.handleError(err);
    }
  };
}

abstract class AssetOrderPlaced<
  VolatileAsset extends TVolatileCoins,
  StableAsset extends TStableCoins
> extends AssetState<VolatileAsset, StableAsset> {
  readonly clientOrderId: string;

  constructor(
    args: IAssetStateArguments<VolatileAsset, StableAsset>,
    clientOrderId: string
  ) {
    super(args);
    this.clientOrderId = clientOrderId;
  }

  execute: () => Promise<ITradeAssetCycle> = async () => {
    try {
      const orderFilled = await this.isOrderFilled(this.clientOrderId);

      if (orderFilled) {
        const nextState = this.isStableAssetClass
          ? new HoldStableAsset(this)
          : new HoldVolatileAsset(this);

        stateLogger.info("ORDER FILLED " + this.symbol, {
          currentState: this,
          nextState,
        });
        return nextState;
      } else {
        stateLogger.info("ORDER NOT FILLED - No state change " + this.symbol, {
          currentState: this,
          sleepFor: "5 minutes",
        });
        await sleep(5);
        return this;
      }
    } catch (err: any) {
      return this.handleError(err);
    }
  };
}

export class VolatileAssetOrderPlaced<
  VolatileAsset extends TVolatileCoins,
  StableAsset extends TStableCoins
> extends AssetOrderPlaced<VolatileAsset, StableAsset> {
  constructor(
    args: TAssetStateChildArguments<VolatileAsset, StableAsset>,
    clientOrderId: string
  ) {
    super(
      {
        ...args,
        isStableAssetClass: false,
        state: "VolatileAssetOrderPlaced",
      },
      clientOrderId
    );
  }
}

export class StableAssetOrderPlaced<
  VolatileAsset extends TVolatileCoins,
  StableAsset extends TStableCoins
> extends AssetOrderPlaced<VolatileAsset, StableAsset> {
  constructor(
    args: TAssetStateChildArguments<VolatileAsset, StableAsset>,
    clientOrderId: string
  ) {
    super(
      {
        ...args,
        isStableAssetClass: true,
        state: "StableAssetOrderPlaced",
      },
      clientOrderId
    );
  }
}
