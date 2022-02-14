import Big from "big.js";
import { stateLogger } from "../../log";
import { roundTo3Dp as truncTo3Dp } from "../../utils";

interface IDecisionEngine {
  shouldBuy: (currentPrice: string) => {
    nextDecision: IDecisionEngine;
    buy: boolean;
  };

  shouldSell: (currentPrice: string) => {
    nextDecision: IDecisionEngine;
    sell: boolean;
  };
}

type DecisionStates =
  | "Start"
  | "UpwardPriceTrend"
  | "DownwardPriceTrend"
  | "UpwardPriceTrendConfirmed";

const DecisionConfig = {
  MAX_PERCENT_INCREASE_FOR_BUY: new Big("1.025"),
  MIN_PERCENT_INCREASE_FOR_SELL: new Big("1.015"),
  PRICE_HAS_INCREASED_THRESHOLD: new Big("1.005"),
  PRICE_HAS_DECREASED_THRESHOLD: new Big("0.995"),
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
    stateLogger.info("CREATE", this);
  }

  isAnIncrease = (currentPrice: Big): boolean =>
    currentPrice
      .div(this.lastTickerPrice)
      .gt(DecisionConfig.PRICE_HAS_INCREASED_THRESHOLD);

  isADecrease = (currentPrice: Big): boolean =>
    currentPrice
      .div(this.lastTickerPrice)
      .lt(DecisionConfig.PRICE_HAS_DECREASED_THRESHOLD);

  meetsSellCriteria = (currentPrice: Big): boolean => {
    const percentIncrease = new Big(currentPrice)
      .div(new Big(this.lastPurchasePrice))
      .toFixed(3);

    const result = new Big(percentIncrease).gt(
      DecisionConfig.MIN_PERCENT_INCREASE_FOR_SELL
    );

    stateLogger.info("SELL CRITERIA", {
      state: this,
      result,
      currentPrice: currentPrice.toFixed(5),
    });

    return result;
  };

  meetsBuyCriteria = (currentPrice: Big): boolean => {
    const lastPriceIncreasedBy3Percent = new Big(this.lastTickerPrice)
      .mul(DecisionConfig.MAX_PERCENT_INCREASE_FOR_BUY)
      .toFixed(3);

    const result =
      currentPrice.gt(this.lastTickerPrice) &&
      currentPrice.lt(lastPriceIncreasedBy3Percent);

    stateLogger.info("BUY CRITERIA", {
      state: this,
      result,
      currentPrice: currentPrice.toFixed(5),
      lastPriceIncreasedBy3Percent,
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
      result = {
        nextDecision: new UpwardPriceTrendConfirmed({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        buy: this.meetsBuyCriteria(new Big(currentPrice)),
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
    super("DownwardPriceTrend", data);
  }

  shouldSell: IDecisionEngine["shouldSell"] = (currentPrice) => {
    if (this.isAnIncrease(new Big(currentPrice))) {
      return {
        nextDecision: new UpwardPriceTrendConfirmed({
          lastPurchasePrice: this.meetsSellCriteria(new Big(currentPrice))
            ? truncTo3Dp(currentPrice)
            : this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        sell: this.meetsSellCriteria(new Big(currentPrice)),
      };
    } else if (this.isADecrease(new Big(currentPrice))) {
      return {
        nextDecision: new DownwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        sell: false,
      };
    } else {
      return {
        nextDecision: new UpwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        sell: false,
      };
    }
  };

  shouldBuy: IDecisionEngine["shouldBuy"] = (currentPrice) => {
    if (this.isAnIncrease(new Big(currentPrice))) {
      return {
        nextDecision: new UpwardPriceTrendConfirmed({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        buy: this.meetsBuyCriteria(new Big(currentPrice)),
      };
    } else if (this.isADecrease(new Big(currentPrice))) {
      return {
        nextDecision: new DownwardPriceTrend({
          lastPurchasePrice: this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        buy: false,
      };
    } else {
      return {
        nextDecision: new UpwardPriceTrend({
          lastPurchasePrice: this.meetsBuyCriteria(new Big(currentPrice))
            ? truncTo3Dp(currentPrice)
            : this.lastPurchasePrice,
          lastTickerPrice: currentPrice,
        }),
        buy: this.meetsBuyCriteria(new Big(currentPrice)),
      };
    }
  };
}
