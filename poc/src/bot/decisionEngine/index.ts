import { Start } from "./priceTrendDecision.js";

export function startNewPriceTrendDecisionEngine(currentTickerPrice: string) {
  return new Start(currentTickerPrice);
}
