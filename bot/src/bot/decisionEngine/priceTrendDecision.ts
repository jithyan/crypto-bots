import Big from "big.js";
import { Config } from "../../config.js";
import { stateLogger } from "../../log/index.js";
import { roundTo4Dp } from "../../utils.js";

export interface IDecisionEngine {
  shouldBuy: (currentPrice: string) => {
    nextDecision: IDecisionEngine;
    buy: boolean;
  };

  shouldSell: (currentPrice: string) => {
    nextDecision: IDecisionEngine;
    sell: boolean;
  };

  lastPurchasePrice: string;
}

export type DecisionStates =
  | "Start"
  | "UpwardPriceTrend"
  | "DownwardPriceTrend"
  | "UpwardPriceTrendConfirmed";

const DecisionConfig = {
  MAX_PERCENT_INCREASE_FOR_BUY: new Big("1.02"),
  MIN_PERCENT_INCREASE_FOR_SELL: new Big("1.015"),
  PRICE_HAS_INCREASED_THRESHOLD: new Big("1.0015"),
  PRICE_HAS_DECREASED_THRESHOLD: new Big("1").minus(new Big("0.00175")),
};

type TDecisionEngineData = Record<
  "lastPurchasePrice" | "lastTickerPrice",
  string
>;

abstract class DecisionEngine implements IDecisionEngine {
  readonly lastTickerPrice: string;
  readonly lastPurchasePrice: string;
  readonly state: DecisionStates;

  constructor(state: DecisionStates, data: TDecisionEngineData) {
    this.lastTickerPrice = data.lastTickerPrice;
    this.lastPurchasePrice = data.lastPurchasePrice;
    this.state = state;
    stateLogger.info("CREATE new " + this.state, this);
  }

  calcPctChangeInPriceSinceLastCheck = (currentPrice: Big) =>
    currentPrice.div(this.lastTickerPrice).minus("1");

  isAnIncrease = (currentPrice: Big): boolean => {
    const ratio = new Big(currentPrice.div(this.lastTickerPrice).toFixed(4));
    const isAnIncrease = ratio.gt(DecisionConfig.PRICE_HAS_INCREASED_THRESHOLD);

    const percentChange = roundTo4Dp(
      this.calcPctChangeInPriceSinceLastCheck(currentPrice).mul("100")
    );

    stateLogger.debug("Is an increase?", {
      ratio,
      currentPrice,
      state: this,
      isAnIncrease,
      percentChange,
    });

    return isAnIncrease;
  };

  isADecrease = (currentPrice: Big): boolean => {
    const ratio = new Big(currentPrice.div(this.lastTickerPrice).toFixed(4));
    const isADecrease = ratio.lt(DecisionConfig.PRICE_HAS_DECREASED_THRESHOLD);

    const percentChange = roundTo4Dp(
      this.calcPctChangeInPriceSinceLastCheck(currentPrice).mul("100")
    );

    stateLogger.debug("Is a decrease?", {
      currentPrice,
      state: this,
      isADecrease,
      ratio,
      percentChange,
    });

    return isADecrease;
  };

  shouldTriggerStopLoss = (currentPrice: Big): boolean => {
    const changeFromPurchasePrice = new Big(currentPrice).div(
      new Big(this.lastPurchasePrice)
    );
    const triggerStopLoss = changeFromPurchasePrice.lte("0.97");

    stateLogger.warn(
      `STOP LOSS TRIGGERED FOR ${Config.SYMBOL} at ${currentPrice}`,
      { changeFromPurchasePrice, triggerStopLoss, currentPrice, state: this }
    );

    return triggerStopLoss;
  };

  meetsSellCriteria = (currentPrice: Big): boolean => {
    if (this.shouldTriggerStopLoss(currentPrice)) {
      return true;
    }

    const percentIncrease = new Big(currentPrice)
      .div(new Big(this.lastPurchasePrice))
      .toFixed(3);

    const result = new Big(percentIncrease).gt(
      DecisionConfig.MIN_PERCENT_INCREASE_FOR_SELL
    );

    stateLogger.debug("SELL CRITERIA", {
      state: this,
      result,
      currentPrice: currentPrice.toFixed(5),
    });

    return result;
  };

  meetsBuyCriteria = (currentPrice: Big): boolean => {
    const lastPriceIncreasedBy2Percent = new Big(this.lastTickerPrice)
      .mul(DecisionConfig.MAX_PERCENT_INCREASE_FOR_BUY)
      .toFixed(3);

    const result =
      currentPrice.gt(this.lastTickerPrice) &&
      currentPrice.lt(lastPriceIncreasedBy2Percent);

    stateLogger.debug("BUY CRITERIA", {
      state: this,
      result,
      currentPrice: currentPrice.toFixed(5),
      lastPriceIncreasedBy3Percent: lastPriceIncreasedBy2Percent,
    });

    return result;
  };

  logResult = (
    type: "BUY" | "SELL",
    result: {
      nextDecision: IDecisionEngine;
      buy?: boolean;
      sell?: boolean;
    }
  ) => {
    stateLogger.info(`SHOULD ${type}?`, {
      current: this,
      next: result.nextDecision,
      buy: result.buy,
      sell: result.sell,
    });
  };

  abstract shouldBuy: IDecisionEngine["shouldBuy"];
  abstract shouldSell: IDecisionEngine["shouldSell"];
}

export class Start extends DecisionEngine {
  constructor(lastTickerPrice: string) {
    super("Start", { lastPurchasePrice: "0", lastTickerPrice });
  }

  shouldBuy: IDecisionEngine["shouldBuy"] = (currentPrice) => {
    let result;
    if (new Big(currentPrice).gt(this.lastTickerPrice)) {
      result = {
        nextDecision: new UpwardPriceTrend({
          lastTickerPrice: currentPrice,
          lastPurchasePrice: "0",
        }),
        buy: false,
      };
    } else {
      result = {
        nextDecision: new DownwardPriceTrend({
          lastTickerPrice: currentPrice,
          lastPurchasePrice: "0",
        }),
        buy: false,
      };
    }

    this.logResult("BUY", result);

    return result;
  };

  shouldSell: IDecisionEngine["shouldSell"] = (currentPrice) => {
    let result;

    if (new Big(currentPrice).gt(this.lastTickerPrice)) {
      result = {
        nextDecision: new UpwardPriceTrend({
          lastTickerPrice: currentPrice,
          lastPurchasePrice: "0",
        }),
        sell: false,
      };
    } else {
      result = {
        nextDecision: new DownwardPriceTrend({
          lastTickerPrice: currentPrice,
          lastPurchasePrice: "0",
        }),
        sell: false,
      };
    }

    this.logResult("SELL", result);

    return result;
  };
}

export class DownwardPriceTrend extends DecisionEngine {
  constructor(data: TDecisionEngineData) {
    super("DownwardPriceTrend", data);
  }

  shouldSell: IDecisionEngine["shouldSell"] = (currentPrice) => {
    let result;
    if (this.isAnIncrease(new Big(currentPrice))) {
      result = {
        nextDecision: new UpwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        sell: false,
      };
    } else {
      result = {
        nextDecision: new DownwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        sell: false,
      };
    }
    this.logResult("SELL", result);

    return result;
  };

  shouldBuy: IDecisionEngine["shouldBuy"] = (currentPrice) => {
    let result;
    if (this.isAnIncrease(new Big(currentPrice))) {
      result = {
        nextDecision: new UpwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        buy: false,
      };
    } else {
      result = {
        nextDecision: new DownwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        buy: false,
      };
    }
    this.logResult("BUY", result);
    return result;
  };
}

export class UpwardPriceTrend extends DecisionEngine {
  constructor(data: TDecisionEngineData) {
    super("UpwardPriceTrend", data);
  }

  shouldSell: IDecisionEngine["shouldSell"] = (currentPrice) => {
    let result;
    if (this.isAnIncrease(new Big(currentPrice))) {
      result = {
        nextDecision: new UpwardPriceTrendConfirmed({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        sell: this.meetsSellCriteria(new Big(currentPrice)),
      };
    } else if (this.isADecrease(new Big(currentPrice))) {
      result = {
        nextDecision: new DownwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        sell: false,
      };
    } else {
      result = {
        nextDecision: new UpwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        sell: false,
      };
    }
    this.logResult("SELL", result);
    return result;
  };

  shouldBuy: IDecisionEngine["shouldBuy"] = (currentPrice) => {
    let result;
    if (this.isAnIncrease(new Big(currentPrice))) {
      const isABuy = this.meetsBuyCriteria(new Big(currentPrice));
      result = {
        nextDecision: new UpwardPriceTrendConfirmed({
          lastPurchasePrice: isABuy ? currentPrice : this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        buy: isABuy,
      };
    } else if (this.isADecrease(new Big(currentPrice))) {
      result = {
        nextDecision: new DownwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        buy: false,
      };
    } else {
      result = {
        nextDecision: new UpwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        buy: false,
      };
    }
    this.logResult("BUY", result);
    return result;
  };
}

export class UpwardPriceTrendConfirmed extends DecisionEngine {
  constructor(data: TDecisionEngineData) {
    super("UpwardPriceTrendConfirmed", data);
  }

  shouldSell: IDecisionEngine["shouldSell"] = (currentPrice) => {
    let result;

    if (this.isADecrease(new Big(currentPrice))) {
      result = {
        nextDecision: new DownwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        sell: false,
      };
    } else {
      const isASell = this.meetsSellCriteria(new Big(currentPrice));
      result = {
        nextDecision: new UpwardPriceTrendConfirmed({
          lastPurchasePrice: isASell ? "0" : this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        sell: isASell,
      };
    }

    this.logResult("SELL", result);
    return result;
  };

  shouldBuy: IDecisionEngine["shouldBuy"] = (currentPrice) => {
    let result;

    if (this.isADecrease(new Big(currentPrice))) {
      result = {
        nextDecision: new DownwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        buy: false,
      };
    } else {
      const isABuy = this.meetsBuyCriteria(new Big(currentPrice));
      result = {
        nextDecision: new UpwardPriceTrendConfirmed({
          lastPurchasePrice: isABuy ? currentPrice : this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        buy: isABuy,
      };
    }

    this.logResult("BUY", result);
    return result;
  };
}
