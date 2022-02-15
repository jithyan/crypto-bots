export type {
  Account as IBinanceAccountInfo,
  OrderDetails as IBinanceOrderDetails,
} from "./binanceSpotApi.swagger";
import type {
  OrderResponseAck,
  OrderResponseResult,
  OrderResponseFull,
  PriceTicker,
  PriceTickerList,
} from "./binanceSpotApi.swagger";

export type TOrderCreateResponse =
  | OrderResponseAck
  | OrderResponseResult
  | OrderResponseFull;

export type TTickerPriceResponse = PriceTicker | PriceTickerList;
