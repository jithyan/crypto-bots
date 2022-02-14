import { Start } from "./priceTrendDecision";

export function startNewPriceTrendDecisionEngine(currentTickerPrice: string) {
  return new Start(currentTickerPrice);
}
