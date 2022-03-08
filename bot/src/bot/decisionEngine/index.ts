import { PriceTrendDecisionConfig, Start } from "./priceTrendDecision.js";

export function startNewPriceTrendDecisionEngine(
  currentTickerPrice: string,
  decisionConfig: PriceTrendDecisionConfig
) {
  return new Start(currentTickerPrice, decisionConfig);
}
