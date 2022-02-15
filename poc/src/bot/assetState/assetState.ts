import Big from "big.js";
import { stateLogger } from "../../log";
import {
  binanceWallet,
  TCoinPair,
  TStableCoins,
  TVolatileCoins,
} from "../../wallet";

export interface ITradeAssetCycle {
  execute: () => Promise<ITradeAssetCycle>;
}

type TAssetStates =
  | "HoldVolatileAsset"
  | "HoldStableAsset"
  | "VolatileAssetOrderPlaced"
  | "StableAssetOrderPlaced";

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

  constructor({
    volatileAsset,
    stableAsset,
    state,
    isStableAssetClass,
  }: {
    volatileAsset: VolatileAsset;
    stableAsset: StableAsset;
    state: TAssetStates;
    isStableAssetClass: boolean;
  }) {
    this.symbol = `${volatileAsset}${stableAsset}`;
    this.state = state;
    this.stableAsset = stableAsset;
    this.volatileAsset = volatileAsset;
    this.isStableAssetClass = isStableAssetClass;

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

  getBalance = async (): Promise<Big> => {
    const asset = this.isStableAssetClass
      ? this.stableAsset
      : this.volatileAsset;
    const balance = await binanceWallet.balance(asset);

    stateLogger.debug(`Checking balance of ${asset}`, {
      state: this,
      balance,
    });

    return new Big(balance);
  };

  getPrice = async (): Promise<Big> => {
    const price = await binanceWallet.getLatestPrice(
      this.volatileAsset,
      this.stableAsset
    );

    stateLogger.debug(`Checking price of ${this.symbol}`, {
      state: this,
      price,
    });

    return new Big(price);
  };

  execute: () => Promise<ITradeAssetCycle> = () => Promise.resolve(this);
}

export class HoldVolatileAsset<
  VolatileAsset extends TVolatileCoins,
  StableAsset extends TStableCoins
> extends AssetState<VolatileAsset, StableAsset> {}

export class HoldStableAsset<
  VolatileAsset extends TVolatileCoins,
  StableAsset extends TStableCoins
> extends AssetState<VolatileAsset, StableAsset> {}

export class VolatileAssetOrderPlaced<
  VolatileAsset extends TVolatileCoins,
  StableAsset extends TStableCoins
> extends AssetState<VolatileAsset, StableAsset> {}
