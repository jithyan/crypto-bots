import { request } from "gaxios";
import { logger } from "./log";

export async function getProfitForSymbol(symbol: string): Promise<string> {
  try {
    const resp = await request<{ total_profit: string }>({
      baseURL: "http://0.0.0.0:2001",
      url: `/trade/profit/${symbol}`,
      method: "GET",
    });
    return resp.data.total_profit;
  } catch (e) {
    logger.error("Failed fetching profit from db", e);
    return "0";
  }
}

export async function getAllTimeProfit(): Promise<string> {
  try {
    const resp = await request<{ total_profit: string }>({
      baseURL: "http://0.0.0.0:2001",
      url: `/trade/profit`,
      method: "GET",
    });
    return resp.data.total_profit;
  } catch (e) {
    logger.error("Failed fetching profit from db", e);
    return "0";
  }
}

export async function getTradeStatsForSymbol(symbol: string): Promise<any> {
  const resp = await request<{ total_profit: string }>({
    baseURL: "http://0.0.0.0:2001",
    url: `/trade/stats/${symbol}`,
    method: "GET",
  });
  return resp.data;
}

export async function getPerformanceReport(): Promise<any> {
  const resp = await request({
    baseURL: "http://0.0.0.0:2001",
    url: `/trade/report`,
    method: "GET",
  });
  return resp.data;
}
