import Big from "big.js";
import { logTrade, stateLogger } from "../../log/index.js";
import {
  roundTo3Dp,
  roundTo4Dp,
  sleep,
  truncTo3Dp,
  truncTo4Dp,
} from "../../utils.js";
import {
  binanceWallet,
  TCoinPair,
  TStableCoins,
  TVolatileCoins,
} from "../../wallet/index.js";
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

    stateLogger.info("CREATE new " + this.state, this);
  }

  dehydrate = () => {
    fs.writeFileSync(
      `./${version}_${this.symbol}_appState.json`,
      JSON.stringify(this, undefined, 2)
    );
  };

  isOrderFilled = async (clientOrderId: string): Promise<boolean> => {
    const { status, executedQty } = await binanceWallet.checkOrderStatus(
      clientOrderId,
      this.symbol
    );
    const result = status.toUpperCase() === "FILLED";

    stateLogger.debug(`Is order ${clientOrderId} filled?`, {
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
    const balance = await binanceWallet.balance(asset);

    stateLogger.debug(`Checking balance of ${asset}`, {
      state: this,
      balance,
    });

    return balance;
  };

  handleError = async (error: AxiosError) => {
    stateLogger.error("API ERROR - not changing state", {
      error: error.message,
      config: error.config,
    });
    await sleep(1);
    return this;
  };

  getPrice = async (): Promise<string> => {
    const price = await binanceWallet.getLatestPrice(
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

  execute: () => Promise<ITradeAssetCycle> = async () => {
    try {
      const latestPrice = await this.getPrice();
      const { sell, nextDecision } =
        this.decisionEngine.shouldSell(latestPrice);

      if (sell) {
        const volatileAssetBalance = await this.getBalance().then(
          (bal) => new Big(bal)
        );
        const qtyToSell = truncTo4Dp(volatileAssetBalance);
        const priceToSell = roundTo3Dp(latestPrice);

        const { clientOrderId } = await binanceWallet.sell({
          sellAsset: this.volatileAsset,
          forAsset: this.stableAsset,
          price: priceToSell,
          quantity: qtyToSell,
        });

        const nextState = new StableAssetOrderPlaced(
          { ...this, decisionEngine: nextDecision },
          clientOrderId
        );

        stateLogger.info("SOLD VOLATILE ASSET", {
          state: this,
          nextState,
          price: priceToSell,
          quantity: qtyToSell,
          clientOrderId,
        });

        logTrade({
          lastPurchasePrice: this.decisionEngine.lastPurchasePrice,
          price: priceToSell,
          amount: qtyToSell,
          from: this.volatileAsset,
          to: this.stableAsset,
          action: "SELL",
        });

        await sleep();
        return nextState;
      } else {
        stateLogger.info("HOLD VOLATILE ASSET - No state change", {
          state: this,
          latestPrice,
        });

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

  execute: () => Promise<ITradeAssetCycle> = async () => {
    try {
      const latestPrice = await this.getPrice().then(truncTo3Dp);
      const { buy, nextDecision } = this.decisionEngine.shouldBuy(latestPrice);

      if (buy) {
        const stableAssetBalance = await this.getBalance().then(
          (bal) => new Big(bal)
        );
        const qtyToBuy = truncTo3Dp(
          stableAssetBalance.mul("0.99").div(latestPrice)
        );

        const { clientOrderId } = await binanceWallet.buy({
          buyAsset: this.volatileAsset,
          withAsset: this.stableAsset,
          price: latestPrice,
          quantity: qtyToBuy,
        });

        const nextState = new VolatileAssetOrderPlaced(
          { ...this, decisionEngine: nextDecision },
          clientOrderId
        );

        stateLogger.info("BOUGHT VOLATILE ASSET", {
          state: this,
          nextState,
          latestPrice,
          clientOrderId,
          qtyToBuy,
        });

        await sleep();

        logTrade({
          lastPurchasePrice: "N/A",
          price: latestPrice,
          amount: qtyToBuy,
          from: this.stableAsset,
          to: this.volatileAsset,
          action: "BUY",
        });

        return nextState;
      } else {
        stateLogger.info("HOLD STABLE ASSET - No state change", {
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

        stateLogger.info("ORDER FILLED", { currentState: this, nextState });
        return nextState;
      } else {
        stateLogger.info("ORDER NOT FILLED - No state change", {
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
