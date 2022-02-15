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

  constructor({
    volatileAsset,
    stableAsset,
    state,
  }: {
    volatileAsset: VolatileAsset;
    stableAsset: StableAsset;
    state: TAssetStates;
  }) {
    this.symbol = `${volatileAsset}${stableAsset}`;
    this.state = state;
    this.stableAsset = stableAsset;
    this.volatileAsset = volatileAsset;

    stateLogger.info("CREATE new " + this.state, this);
  }

  getBalance = async (): Promise<Big> => {
    const isStableAssetClass =
      this.state === "HoldStableAsset" ||
      this.state === "StableAssetOrderPlaced";

    const balance = await binanceWallet.balance(
      isStableAssetClass ? this.stableAsset : this.volatileAsset
    );

    return new Big(balance);
  };

  getPrice = (): Promise<Big> =>
    binanceWallet
      .getLatestPrice(this.volatileAsset, this.stableAsset)
      .then((price) => new Big(price));

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
