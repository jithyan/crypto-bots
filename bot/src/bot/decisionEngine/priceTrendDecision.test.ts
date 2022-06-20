import { describe, expect, it } from "vitest";
import { Start, UpwardPriceTrend } from "./priceTrendDecision";

describe("PriceTrendDecision tests", () => {
  describe("Start state", () => {
    it("shouldBuy returns UpwardPriceTrend and buy=false, if current price > last purchase price", () => {
      const start = new Start("100", {
        MIN_PERCENT_INCREASE_FOR_SELL: "1.0105",
        PRICE_HAS_INCREASED_THRESHOLD: "1.005",
        PRICE_HAS_DECREASED_THRESHOLD: "0.999",
        STOP_LOSS_THRESHOLD: " 0.15",
        PUMP_INC: "",
      });
      const result = start.shouldBuy("101");

      expect(result.nextDecision).instanceOf(UpwardPriceTrend);
      expect(result.buy).false;
    });
  });
});
