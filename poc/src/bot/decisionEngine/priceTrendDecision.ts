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

export class DecisionEngine implements IDecisionEngine {
  shouldBuy: (currentPrice: string) => {
    nextDecision: IDecisionEngine;
    buy: boolean;
  } = () => {
    return {
      nextDecision: this,
      buy: false,
    };
  };

  shouldSell: (currentPrice: string) => {
    nextDecision: IDecisionEngine;
    sell: boolean;
  } = () => {
    return {
      nextDecision: this,
      sell: false,
    };
  };
}
