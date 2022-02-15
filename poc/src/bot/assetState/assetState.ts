export interface IHoldAsset {
  sell: () => Promise<void>;
  buy: () => Promise<void>;
  checkPrice: () => Promise<void>;
}

export class AssetState implements IHoldAsset {
  sell = async () => Promise.resolve();
  buy = async () => Promise.resolve();
  checkPrice = async () => Promise.resolve();
}

export class HoldAsset extends AssetState {}

export class HoldStableAsset extends AssetState {}

export class OrderPlaced extends AssetState {}
