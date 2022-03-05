import { sleep } from "../utils";
import type { ITradeAssetCycle } from "./assetState/assetState";

export class DoNothingBot implements ITradeAssetCycle {
  dehydrate = () => {};
  execute = async () => {
    await sleep(1);
    return this;
  };
}