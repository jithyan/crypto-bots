export interface IHoldAsset {
  sell: () => void;
  buy: () => void;
  checkPrice: () => void;
}

export class AssetState implements IHoldAsset {
  sell: () => void = () => {};
  buy: () => void = () => {};
  checkPrice: () => void = () => {};
}
