import Big from "big.js";
import fs from "fs";
import { AxiosError } from "axios";
import { apiLogger, logTrade, stateLogger } from "../../log/index.js";
import {
  getExchangeClient,
  TCoinPair,
  TStableCoins,
  TSupportedCoins,
  TVolatileCoins,
} from "../../exchange/index.js";
import { IDecisionEngine } from "../decisionEngine/priceTrendDecision.js";
import { Config } from "../../config.js";
import { ISleepStrategy } from "../sleep/index.js";
import { TLogTradeData } from "../../log/trade.js";

const binanceClient = getExchangeClient(Config.EXCHANGE);

export interface ITradeAssetCycle {
  execute: () => Promise<ITradeAssetCycle>;
  dehydrate: () => void;
  getCurrentState: () => string;
}

export type TAssetStates =
  | "HoldVolatileAsset"
  | "HoldStableAsset"
  | "VolatileAssetOrderPlaced"
  | "StableAssetOrderPlaced"
  | "PostSellStasis";

interface IAssetStateArguments<VolatileAsset, StableAsset> {
  volatileAsset: VolatileAsset;
  stableAsset: StableAsset;
  state: TAssetStates;
  isStableAssetClass: boolean;
  decisionEngine: IDecisionEngine;
  sleep: ISleepStrategy;
  stats: Readonly<Record<"usdProfitToDate", string>>;
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
  readonly sleep: ISleepStrategy;
  readonly stats: { usdProfitToDate: string };

  constructor({
    volatileAsset,
    stableAsset,
    state,
    isStableAssetClass,
    decisionEngine,
    sleep,
    stats,
  }: IAssetStateArguments<VolatileAsset, StableAsset>) {
    this.symbol = `${volatileAsset}${stableAsset}`;
    this.state = state;
    this.stableAsset = stableAsset;
    this.volatileAsset = volatileAsset;
    this.isStableAssetClass = isStableAssetClass;
    this.decisionEngine = decisionEngine;
    this.sleep = sleep;
    this.stats = stats;

    stateLogger.info(`CREATE new ${this.state}:${this.symbol}`, this);
  }

  dehydrate = () => {
    fs.writeFileSync(
      Config.APPSTATE_FILENAME,
      JSON.stringify({ ...this, version: Config.APP_VERSION }, undefined, 2)
    );
  };

  getCurrentState = () => this.state;

  isOrderFilled = async (clientOrderId: string) => {
    const response = await binanceClient.checkOrderStatus(
      clientOrderId,
      this.symbol
    );
    stateLogger.debug(`Is order ${clientOrderId} filled for ${this.symbol}?`, {
      clientOrderId,
      response,
      state: this,
    });

    return response;
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
    if (Config.TERMINATE_ON_ERROR) {
      apiLogger.error(
        "Encountered error, terminating process as flag is enabled",
        error
      );
      throw error;
    }

    stateLogger.error("API ERROR - not changing state for " + this.symbol, {
      error: error.message,
      config: error.config,
    });

    if (error.request?.status === 429) {
      stateLogger.error(
        "Making too many requests, going to sleep for 15 minutes"
      );
      await this.sleep.onTooManyRequestsError();
    }

    if (error.message?.toLowerCase().includes("insufficient balance")) {
      stateLogger.log("Error: Insufficient balance for " + this.symbol, {
        error,
        state: this,
      });
      await this.sleep.onInsuffientBalanceError();
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

    await this.sleep.onUnknownApiError();
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

    return price;
  };

  execute: () => Promise<ITradeAssetCycle> = () => Promise.resolve(this);
}

export class PostSellStasis<
  VolatileAsset extends TVolatileCoins,
  StableAsset extends TStableCoins
> extends AssetState<VolatileAsset, StableAsset> {
  public readonly iteration: number;
  constructor(
    args: TAssetStateChildArguments<VolatileAsset, StableAsset>,
    iteration: number = 0
  ) {
    super({ ...args, isStableAssetClass: true, state: "PostSellStasis" });
    this.iteration = iteration;
  }

  execute: () => Promise<ITradeAssetCycle> = async () => {
    stateLogger.info("PostSellStasis iter: " + this.iteration, { state: this });
    if (this.iteration < 4) {
      await this.sleep.waitAnHour();
      return new PostSellStasis({ ...this }, this.iteration + 1);
    } else {
      return Promise.resolve(new HoldStableAsset({ ...this }));
    }
  };
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
      price: new Big(sellPrice).mul(new Big("0.998")).toString(),
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
          {
            ...this,
            decisionEngine: nextDecision,
          },
          clientOrderId,
          this.decisionEngine.lastPurchasePrice
        );

        stateLogger.info("SOLD VOLATILE ASSET " + this.symbol, {
          state: this,
          nextState,
          price: orderPrice,
          quantity: qtySold,
          clientOrderId,
        });

        await this.sleep.onPlacedVolatileAssetSellOrder();
        return nextState;
      } else {
        stateLogger.info(
          "HOLD VOLATILE ASSET - No state change " + this.symbol,
          {
            state: this,
            latestPrice,
          }
        );

        await this.sleep.onHoldVolatileAsset();
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
    const price = new Big(buyPrice).mul("1.0025").toString();
    const quantity = new Big(qtyStable).div(buyPrice).toFixed(8);

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
          clientOrderId,
          this.decisionEngine.lastPurchasePrice
        );

        stateLogger.info("BOUGHT VOLATILE ASSET " + this.symbol, {
          state: this,
          nextState,
          orderPrice,
          clientOrderId,
          qtyBought,
        });

        await this.sleep.onPlacedVolatileAssetBuyOrder();

        return nextState;
      } else {
        stateLogger.info("HOLD STABLE ASSET - No state change " + this.symbol, {
          state: this,
          latestPrice,
        });

        await this.sleep.onHoldStableAsset();
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
  readonly lastPurchasePrice: string;

  constructor(
    args: IAssetStateArguments<VolatileAsset, StableAsset>,
    clientOrderId: string,
    lastPurchasePrice: string
  ) {
    super(args);
    this.clientOrderId = clientOrderId;
    this.lastPurchasePrice = lastPurchasePrice;
  }

  abstract getNextStateOnOrderFilled: (
    args: Record<"profit" | "price", string>
  ) => AssetState<VolatileAsset, StableAsset>;

  abstract getTradeLogArgs: (
    args: Record<"orderPrice" | "amount", string>
  ) => TLogTradeData;

  execute: () => Promise<ITradeAssetCycle> = async () => {
    try {
      const orderStatus = await this.isOrderFilled(this.clientOrderId);

      if (orderStatus.status === "FILLED") {
        const profit = await logTrade(
          this.getTradeLogArgs({
            orderPrice: orderStatus.price,
            amount: orderStatus.executedQty,
          }),
          binanceClient
        );

        const nextState = this.getNextStateOnOrderFilled({
          profit,
          price: orderStatus.price,
        });

        stateLogger.info("ORDER FILLED " + this.symbol, {
          currentState: this,
          nextState,
        });

        await this.sleep.onAssetOrderFilled();
        return nextState;
      } else {
        stateLogger.info("ORDER NOT FILLED - No state change " + this.symbol, {
          currentState: this,
        });
        await this.sleep.onAssetOrderNotFilled();
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
    clientOrderId: string,
    lastPurchasePrice: string
  ) {
    super(
      {
        ...args,
        isStableAssetClass: false,
        state: "VolatileAssetOrderPlaced",
      },
      clientOrderId,
      lastPurchasePrice
    );
  }

  getTradeLogArgs = ({
    orderPrice,
    amount,
  }: Record<"orderPrice" | "amount", string>): TLogTradeData => ({
    lastPurchasePrice: "N/A",
    price: orderPrice,
    amount: amount,
    from: this.stableAsset,
    to: this.volatileAsset,
    action: "BUY",
  });

  getNextStateOnOrderFilled = ({ price }: Record<"price", string>) => {
    const nextDecision = this.decisionEngine.setLastPurchasePrice(price);
    return new HoldVolatileAsset({ ...this, decisionEngine: nextDecision });
  };
}

export class StableAssetOrderPlaced<
  VolatileAsset extends TVolatileCoins,
  StableAsset extends TStableCoins
> extends AssetOrderPlaced<VolatileAsset, StableAsset> {
  constructor(
    args: TAssetStateChildArguments<VolatileAsset, StableAsset>,
    clientOrderId: string,
    lastPurchasePrice: string
  ) {
    super(
      {
        ...args,
        isStableAssetClass: true,
        state: "StableAssetOrderPlaced",
      },
      clientOrderId,
      lastPurchasePrice
    );
  }

  getTradeLogArgs = ({
    orderPrice,
    amount,
  }: Record<"orderPrice" | "amount", string>): TLogTradeData => ({
    lastPurchasePrice: this.lastPurchasePrice,
    price: orderPrice,
    amount: amount,
    from: this.volatileAsset,
    to: this.stableAsset,
    action: "SELL",
  });

  getNextStateOnOrderFilled = ({ profit }: Record<"profit", string>) =>
    new PostSellStasis({
      ...this,
      stats: {
        usdProfitToDate: new Big(this.stats.usdProfitToDate).add(profit),
      },
    });
}
