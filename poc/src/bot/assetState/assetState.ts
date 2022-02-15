import Big from "big.js";
import { stateLogger } from "../../log";
import {
  isBalanceGreaterThanZero,
  roundTo3Dp,
  sleep,
  truncTo3Dp,
} from "../../utils";
import {
  binanceWallet,
  TCoinPair,
  TStableCoins,
  TVolatileCoins,
} from "../../wallet";
import { IDecisionEngine } from "../decisionEngine/priceTrendDecision";

export interface ITradeAssetCycle {
  execute: () => Promise<ITradeAssetCycle>;
}

type TAssetStates =
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

    stateLogger.info("CREATE new " + this.state, this);
  }

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
    const [latestPrice, volatileAssetBalance] = await Promise.all([
      this.getPrice(),
      this.getBalance().then((bal) => new Big(bal)),
    ]);

    const { sell, nextDecision } = this.decisionEngine.shouldSell(latestPrice);

    if (sell) {
      const { clientOrderId } = await binanceWallet.sell({
        sellAsset: this.volatileAsset,
        forAsset: this.stableAsset,
        price: roundTo3Dp(latestPrice),
        quantity: volatileAssetBalance.toFixed(4),
      });

      const nextState = new StableAssetOrderPlaced(
        { ...this, decisionEngine: nextDecision },
        clientOrderId
      );

      stateLogger.info("SOLD VOLATILE ASSET", {
        state: this,
        nextState,
        price: roundTo3Dp(latestPrice),
        quantity: volatileAssetBalance.toFixed(4),
        clientOrderId,
      });

      await sleep();
      return nextState;
    } else {
      stateLogger.info("HOLD VOLATILE ASSET - No state change", {
        state: this,
        latestPrice,
      });

      await sleep();
      return this;
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
    const [latestPrice, stableAssetBalance] = await Promise.all([
      this.getPrice(),
      this.getBalance().then((bal) => new Big(bal)),
    ]);

    const { buy, nextDecision } = this.decisionEngine.shouldBuy(latestPrice);

    if (buy) {
      const { clientOrderId } = await binanceWallet.buy({
        buyAsset: this.volatileAsset,
        withAsset: this.stableAsset,
        price: latestPrice,
        quantity: truncTo3Dp(stableAssetBalance.mul("0.99").div(latestPrice)),
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
      });

      await sleep();
      return nextState;
    } else {
      stateLogger.info("HOLD STABLE ASSET - No state change", {
        state: this,
        latestPrice,
      });

      await sleep();
      return this;
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
    const orderFilled = await this.isOrderFilled(this.clientOrderId);

    await sleep();

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
