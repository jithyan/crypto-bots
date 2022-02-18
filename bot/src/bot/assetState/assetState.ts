import Big from "big.js";
import { apiLogger, logTrade, stateLogger } from "../../log/index.js";
import {
  roundTo3Dp,
  roundTo4Dp,
  sleep,
  truncTo3Dp,
  truncTo4Dp,
} from "../../utils.js";
import {
  binanceClient,
  TCoinPair,
  TStableCoins,
  TSupportedCoins,
  TVolatileCoins,
} from "../../exchange/index.js";
import { IDecisionEngine } from "../decisionEngine/priceTrendDecision.js";
import fs from "fs";
import { AxiosError } from "axios";

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

const version = process.env.APP_VERSION;
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
      `./${version}_${this.symbol}_appState.json`,
      JSON.stringify(this, undefined, 2)
    );
  };

  retryOnInvalidLotSizeError = async <R>(
    err: AxiosError,
    decimalPlaces: number,
    retry: (decimalPlaces: number) => Promise<R>
  ) => {
    if (err.response?.data.code === -1013) {
      stateLogger.warn(
        `Retrying with smaller rounding of ${decimalPlaces}: ` + this.symbol,
        {
          state: this,
        }
      );
      return retry(decimalPlaces)
        .catch(() => {
          stateLogger.warn(
            `Retrying with smaller rounding of ${decimalPlaces - 1}: ` +
              this.symbol,
            {
              state: this,
            }
          );
          return retry(decimalPlaces - 1);
        })
        .catch(() => {
          stateLogger.warn(
            `Retrying with smaller rounding of ${decimalPlaces - 2}: ` +
              this.symbol,
            {
              state: this,
            }
          );
          return retry(decimalPlaces - 2);
        })
        .catch(() => {
          stateLogger.warn(
            `Retrying with smaller rounding of ${decimalPlaces - 3}: ` +
              this.symbol,
            {
              state: this,
            }
          );
          return retry(decimalPlaces - 3);
        });
    }
    throw err;
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

    if (error.response?.data.code === -2015) {
      apiLogger.error(
        "FATAL BINANCE REJECTION - Update IP/Key",
        error.response.data
      );
      throw new Error("FATAL BINANCE REJECTION - Update IP/Key");
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

  private genSellOrder = (
    sellPrice: Big | string,
    qtyToSell: Big | string,
    decimalPlaces: number
  ) => {
    const priceDp = decimalPlaces > 0 ? decimalPlaces - 1 : decimalPlaces;
    const sellOrder = {
      sellAsset: this.volatileAsset,
      forAsset: this.stableAsset,
      price: new Big(sellPrice).toFixed(priceDp, Big.roundHalfUp),
      quantity: new Big(qtyToSell).toFixed(decimalPlaces, Big.roundDown),
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

        const { clientOrderId, orderPrice, qtySold } = await binanceClient
          .sell(this.genSellOrder(latestPrice, volatileAssetBalance, 4))
          .catch((err) =>
            this.retryOnInvalidLotSizeError(err, 3, (dp) =>
              binanceClient.sell(
                this.genSellOrder(latestPrice, volatileAssetBalance, dp)
              )
            )
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

  private genBuyOrder = (
    qtyStable: Big | string,
    buyPrice: Big | string,
    decimalPlaces: number
  ): {
    buyAsset: TSupportedCoins;
    withAsset: TSupportedCoins;
    price: string;
    quantity: string;
  } => {
    const priceDp = decimalPlaces > 0 ? decimalPlaces - 1 : decimalPlaces;
    const price = new Big(buyPrice).toFixed(priceDp, Big.roundDown);
    const quantity = new Big(qtyStable)
      .mul("0.99")
      .div(buyPrice)
      .toFixed(
        decimalPlaces,
        decimalPlaces <= 2 ? Big.roundHalfUp : Big.roundDown
      );

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
        const stableAssetBalance = new Big("25");

        const { clientOrderId, qtyBought } = await binanceClient
          .buy(this.genBuyOrder(stableAssetBalance, latestPrice, 4))
          .catch((err) =>
            this.retryOnInvalidLotSizeError(err, 3, (dp: number) =>
              binanceClient.buy(
                this.genBuyOrder(stableAssetBalance, latestPrice, dp)
              )
            )
          );

        const nextState = new VolatileAssetOrderPlaced(
          { ...this, decisionEngine: nextDecision },
          clientOrderId
        );

        stateLogger.info("BOUGHT VOLATILE ASSET " + this.symbol, {
          state: this,
          nextState,
          latestPrice,
          clientOrderId,
          qtyBought,
        });

        await sleep();

        logTrade({
          lastPurchasePrice: "N/A",
          price: latestPrice,
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
        });
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
