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
    isStopLossTriggered: boolean;
  };

  lastPurchasePrice: string;

  setLastPurchasePrice: (price: string) => IDecisionEngine;
}

export type DecisionStates =
  | "Start"
  | "UpwardPriceTrend"
  | "DownwardPriceTrend"
  | "UpwardPriceTrendConfirmed";

export type PriceTrendDecisionConfig = Record<
  | "MIN_PERCENT_INCREASE_FOR_SELL"
  | "PRICE_HAS_INCREASED_THRESHOLD"
  | "PRICE_HAS_DECREASED_THRESHOLD"
  | "STOP_LOSS_THRESHOLD",
  string
>;

type TDecisionEngineData = Record<
  "lastPurchasePrice" | "lastTickerPrice",
  string
>;

abstract class DecisionEngine implements IDecisionEngine {
  readonly lastTickerPrice: string;
  readonly lastPurchasePrice: string;
  readonly state: DecisionStates;
  readonly decisionConfig: PriceTrendDecisionConfig;

  constructor(
    state: DecisionStates,
    data: TDecisionEngineData,
    decisionConfig: PriceTrendDecisionConfig
  ) {
    this.lastTickerPrice = data.lastTickerPrice;
    this.lastPurchasePrice = data.lastPurchasePrice;
    this.state = state;
    this.decisionConfig = decisionConfig;
    stateLogger.info("CREATE new " + this.state, this);
  }

  calcPctChangeInPriceSinceLastCheck = (currentPrice: Big) =>
    currentPrice.div(this.lastTickerPrice).minus("1");

  isAnIncrease = (currentPrice: Big): boolean => {
    const ratio = new Big(currentPrice.div(this.lastTickerPrice).toFixed(4));
    const isAnIncrease = ratio.gt(
      this.decisionConfig.PRICE_HAS_INCREASED_THRESHOLD
    );

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
    const isADecrease = ratio.lt(
      this.decisionConfig.PRICE_HAS_DECREASED_THRESHOLD
    );

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
    const triggerStopLoss = changeFromPurchasePrice.lte(
      new Big("1.0").minus(this.decisionConfig.STOP_LOSS_THRESHOLD)
    );

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
      this.decisionConfig.MIN_PERCENT_INCREASE_FOR_SELL
    );

    stateLogger.debug("SELL CRITERIA", {
      state: this,
      result,
      currentPrice: currentPrice.toString(),
    });

    return result;
  };

  meetsBuyCriteria = (currentPrice: Big): boolean => {
    const result = currentPrice.gt(this.lastTickerPrice);

    stateLogger.debug("BUY CRITERIA", {
      state: this,
      result,
      currentPrice: currentPrice.toString(),
    });

    return result;
  };

  logResult = (
    type: "BUY" | "SELL",
    result: {
      nextDecision: IDecisionEngine;
      buy?: boolean;
      sell?: boolean;
      isStopLossTriggered?: boolean;
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
  abstract setLastPurchasePrice: (price: string) => IDecisionEngine;
}

export class Start extends DecisionEngine {
  constructor(
    lastTickerPrice: string,
    decisionConfig: PriceTrendDecisionConfig
  ) {
    super("Start", { lastPurchasePrice: "0", lastTickerPrice }, decisionConfig);
  }

  shouldBuy: IDecisionEngine["shouldBuy"] = (currentPrice) => {
    let result;
    if (new Big(currentPrice).gt(this.lastTickerPrice)) {
      result = {
        nextDecision: new UpwardPriceTrend(
          {
            lastTickerPrice: currentPrice,
            lastPurchasePrice: "0",
          },
          this.decisionConfig
        ),
        buy: false,
      };
    } else {
      result = {
        nextDecision: new DownwardPriceTrend(
          {
            lastTickerPrice: currentPrice,
            lastPurchasePrice: "0",
          },
          this.decisionConfig
        ),
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
        nextDecision: new UpwardPriceTrend(
          {
            lastTickerPrice: currentPrice,
            lastPurchasePrice: "0",
          },
          this.decisionConfig
        ),
        sell: false,
        isStopLossTriggered: false,
      };
    } else {
      result = {
        nextDecision: new DownwardPriceTrend(
          {
            lastTickerPrice: currentPrice,
            lastPurchasePrice: "0",
          },
          this.decisionConfig
        ),
        sell: false,
        isStopLossTriggered: false,
      };
    }

    this.logResult("SELL", result);

    return result;
  };

  setLastPurchasePrice = (price: string) => {
    throw new Error(
      "Cannot set last purchase price for Starting decision: " + price
    );
  };
}

export class DownwardPriceTrend extends DecisionEngine {
  constructor(
    data: TDecisionEngineData,
    decisionConfig: PriceTrendDecisionConfig
  ) {
    super("DownwardPriceTrend", data, decisionConfig);
  }

  shouldSell: IDecisionEngine["shouldSell"] = (currentPrice) => {
    let result;
    if (this.isAnIncrease(new Big(currentPrice))) {
      result = {
        nextDecision: new UpwardPriceTrend(
          {
            lastPurchasePrice: this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        sell: false,
        isStopLossTriggered: false,
      };
    } else {
      const isASell = this.meetsSellCriteria(new Big(currentPrice));

      result = {
        nextDecision: new DownwardPriceTrend(
          {
            lastPurchasePrice: isASell ? "0" : this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        sell: isASell,
        isStopLossTriggered: this.shouldTriggerStopLoss(new Big(currentPrice)),
      };
    }
    this.logResult("SELL", result);

    return result;
  };

  shouldBuy: IDecisionEngine["shouldBuy"] = (currentPrice) => {
    let result;
    if (this.isAnIncrease(new Big(currentPrice))) {
      result = {
        nextDecision: new UpwardPriceTrend(
          {
            lastPurchasePrice: this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        buy: false,
      };
    } else {
      result = {
        nextDecision: new DownwardPriceTrend(
          {
            lastPurchasePrice: this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        buy: false,
      };
    }
    this.logResult("BUY", result);
    return result;
  };

  setLastPurchasePrice = (price: string) =>
    new DownwardPriceTrend(
      { ...this, lastPurchasePrice: price },
      this.decisionConfig
    );
}

export class UpwardPriceTrend extends DecisionEngine {
  constructor(
    data: TDecisionEngineData,
    decisionConfig: PriceTrendDecisionConfig
  ) {
    super("UpwardPriceTrend", data, decisionConfig);
  }

  shouldSell: IDecisionEngine["shouldSell"] = (currentPrice) => {
    let result;
    if (this.isAnIncrease(new Big(currentPrice))) {
      result = {
        nextDecision: new UpwardPriceTrendConfirmed(
          {
            lastPurchasePrice: this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        sell: false,
        isStopLossTriggered: false,
      };
    } else if (this.isADecrease(new Big(currentPrice))) {
      const isASell = this.meetsSellCriteria(new Big(currentPrice));
      result = {
        nextDecision: new DownwardPriceTrend(
          {
            lastPurchasePrice: isASell ? "0" : this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        sell: isASell,
        isStopLossTriggered: this.shouldTriggerStopLoss(new Big(currentPrice)),
      };
    } else {
      result = {
        nextDecision: new UpwardPriceTrend(
          {
            lastPurchasePrice: this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        sell: false,
        isStopLossTriggered: false,
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
        nextDecision: new UpwardPriceTrendConfirmed(
          {
            lastPurchasePrice: isABuy ? currentPrice : this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        buy: isABuy,
      };
    } else if (this.isADecrease(new Big(currentPrice))) {
      result = {
        nextDecision: new DownwardPriceTrend(
          {
            lastPurchasePrice: this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        buy: false,
      };
    } else {
      result = {
        nextDecision: new UpwardPriceTrend(
          {
            lastPurchasePrice: this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        buy: false,
      };
    }
    this.logResult("BUY", result);
    return result;
  };

  setLastPurchasePrice = (price: string) =>
    new UpwardPriceTrend(
      { ...this, lastPurchasePrice: price },
      this.decisionConfig
    );
}

export class UpwardPriceTrendConfirmed extends DecisionEngine {
  constructor(
    data: TDecisionEngineData,
    decisionConfig: PriceTrendDecisionConfig
  ) {
    super("UpwardPriceTrendConfirmed", data, decisionConfig);
  }

  shouldSell: IDecisionEngine["shouldSell"] = (currentPrice) => {
    let result;

    const isASell = this.meetsSellCriteria(new Big(currentPrice));

    if (this.isADecrease(new Big(currentPrice))) {
      result = {
        nextDecision: new DownwardPriceTrend(
          {
            lastPurchasePrice: isASell ? "0" : this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        sell: isASell,
        isStopLossTriggered: this.shouldTriggerStopLoss(new Big(currentPrice)),
      };
    } else {
      result = {
        nextDecision: new UpwardPriceTrendConfirmed(
          {
            lastPurchasePrice: this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        sell: false,
        isStopLossTriggered: false,
      };
    }

    this.logResult("SELL", result);
    return result;
  };

  shouldBuy: IDecisionEngine["shouldBuy"] = (currentPrice) => {
    let result;

    if (this.isADecrease(new Big(currentPrice))) {
      result = {
        nextDecision: new DownwardPriceTrend(
          {
            lastPurchasePrice: this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        buy: false,
      };
    } else {
      const isABuy = this.meetsBuyCriteria(new Big(currentPrice));
      result = {
        nextDecision: new UpwardPriceTrendConfirmed(
          {
            lastPurchasePrice: isABuy ? currentPrice : this.lastPurchasePrice,
            lastTickerPrice: currentPrice,
          },
          this.decisionConfig
        ),
        buy: isABuy,
      };
    }

    this.logResult("BUY", result);
    return result;
  };

  setLastPurchasePrice = (price: string) =>
    new UpwardPriceTrendConfirmed(
      { ...this, lastPurchasePrice: price },
      this.decisionConfig
    );
}
