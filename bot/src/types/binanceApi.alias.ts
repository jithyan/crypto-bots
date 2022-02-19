export type {
  Account as IBinanceAccountInfo,
  OrderDetails as IBinanceOrderDetails,
  Ticker as IBinance24hrTicker,
} from "./binanceSpotApi.swagger";
import type {
  OrderResponseAck,
  OrderResponseResult,
  OrderResponseFull,
  PriceTicker,
  PriceTickerList,
} from "./binanceSpotApi.swagger";

export interface IBinanceExchangeInfo {
  timezone: string;
  serverTime: number;
  rateLimits: {
    rateLimitType: string;
    interval: string;
    intervalNum: number;
    limit: number;
  }[];
  exchangeFilters: object[];
  symbols: {
    symbol: string;
    status: string;
    baseAsset: string;
    baseAssetPrecision: number;
    quoteAsset: string;
    quoteAssetPrecision: number;
    baseCommissionPrecision: number;
    quoteCommissionPrecision: number;
    orderTypes: string[];
    icebergAllowed: boolean;
    ocoAllowed: boolean;
    quoteOrderQtyMarketAllowed: boolean;
    isSpotTradingAllowed: boolean;
    isMarginTradingAllowed: boolean;
    filters: {
      filterType: string;
      minPrice: string;
      maxPrice: string;
      tickSize: string;
    }[];
    permissions: string[];
  }[];
}

export type TOrderCreateResponse =
  | OrderResponseAck
  | OrderResponseResult
  | OrderResponseFull;

export type TTickerPriceResponse = PriceTicker | PriceTickerList;
