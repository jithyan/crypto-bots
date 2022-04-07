import { request } from "gaxios";
import { logger } from "./log";

export async function getProfitForSymbol(symbol: string): Promise<string> {
  try {
    const resp = await request<{ total_profit: string }>({
      baseURL: "http://0.0.0.0:2001",
      url: `/trade/year/${symbol}`,
      method: "POST",
    });
    return resp.data.total_profit;
  } catch (e) {
    logger.error("Failed fetching profit from db", e);
    return "0";
  }
}
