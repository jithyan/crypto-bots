/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Account {
  /**
   * @format int64
   * @example 15
   */
  makerCommission: number;

  /**
   * @format int64
   * @example 15
   */
  takerCommission: number;

  /**
   * @format int64
   * @example 0
   */
  buyerCommission: number;

  /**
   * @format int64
   * @example 0
   */
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;

  /**
   * @format int64
   * @example 123456789
   */
  updateTime: number;

  /** @example SPOT */
  accountType: string;
  balances: { asset: string; free: string; locked: string }[];
}

export interface Order {
  /** @example BNBBTC */
  symbol: string;

  /** @example msXkySR3u5uYwpvRMFsi3u */
  origClientOrderId: string;

  /**
   * @format int64
   * @example 28
   */
  orderId: number;

  /**
   * Unless OCO, value will be -1
   * @format int64
   * @example -1
   */
  orderListId: number;

  /** @example 6gCrw2kRUAF9CvJDGP16IP */
  clientOrderId: string;

  /** @example 1.00000000 */
  price: string;

  /** @example 10.00000000 */
  origQty: string;

  /** @example 10.00000000 */
  executedQty: string;

  /** @example 10.00000000 */
  cummulativeQuoteQty: string;

  /** @example FILLED */
  status: string;

  /** @example GTC */
  timeInForce: string;

  /** @example LIMIT */
  type: string;

  /** @example SELL */
  side: string;
}

export interface OcoOrder {
  /**
   * @format int64
   * @example 1929
   */
  orderListId: number;

  /** @example OCO */
  contingencyType: string;

  /** @example ALL_DONE */
  listStatusType: string;

  /** @example ALL_DONE */
  listOrderStatus: string;

  /** @example C3wyj4WVEktd7u9aVBRXcN */
  listClientOrderId: string;

  /**
   * @format int64
   * @example 1574040868128
   */
  transactionTime: number;

  /** @example BNBBTC */
  symbol: string;

  /** @example [{"symbol":"BNBBTC","orderId":2,"clientOrderId":"pO9ufTiFGg3nw2fOdgeOXa"},{"symbol":"BNBBTC","orderId":3,"clientOrderId":"TXOvglzXuaubXAaENpaRCB"}] */
  orders: { symbol: string; orderId: number; clientOrderId: string }[];

  /** @example [{"symbol":"BNBBTC","origClientOrderId":"pO9ufTiFGg3nw2fOdgeOXa","orderId":2,"orderListId":0,"clientOrderId":"unfWT8ig8i0uj6lPuYLez6","price":"1.00000000","origQty":"10.00000000","executedQty":"0.00000000","cummulativeQuoteQty":"0.00000000","status":"CANCELED","timeInForce":"GTC","type":"STOP_LOSS_LIMIT","side":"SELL","stopPrice":"1.00000000"},{"symbol":"BNBBTC","origClientOrderId":"TXOvglzXuaubXAaENpaRCB","orderId":3,"orderListId":0,"clientOrderId":"unfWT8ig8i0uj6lPuYLez6","price":"3.00000000","origQty":"10.00000000","executedQty":"0.00000000","cummulativeQuoteQty":"0.00000000","status":"CANCELED","timeInForce":"GTC","type":"LIMIT_MAKER","side":"SELL"}] */
  orderReports: {
    symbol: string;
    origClientOrderId: string;
    orderId: number;
    orderListId: number;
    clientOrderId: string;
    price: string;
    origQty: string;
    executedQty: string;
    cummulativeQuoteQty: string;
    status: string;
    timeInForce: string;
    type: string;
    side: string;
    stopPrice: string;
  }[];
}

export interface MarginOcoOrder {
  /**
   * @format int64
   * @example 0
   */
  orderListId: number;

  /** @example OCO */
  contingencyType: string;

  /** @example ALL_DONE */
  listStatusType: string;

  /** @example ALL_DONE */
  listOrderStatus: string;

  /** @example C3wyj4WVEktd7u9aVBRXcN */
  listClientOrderId: string;

  /**
   * @format int64
   * @example 1574040868128
   */
  transactionTime: number;

  /** @example BNBUSDT */
  symbol: string;

  /** @example false */
  isIsolated: boolean;
  orders: { symbol: string; orderId: number; clientOrderId: string }[];
  orderReports: {
    symbol: string;
    origClientOrderId: string;
    orderId: number;
    orderListId: number;
    clientOrderId: string;
    price: string;
    origQty: string;
    executedQty: string;
    cummulativeQuoteQty: string;
    status: string;
    timeInForce: string;
    type: string;
    side: string;
    stopPrice: string;
  }[];
}

export interface OrderDetails {
  /** @example LTCBTC */
  symbol: string;

  /**
   * @format int64
   * @example 1
   */
  orderId: number;

  /**
   * Unless OCO, value will be -1
   * @format int64
   * @example -1
   */
  orderListId: number;

  /** @example myOrder1 */
  clientOrderId: string;

  /** @example 0.1 */
  price: string;

  /** @example 1.0 */
  origQty: string;

  /** @example 0.0 */
  executedQty: string;

  /** @example 0.0 */
  cummulativeQuoteQty: string;

  /** @example NEW */
  status: string;

  /** @example GTC */
  timeInForce: string;

  /** @example LIMIT */
  type: string;

  /** @example BUY */
  side: string;

  /** @example 0.0 */
  stopPrice: string;

  /** @example 0.0 */
  icebergQty: string;

  /**
   * @format int64
   * @example 1499827319559
   */
  time: number;

  /**
   * @format int64
   * @example 1499827319559
   */
  updateTime: number;
  isWorking: boolean;

  /** @example 0.00000000 */
  origQuoteOrderQty: string;
}

export interface OrderResponseAck {
  /** @example BTCUSDT */
  symbol: string;

  /**
   * @format int64
   * @example 28
   */
  orderId: number;

  /**
   * @format int64
   * @example -1
   */
  orderListId: number;

  /** @example 6gCrw2kRUAF9CvJDGP16IP */
  clientOrderId: string;

  /**
   * @format int64
   * @example 1507725176595
   */
  transactTime: number;
}

export interface OrderResponseResult {
  /** @example BTCUSDT */
  symbol: string;

  /**
   * @format int64
   * @example 28
   */
  orderId: number;

  /**
   * @format int64
   * @example -1
   */
  orderListId: number;

  /** @example 6gCrw2kRUAF9CvJDGP16IP */
  clientOrderId: string;

  /**
   * @format int64
   * @example 1507725176595
   */
  transactTime: number;

  /** @example 0.00000000 */
  price: string;

  /** @example 10.00000000 */
  origQty: string;

  /** @example 10.00000000 */
  executedQty: string;

  /** @example 10.00000000 */
  cummulativeQuoteQty: string;

  /** @example FILLED */
  status: string;

  /** @example GTC */
  timeInForce: string;

  /** @example MARKET */
  type: string;

  /** @example SELL */
  side: string;
}

export interface OrderResponseFull {
  /** @example BTCUSDT */
  symbol: string;

  /**
   * @format int64
   * @example 28
   */
  orderId: number;

  /**
   * @format int64
   * @example -1
   */
  orderListId: number;

  /** @example 6gCrw2kRUAF9CvJDGP16IP */
  clientOrderId: string;

  /**
   * @format int64
   * @example 1507725176595
   */
  transactTime: number;

  /** @example 0.00000000 */
  price: string;

  /** @example 10.00000000 */
  origQty: string;

  /** @example 10.00000000 */
  executedQty: string;

  /** @example 10.00000000 */
  cummulativeQuoteQty: string;

  /** @example FILLED */
  status: string;

  /** @example GTC */
  timeInForce: string;

  /** @example MARKET */
  type: string;

  /** @example SELL */
  side: string;
  fills: { price: string; qty: string; commission: string; commissionAsset: string }[];
}

export interface MarginOrder {
  /** @example LTCBTC */
  symbol: string;

  /**
   * @format int64
   * @example 28
   */
  orderId: number;

  /** @example msXkySR3u5uYwpvRMFsi3u */
  origClientOrderId: string;

  /** @example 6gCrw2kRUAF9CvJDGP16IP */
  clientOrderId: string;

  /** @example 1.00000000 */
  price: string;

  /** @example 10.00000000 */
  origQty: string;

  /** @example 8.00000000 */
  executedQty: string;

  /** @example 8.00000000 */
  cummulativeQuoteQty: string;

  /** @example CANCELED */
  status: string;

  /** @example GTC */
  timeInForce: string;

  /** @example LIMIT */
  type: string;

  /** @example SELL */
  side: string;
}

export interface MarginOrderDetail {
  /** @example ZwfQzuDIGpceVhKW5DvCmO */
  clientOrderId: string;

  /** @example 0.00000000 */
  cummulativeQuoteQty: string;

  /** @example 0.00000000 */
  executedQty: string;

  /** @example 0.00000000 */
  icebergQty: string;
  isWorking: boolean;

  /**
   * @format int64
   * @example 213205622
   */
  orderId: number;

  /** @example 0.30000000 */
  origQty: string;

  /** @example 0.00493630 */
  price: string;

  /** @example SELL */
  side: string;

  /** @example NEW */
  status: string;

  /** @example 0.00000000 */
  stopPrice: string;

  /** @example BNBBTC */
  symbol: string;
  isIsolated: boolean;

  /**
   * @format int64
   * @example 1562133008725
   */
  time: number;

  /** @example GTC */
  timeInForce: string;

  /** @example LIMIT */
  type: string;

  /**
   * @format int64
   * @example 1562133008725
   */
  updateTime: number;
}

export interface CanceledMarginOrderDetail {
  /** @example BNBUSDT */
  symbol: string;
  isIsolated: boolean;

  /** @example E6APeyTJvkMvLMYMqu1KQ4 */
  origClientOrderId: string;

  /**
   * @format int64
   * @example 11
   */
  orderId: number;

  /**
   * @format int64
   * @example -1
   */
  orderListId: number;

  /** @example pXLV6Hz6mprAcVYpVMTGgx */
  clientOrderId: string;

  /** @example 0.089853 */
  price: string;

  /** @example 0.178622 */
  origQty: string;

  /** @example 0.000000 */
  executedQty: string;

  /** @example 0.000000 */
  cummulativeQuoteQty: string;

  /** @example CANCELED */
  status: string;

  /** @example GTC */
  timeInForce: string;

  /** @example LIMIT */
  type: string;

  /** @example BUY */
  side: string;
}

export interface MarginOrderResponseAck {
  /** @example BTCUSDT */
  symbol: string;

  /**
   * @format int64
   * @example 28
   */
  orderId: number;

  /** @example 6gCrw2kRUAF9CvJDGP16IP */
  clientOrderId: string;
  isIsolated: boolean;

  /**
   * @format int64
   * @example 1507725176595
   */
  transactTime: number;
}

export interface MarginOrderResponseResult {
  /** @example BTCUSDT */
  symbol: string;

  /**
   * @format int64
   * @example 28
   */
  orderId: number;

  /** @example 6gCrw2kRUAF9CvJDGP16IP */
  clientOrderId: string;

  /**
   * @format int64
   * @example 1507725176595
   */
  transactTime: number;

  /** @example 1.00000000 */
  price: string;

  /** @example 10.00000000 */
  origQty: string;

  /** @example 10.00000000 */
  executedQty: string;

  /** @example 10.00000000 */
  cummulativeQuoteQty: string;

  /** @example FILLED */
  status: string;

  /** @example GTC */
  timeInForce: string;

  /** @example MARKET */
  type: string;
  isIsolated: boolean;

  /** @example SELL */
  side: string;
}

export interface MarginOrderResponseFull {
  /** @example BTCUSDT */
  symbol: string;

  /**
   * @format int64
   * @example 28
   */
  orderId: number;

  /** @example 6gCrw2kRUAF9CvJDGP16IP */
  clientOrderId: string;

  /**
   * @format int64
   * @example 1507725176595
   */
  transactTime: number;

  /** @example 1.00000000 */
  price: string;

  /** @example 10.00000000 */
  origQty: string;

  /** @example 10.00000000 */
  executedQty: string;

  /** @example 10.00000000 */
  cummulativeQuoteQty: string;

  /** @example FILLED */
  status: string;

  /** @example GTC */
  timeInForce: string;

  /** @example MARKET */
  type: string;

  /** @example SELL */
  side: string;

  /**
   * will not return if no margin trade happens
   * @format double
   * @example 5
   */
  marginBuyBorrowAmount: number;

  /**
   * will not return if no margin trade happens
   * @example BTC
   */
  marginBuyBorrowAsset: string;
  isIsolated: boolean;
  fills: { price: string; qty: string; commission: string; commissionAsset: string }[];
}

export interface MarginTrade {
  /** @example 0.00006000 */
  commission: string;

  /** @example BTC */
  commissionAsset: string;

  /**
   * @format int64
   * @example 28
   */
  id: number;
  isBestMatch: boolean;
  isBuyer: boolean;
  isMaker: boolean;

  /**
   * @format int64
   * @example 28
   */
  orderId: number;

  /** @example 0.02000000 */
  price: string;

  /** @example 1.02000000 */
  qty: string;

  /** @example BNBBTC */
  symbol: string;

  /** @example false */
  isIsolated: boolean;

  /**
   * @format int64
   * @example 1507725176595
   */
  time: number;
}

export interface MarginTransferDetails {
  rows: {
    amount: string;
    asset: string;
    status: string;
    timestamp: number;
    txId: number;
    transFrom: string;
    transTo: string;
  }[];

  /**
   * @format int32
   * @example 1
   */
  total: number;
}

export interface IsolatedMarginAccountInfo {
  assets: {
    baseAsset: {
      asset: string;
      borrowEnabled: boolean;
      borrowed: string;
      free: string;
      interest: string;
      locked: string;
      netAsset: string;
      netAssetOfBtc: string;
      repayEnabled: boolean;
      totalAsset: string;
    };
    quoteAsset: {
      asset: string;
      borrowEnabled: boolean;
      borrowed: string;
      free: string;
      interest: string;
      locked: string;
      netAsset: string;
      netAssetOfBtc: string;
      repayEnabled: boolean;
      totalAsset: string;
    };
    symbol: string;
    isolatedCreated: boolean;
    enabled: boolean;
    marginLevel: string;
    marginLevelStatus: string;
    marginRatio: string;
    indexPrice: string;
    liquidatePrice: string;
    liquidateRate: string;
    tradeEnabled: boolean;
  }[];

  /** @example 0.00000000 */
  totalAssetOfBtc: string;

  /** @example 0.00000000 */
  totalLiabilityOfBtc: string;

  /** @example 0.00000000 */
  totalNetAssetOfBtc: string;
}

export type BookTickerList = BookTicker[];

export interface BookTicker {
  /** @example BNBBTC */
  symbol: string;

  /** @example 16.36240000 */
  bidPrice: string;

  /** @example 256.78000000 */
  bidQty: string;

  /** @example 16.36450000 */
  askPrice: string;

  /** @example 12.56000000 */
  askQty: string;
}

export type PriceTickerList = PriceTicker[];

export interface PriceTicker {
  /** @example BNBBTC */
  symbol: string;

  /** @example 0.17160000 */
  price: string;
}

export type TickerList = Ticker[];

export interface Ticker {
  /** @example BNBBTC */
  symbol: string;

  /** @example 0.17160000 */
  priceChange: string;

  /** @example 1.060 */
  priceChangePercent: string;

  /** @example 16.35920000 */
  prevClosePrice: string;

  /** @example 27.84000000 */
  lastPrice: string;

  /** @example 16.34488284 */
  bidPrice: string;

  /** @example 16.34488284 */
  bidQty: string;

  /** @example 16.35920000 */
  askPrice: string;

  /** @example 25.06000000 */
  askQty: string;

  /** @example 16.18760000 */
  openPrice: string;

  /** @example 16.55000000 */
  highPrice: string;

  /** @example 16.16940000 */
  lowPrice: string;

  /** @example 1678279.95000000 */
  volume: string;

  /** @example 27431289.14792300 */
  quoteVolume: string;

  /**
   * @format int64
   * @example 1592808788637
   */
  openTime: number;

  /**
   * @format int64
   * @example 1592895188637
   */
  closeTime: number;

  /**
   * @format int64
   * @example 62683296
   */
  firstId: number;

  /**
   * @format int64
   * @example 62739253
   */
  lastId: number;

  /**
   * @format int64
   * @example 55958
   */
  count: number;
}

export interface MyTrade {
  /** @example BNBBTC */
  symbol: string;

  /**
   * Trade id
   * @format int64
   * @example 28457
   */
  id: number;

  /**
   * @format int64
   * @example 100234
   */
  orderId: number;

  /**
   * @format int64
   * @example -1
   */
  orderListId: number;

  /**
   * Price
   * @example 4.00000100
   */
  price: string;

  /**
   * Amount of base asset
   * @example 12.00000000
   */
  qty: string;

  /**
   * Amount of quote asset
   * @example 48.000012
   */
  quoteQty: string;

  /** @example 10.10000000 */
  commission: string;

  /** @example BNB */
  commissionAsset: string;

  /**
   * Trade timestamp
   * @format int64
   * @example 1499865549590
   */
  time: number;

  /** @example false */
  isBuyer: boolean;

  /** @example false */
  isMaker: boolean;
  isBestMatch: boolean;
}

export interface Transaction {
  /**
   * transaction id
   * @format int64
   * @example 345196462
   */
  tranId: number;
}

export interface Trade {
  /**
   * trade id
   * @format int64
   * @example 345196462
   */
  id: number;

  /**
   * price
   * @example 9638.99000000
   */
  price: string;

  /**
   * amount of base asset
   * @example 0.02077200
   */
  qty: string;

  /**
   * amount of quote asset
   * @example 0.02077200
   */
  quoteQty: string;

  /**
   * Trade executed timestamp, as same as `T` in the stream
   * @format int64
   * @example 1592887772684
   */
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

export interface AggTrade {
  /**
   * Aggregate tradeId
   * @format int64
   * @example 26129
   */
  a: number;

  /**
   * Price
   * @example 0.01633102
   */
  p: string;

  /**
   * Quantity
   * @example 4.70443515
   */
  q: string;

  /**
   * First tradeId
   * @format int64
   * @example 27781
   */
  f: number;

  /**
   * Last tradeId
   * @format int64
   * @example 27781
   */
  l: number;

  /**
   * Timestamp
   * @example 1498793709153
   */
  T: boolean;

  /** Was the buyer the maker? */
  m: boolean;

  /** Was the trade the best price match? */
  M: boolean;
}

export interface BnbBurnStatus {
  spotBNBBurn: boolean;

  /** @example false */
  interestBNBBurn: boolean;
}

export interface SnapshotSpot {
  /**
   * @format int64
   * @example 200
   */
  code: number;

  /** @example  */
  msg: string;
  snapshotVos: {
    data: { balances: { asset: string; free: string; locked: string }[]; totalAssetOfBtc: string };
    type: string;
    updateTime: number;
  }[];
}

export interface SnapshotMargin {
  /**
   * @format int64
   * @example 200
   */
  code: number;

  /** @example  */
  msg: string;
  snapshotVos: {
    data: {
      marginLevel: string;
      totalAssetOfBtc: string;
      totalLiabilityOfBtc: string;
      totalNetAssetOfBtc: string;
      userAssets: {
        asset: string;
        borrowed: string;
        free: string;
        interest: string;
        locked: string;
        netAsset: string;
      }[];
    };
    type: string;
    updateTime: number;
  }[];
}

export interface SnapshotFutures {
  /**
   * @format int64
   * @example 200
   */
  code: number;

  /** @example  */
  msg: string;
  snapshotVos: {
    data: {
      assets: { asset: string; marginBalance: string; walletBalance: string }[];
      position: {
        entryPrice: string;
        markPrice: string;
        positionAmt: string;
        symbol: string;
        unRealizedProfit: string;
      }[];
    };
    type: string;
    updateTime: number;
  }[];
}

export interface SubAccountUSDTFuturesDetails {
  futureAccountResp: {
    email: string;
    assets: {
      asset: string;
      initialMargin: string;
      maintenanceMargin: string;
      marginBalance: string;
      maxWithdrawAmount: string;
      openOrderInitialMargin: string;
      positionInitialMargin: string;
      unrealizedProfit: string;
      walletBalance: string;
    }[];
    canDeposit: boolean;
    canTrade: boolean;
    canWithdraw: boolean;
    feeTier: number;
    maxWithdrawAmount: string;
    totalInitialMargin: string;
    totalMaintenanceMargin: string;
    totalMarginBalance: string;
    totalOpenOrderInitialMargin: string;
    totalPositionInitialMargin: string;
    totalUnrealizedProfit: string;
    totalWalletBalance: string;
    updateTime: number;
  };
}

export interface SubAccountCOINFuturesDetails {
  /** @example abc@test.com */
  email: string;
  assets: {
    asset: string;
    initialMargin: string;
    maintenanceMargin: string;
    marginBalance: string;
    maxWithdrawAmount: string;
    openOrderInitialMargin: string;
    positionInitialMargin: string;
    unrealizedProfit: string;
    walletBalance: string;
  }[];
  canDeposit: boolean;
  canTrade: boolean;
  canWithdraw: boolean;

  /**
   * @format int64
   * @example 2
   */
  feeTier: number;

  /**
   * @format int64
   * @example 1598959682001
   */
  updateTime: number;
}

export interface SubAccountUSDTFuturesSummary {
  futureAccountSummaryResp: {
    totalInitialMargin: string;
    totalMaintenanceMargin: string;
    totalMarginBalance: string;
    totalOpenOrderInitialMargin: string;
    totalPositionInitialMargin: string;
    totalUnrealizedProfit: string;
    totalWalletBalance: string;
    asset: string;
    subAccountList: {
      email: string;
      totalInitialMargin: string;
      totalMaintenanceMargin: string;
      totalMarginBalance: string;
      totalOpenOrderInitialMargin: string;
      totalPositionInitialMargin: string;
      totalUnrealizedProfit: string;
      totalWalletBalance: string;
      asset: string;
    }[];
  };
}

export interface SubAccountCOINFuturesSummary {
  deliveryAccountSummaryResp: {
    totalMarginBalanceOfBTC: string;
    totalUnrealizedProfitOfBTC: string;
    totalWalletBalanceOfBTC: string;
    asset: string;
    subAccountList: {
      email: string;
      totalMarginBalance: string;
      totalUnrealizedProfit: string;
      totalWalletBalance: string;
      asset: string;
    }[];
  };
}

export interface SubAccountUSDTFuturesPositionRisk {
  futurePositionRiskVos: {
    entryPrice: string;
    leverage: string;
    maxNotional: string;
    liquidationPrice: string;
    markPrice: string;
    positionAmount: string;
    symbol: string;
    unrealizedProfit: string;
  }[];
}

export interface SubAccountCOINFuturesPositionRisk {
  deliveryPositionRiskVos: {
    entryPrice: string;
    markPrice: string;
    leverage: string;
    isolated: string;
    isolatedWallet: string;
    isolatedMargin: string;
    isAutoAddMargin: string;
    positionSide: string;
    positionAmount: string;
    symbol: string;
    unrealizedProfit: string;
  }[];
}

export type SavingsFlexiblePurchaseRecord = {
  amount: string;
  asset: string;
  createTime: number;
  lendingType: string;
  productName: string;
  purchaseId: number;
  status: string;
}[];

export type SavingsFixedActivityPurchaseRecord = {
  amount: string;
  asset: string;
  createTime: number;
  lendingType: string;
  lot: number;
  productName: string;
  purchaseId: number;
  status: string;
}[];

export type SavingsFlexibleRedemptionRecord = {
  amount: string;
  asset: string;
  createTime: number;
  principal: string;
  projectId: string;
  projectName: string;
  status: string;
  type: string;
}[];

export type SavingsFixedActivityRedemptionRecord = {
  amount: string;
  asset: string;
  createTime: number;
  interest: string;
  principal: string;
  projectId: string;
  projectName: string;
  startTime: number;
  status: string;
}[];

export interface BswapAddLiquidityPreviewCombination {
  /** @example USDT */
  quoteAsset: string;

  /** @example BUSD */
  baseAsset: string;

  /**
   * @format int64
   * @example 300000
   */
  quoteAmt: number;

  /**
   * @format int64
   * @example 299975
   */
  baseAmt: number;

  /**
   * @format double
   * @example 1.00008334
   */
  price: number;

  /**
   * @format double
   * @example 1.23
   */
  share: number;
}

export interface BswapAddLiquidityPreviewSingle {
  /** @example USDT */
  quoteAsset: string;

  /**
   * @format int64
   * @example 300000
   */
  quoteAmt: number;

  /**
   * @format double
   * @example 1.00008334
   */
  price: number;

  /**
   * @format double
   * @example 1.23
   */
  share: number;

  /**
   * @format double
   * @example 0.00007245
   */
  slippage: number;

  /**
   * @format double
   * @example 120
   */
  fee: number;
}

export interface BswapRmvLiquidityPreviewCombination {
  /** @example USDT */
  quoteAsset: string;

  /** @example BUSD */
  baseAsset: string;

  /**
   * @format int64
   * @example 300000
   */
  quoteAmt: number;

  /**
   * @format int64
   * @example 299975
   */
  baseAmt: number;

  /**
   * @format double
   * @example 1.00008334
   */
  price: number;
}

export interface BswapRmvLiquidityPreviewSingle {
  /** @example USDT */
  quoteAsset: string;

  /**
   * @format int64
   * @example 300000
   */
  quoteAmt: number;

  /**
   * @format double
   * @example 1.00008334
   */
  price: number;

  /**
   * @format double
   * @example 0.00007245
   */
  slippage: number;

  /**
   * @format double
   * @example 120
   */
  fee: number;
}

export interface Error {
  /**
   * Error code
   * @format int64
   */
  code: number;

  /**
   * Error message
   * @example error message
   */
  msg: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.binance.com";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  private addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  private addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Binance Public Spot API
 * @version 1.0
 * @baseUrl https://api.binance.com
 *
 * OpenAPI Specifications for the Binance Public Spot API
 *
 * API documents:
 *   - [https://github.com/binance/binance-spot-api-docs](https://github.com/binance/binance-spot-api-docs)
 *   - [https://binance-docs.github.io/apidocs/spot/en](https://binance-docs.github.io/apidocs/spot/en)
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Test connectivity to the Rest API. Weight(IP): 1
     *
     * @tags Market
     * @name V3PingList
     * @summary Test Connectivity
     * @request GET:/api/v3/ping
     */
    v3PingList: (params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/v3/ping`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Test connectivity to the Rest API and get the current server time. Weight(IP): 1
     *
     * @tags Market
     * @name V3TimeList
     * @summary Check Server Time
     * @request GET:/api/v3/time
     */
    v3TimeList: (params: RequestParams = {}) =>
      this.request<{ serverTime: number }, any>({
        path: `/api/v3/time`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Current exchange trading rules and symbol information - If any symbol provided in either symbol or symbols do not exist, the endpoint will throw an error. Weight(IP): 10
     *
     * @tags Market
     * @name V3ExchangeInfoList
     * @summary Exchange Information
     * @request GET:/api/v3/exchangeInfo
     */
    v3ExchangeInfoList: (query?: { symbol?: string; arraySymbols?: string }, params: RequestParams = {}) =>
      this.request<
        {
          timezone: string;
          serverTime: number;
          rateLimits: { rateLimitType: string; interval: string; intervalNum: number; limit: number }[];
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
            filters: { filterType: string; minPrice: string; maxPrice: string; tickSize: string }[];
            permissions: string[];
          }[];
        },
        Error
      >({
        path: `/api/v3/exchangeInfo`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description | Limit               | Weight(IP)  | |---------------------|-------------| | 5, 10, 20, 50, 100  | 1           | | 500                 | 5           | | 1000                | 10          | | 5000                | 50          |
     *
     * @tags Market
     * @name V3DepthList
     * @summary Order Book
     * @request GET:/api/v3/depth
     */
    v3DepthList: (
      query: { symbol: string; limit?: 5 | 10 | 20 | 50 | 100 | 500 | 1000 | 5000 },
      params: RequestParams = {},
    ) =>
      this.request<{ lastUpdateId: number; bids: string[][]; asks: string[][] }, Error>({
        path: `/api/v3/depth`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Get recent trades. Weight(IP): 1
     *
     * @tags Market
     * @name V3TradesList
     * @summary Recent Trades List
     * @request GET:/api/v3/trades
     */
    v3TradesList: (query: { symbol: string; limit?: number }, params: RequestParams = {}) =>
      this.request<Trade[], Error>({
        path: `/api/v3/trades`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Get older market trades. Weight(IP): 5
     *
     * @tags Market
     * @name V3HistoricalTradesList
     * @summary Old Trade Lookup
     * @request GET:/api/v3/historicalTrades
     * @secure
     */
    v3HistoricalTradesList: (query: { symbol: string; limit?: number; fromId?: number }, params: RequestParams = {}) =>
      this.request<Trade[], Error>({
        path: `/api/v3/historicalTrades`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get compressed, aggregate trades. Trades that fill at the time, from the same order, with the same price will have the quantity aggregated. - If `startTime` and `endTime` are sent, time between startTime and endTime must be less than 1 hour. - If `fromId`, `startTime`, and `endTime` are not sent, the most recent aggregate trades will be returned. Weight(IP): 1
     *
     * @tags Market
     * @name V3AggTradesList
     * @summary Compressed/Aggregate Trades List
     * @request GET:/api/v3/aggTrades
     */
    v3AggTradesList: (
      query: { symbol: string; fromId?: number; startTime?: number; endTime?: number; limit?: number },
      params: RequestParams = {},
    ) =>
      this.request<AggTrade[], Error>({
        path: `/api/v3/aggTrades`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Kline/candlestick bars for a symbol.\ Klines are uniquely identified by their open time. - If `startTime` and `endTime` are not sent, the most recent klines are returned. Weight(IP): 1
     *
     * @tags Market
     * @name V3KlinesList
     * @summary Kline/Candlestick Data
     * @request GET:/api/v3/klines
     */
    v3KlinesList: (
      query: {
        symbol: string;
        interval:
          | "1m"
          | "3m"
          | "5m"
          | "15m"
          | "30m"
          | "1h"
          | "2h"
          | "4h"
          | "6h"
          | "8h"
          | "12h"
          | "1d"
          | "3d"
          | "1w"
          | "1M";
        startTime?: number;
        endTime?: number;
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<(number | string)[][], Error>({
        path: `/api/v3/klines`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Current average price for a symbol. Weight(IP): 1
     *
     * @tags Market
     * @name V3AvgPriceList
     * @summary Current Average Price
     * @request GET:/api/v3/avgPrice
     */
    v3AvgPriceList: (query: { symbol: string }, params: RequestParams = {}) =>
      this.request<{ mins: number; price: string }, Error>({
        path: `/api/v3/avgPrice`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description 24 hour rolling window price change statistics. Careful when accessing this with no symbol. - If the symbol is not sent, tickers for all symbols will be returned in an array. Weight(IP):\ `1` for a single symbol;\ `40` when the symbol parameter is omitted;
     *
     * @tags Market
     * @name V3Ticker24HrList
     * @summary 24hr Ticker Price Change Statistics
     * @request GET:/api/v3/ticker/24hr
     */
    v3Ticker24HrList: (query?: { symbol?: string }, params: RequestParams = {}) =>
      this.request<Ticker | TickerList, Error>({
        path: `/api/v3/ticker/24hr`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Latest price for a symbol or symbols. - If the symbol is not sent, prices for all symbols will be returned in an array. Weight(IP):\ `1` for a single symbol;\ `2` when the symbol parameter is omitted;
     *
     * @tags Market
     * @name V3TickerPriceList
     * @summary Symbol Price Ticker
     * @request GET:/api/v3/ticker/price
     */
    v3TickerPriceList: (query?: { symbol?: string }, params: RequestParams = {}) =>
      this.request<PriceTicker | PriceTickerList, Error>({
        path: `/api/v3/ticker/price`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Best price/qty on the order book for a symbol or symbols. - If the symbol is not sent, bookTickers for all symbols will be returned in an array. Weight(IP):\ `1` for a single symbol;\ `2` when the symbol parameter is omitted;
     *
     * @tags Market
     * @name V3TickerBookTickerList
     * @summary Symbol Order Book Ticker
     * @request GET:/api/v3/ticker/bookTicker
     */
    v3TickerBookTickerList: (query?: { symbol?: string }, params: RequestParams = {}) =>
      this.request<BookTicker | BookTickerList, Error>({
        path: `/api/v3/ticker/bookTicker`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Test new order creation and signature/recvWindow long. Creates and validates a new order but does not send it into the matching engine. Weight(IP): 1
     *
     * @tags Trade
     * @name V3OrderTestCreate
     * @summary Test New Order (TRADE)
     * @request POST:/api/v3/order/test
     * @secure
     */
    v3OrderTestCreate: (
      query: {
        symbol: string;
        side: "SELL" | "BUY";
        type:
          | "LIMIT"
          | "MARKET"
          | "STOP_LOSS"
          | "STOP_LOSS_LIMIT"
          | "TAKE_PROFIT"
          | "TAKE_PROFIT_LIMIT"
          | "LIMIT_MAKER";
        timeInForce?: "GTC" | "IOC" | "FOK";
        quantity?: number;
        quoteOrderQty?: number;
        price?: number;
        newClientOrderId?: string;
        stopPrice?: number;
        icebergQty?: number;
        newOrderRespType?: "ACK" | "RESULT" | "FULL";
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<object, Error>({
        path: `/api/v3/order/test`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Check an order's status. - Either `orderId` or `origClientOrderId` must be sent. - For some historical orders `cummulativeQuoteQty` will be < 0, meaning the data is not available at this time. Weight(IP): 2
     *
     * @tags Trade
     * @name V3OrderList
     * @summary Query Order (USER_DATA)
     * @request GET:/api/v3/order
     * @secure
     */
    v3OrderList: (
      query: {
        symbol: string;
        orderId?: number;
        origClientOrderId?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<OrderDetails, Error>({
        path: `/api/v3/order`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Send in a new order. - `LIMIT_MAKER` are `LIMIT` orders that will be rejected if they would immediately match and trade as a taker. - `STOP_LOSS` and `TAKE_PROFIT` will execute a `MARKET` order when the `stopPrice` is reached. - Any `LIMIT` or `LIMIT_MAKER` type order can be made an iceberg order by sending an `icebergQty`. - Any order with an `icebergQty` MUST have `timeInForce` set to `GTC`. - `MARKET` orders using `quantity` specifies how much a user wants to buy or sell based on the market price. - `MARKET` orders using `quoteOrderQty` specifies the amount the user wants to spend (when buying) or receive (when selling) of the quote asset; the correct quantity will be determined based on the market liquidity and `quoteOrderQty`. - `MARKET` orders using `quoteOrderQty` will not break `LOT_SIZE` filter rules; the order will execute a quantity that will have the notional value as close as possible to `quoteOrderQty`. - same `newClientOrderId` can be accepted only when the previous one is filled, otherwise the order will be rejected. Trigger order price rules against market price for both `MARKET` and `LIMIT` versions: - Price above market price: `STOP_LOSS` `BUY`, `TAKE_PROFIT` `SELL` - Price below market price: `STOP_LOSS` `SELL`, `TAKE_PROFIT` `BUY` Weight(IP): 1
     *
     * @tags Trade
     * @name V3OrderCreate
     * @summary New Order (TRADE)
     * @request POST:/api/v3/order
     * @secure
     */
    v3OrderCreate: (
      query: {
        symbol: string;
        side: "SELL" | "BUY";
        type:
          | "LIMIT"
          | "MARKET"
          | "STOP_LOSS"
          | "STOP_LOSS_LIMIT"
          | "TAKE_PROFIT"
          | "TAKE_PROFIT_LIMIT"
          | "LIMIT_MAKER";
        timeInForce?: "GTC" | "IOC" | "FOK";
        quantity?: number;
        quoteOrderQty?: number;
        price?: number;
        newClientOrderId?: string;
        stopPrice?: number;
        icebergQty?: number;
        newOrderRespType?: "ACK" | "RESULT" | "FULL";
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<OrderResponseAck | OrderResponseResult | OrderResponseFull, Error>({
        path: `/api/v3/order`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cancel an active order. Either `orderId` or `origClientOrderId` must be sent. Weight(IP): 1
     *
     * @tags Trade
     * @name V3OrderDelete
     * @summary Cancel Order (TRADE)
     * @request DELETE:/api/v3/order
     * @secure
     */
    v3OrderDelete: (
      query: {
        symbol: string;
        orderId?: number;
        origClientOrderId?: string;
        newClientOrderId?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Order, Error>({
        path: `/api/v3/order`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get all open orders on a symbol. Careful when accessing this with no symbol. Weight(IP):\ `3` for a single symbol;\ `40` when the symbol parameter is omitted;
     *
     * @tags Trade
     * @name V3OpenOrdersList
     * @summary Current Open Orders (USER_DATA)
     * @request GET:/api/v3/openOrders
     * @secure
     */
    v3OpenOrdersList: (
      query: { symbol?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<OrderDetails[], Error>({
        path: `/api/v3/openOrders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cancels all active orders on a symbol.\ This includes OCO orders. Weight(IP): 1
     *
     * @tags Trade
     * @name V3OpenOrdersDelete
     * @summary Cancel all Open Orders on a Symbol (TRADE)
     * @request DELETE:/api/v3/openOrders
     * @secure
     */
    v3OpenOrdersDelete: (
      query: { symbol: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<(Order | OcoOrder | (Order & OcoOrder))[], Error>({
        path: `/api/v3/openOrders`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get all account orders; active, canceled, or filled.. - If `orderId` is set, it will get orders >= that `orderId`. Otherwise most recent orders are returned. - For some historical orders `cummulativeQuoteQty` will be < 0, meaning the data is not available at this time. - If `startTime` and/or `endTime` provided, `orderId` is not required Weight(IP): 10
     *
     * @tags Trade
     * @name V3AllOrdersList
     * @summary All Orders (USER_DATA)
     * @request GET:/api/v3/allOrders
     * @secure
     */
    v3AllOrdersList: (
      query: {
        symbol: string;
        orderId?: number;
        startTime?: number;
        endTime?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<OrderDetails[], Error>({
        path: `/api/v3/allOrders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Send in a new OCO - Price Restrictions: - `SELL`: Limit Price > Last Price > Stop Price - `BUY`: Limit Price < Last Price < Stop Price - Quantity Restrictions: - Both legs must have the same quantity - `ICEBERG` quantities however do not have to be the same - Order Rate Limit - `OCO` counts as 2 orders against the order rate limit. Weight(IP): 1
     *
     * @tags Trade
     * @name V3OrderOcoCreate
     * @summary New OCO (TRADE)
     * @request POST:/api/v3/order/oco
     * @secure
     */
    v3OrderOcoCreate: (
      query: {
        symbol: string;
        listClientOrderId?: string;
        side: "SELL" | "BUY";
        quantity: number;
        limitClientOrderId?: string;
        price: number;
        limitIcebergQty?: number;
        stopClientOrderId?: string;
        stopPrice: number;
        stopLimitPrice?: number;
        stopIcebergQty?: number;
        stopLimitTimeInForce?: "GTC" | "FOK" | "IOC";
        newOrderRespType?: "ACK" | "RESULT" | "FULL";
        sideEffectType?: "NO_SIDE_EFFECT" | "MARGIN_BUY" | "AUTO_REPAY";
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          orderListId: number;
          contingencyType: string;
          listStatusType: string;
          listOrderStatus: string;
          listClientOrderId: string;
          transactionTime: number;
          symbol: string;
          orders: { symbol: string; orderId: number; clientOrderId: string }[];
          orderReports: {
            symbol: string;
            orderId: number;
            orderListId: number;
            clientOrderId: string;
            transactTime: number;
            price: string;
            origQty: string;
            executedQty: string;
            cummulativeQuoteQty: string;
            status: string;
            timeInForce: string;
            type: string;
            side: string;
            stopPrice: string;
          }[];
        },
        Error
      >({
        path: `/api/v3/order/oco`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a specific OCO based on provided optional parameters Weight(IP): 2
     *
     * @tags Trade
     * @name V3OrderListList
     * @summary Query OCO (USER_DATA)
     * @request GET:/api/v3/orderList
     * @secure
     */
    v3OrderListList: (
      query: {
        orderListId?: number;
        origClientOrderId?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          orderListId: number;
          contingencyType: string;
          listStatusType: string;
          listOrderStatus: string;
          listClientOrderId: string;
          transactionTime: number;
          symbol: string;
          orders: { symbol: string; orderId: number; clientOrderId: string }[];
        },
        Error
      >({
        path: `/api/v3/orderList`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cancel an entire Order List Canceling an individual leg will cancel the entire OCO Weight(IP): 1
     *
     * @tags Trade
     * @name V3OrderListDelete
     * @summary Cancel OCO (TRADE)
     * @request DELETE:/api/v3/orderList
     * @secure
     */
    v3OrderListDelete: (
      query: {
        symbol: string;
        orderListId?: number;
        listClientOrderId?: string;
        newClientOrderId?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<OcoOrder, Error>({
        path: `/api/v3/orderList`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves all OCO based on provided optional parameters Weight(IP): 10
     *
     * @tags Trade
     * @name V3AllOrderListList
     * @summary Query all OCO (USER_DATA)
     * @request GET:/api/v3/allOrderList
     * @secure
     */
    v3AllOrderListList: (
      query: {
        fromId?: number;
        startTime?: number;
        endTime?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          orderListId: number;
          contingencyType: string;
          listStatusType: string;
          listOrderStatus: string;
          listClientOrderId: string;
          transactionTime: number;
          symbol: string;
          isIsolated: boolean;
          orders: { symbol: string; orderId: number; clientOrderId: string }[];
        }[],
        Error
      >({
        path: `/api/v3/allOrderList`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 3
     *
     * @tags Trade
     * @name V3OpenOrderListList
     * @summary Query Open OCO (USER_DATA)
     * @request GET:/api/v3/openOrderList
     * @secure
     */
    v3OpenOrderListList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          orderListId: number;
          contingencyType: string;
          listStatusType: string;
          listOrderStatus: string;
          listClientOrderId: string;
          transactionTime: number;
          symbol: string;
          orders: { symbol: string; orderId: number; clientOrderId: string }[];
        }[],
        Error
      >({
        path: `/api/v3/openOrderList`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get current account information. Weight(IP): 10
     *
     * @tags Trade
     * @name V3AccountList
     * @summary Account Information (USER_DATA)
     * @request GET:/api/v3/account
     * @secure
     */
    v3AccountList: (query: { recvWindow?: number; timestamp: number; signature: string }, params: RequestParams = {}) =>
      this.request<Account, Error>({
        path: `/api/v3/account`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get trades for a specific account and symbol. If `fromId` is set, it will get id >= that `fromId`. Otherwise most recent orders are returned. Weight(IP): 10
     *
     * @tags Trade
     * @name V3MyTradesList
     * @summary Account Trade List (USER_DATA)
     * @request GET:/api/v3/myTrades
     * @secure
     */
    v3MyTradesList: (
      query: {
        symbol: string;
        orderId?: number;
        startTime?: number;
        endTime?: number;
        fromId?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MyTrade[], Error>({
        path: `/api/v3/myTrades`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Displays the user's current order count usage for all intervals. Weight(IP): 20
     *
     * @tags Trade
     * @name V3RateLimitOrderList
     * @summary Query Current Order Count Usage (TRADE)
     * @request GET:/api/v3/rateLimit/order
     * @secure
     */
    v3RateLimitOrderList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        { rateLimitType: string; interval: string; intervalNum: number; limit: number; count?: number }[],
        Error
      >({
        path: `/api/v3/rateLimit/order`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Start a new user data stream. The stream will close after 60 minutes unless a keepalive is sent. If the account has an active `listenKey`, that `listenKey` will be returned and its validity will be extended for 60 minutes. Weight: 1
     *
     * @tags Stream
     * @name V3UserDataStreamCreate
     * @summary Create a ListenKey (USER_STREAM)
     * @request POST:/api/v3/userDataStream
     * @secure
     */
    v3UserDataStreamCreate: (params: RequestParams = {}) =>
      this.request<{ listenKey: string }, any>({
        path: `/api/v3/userDataStream`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Keepalive a user data stream to prevent a time out. User data streams will close after 60 minutes. It's recommended to send a ping about every 30 minutes. Weight: 1
     *
     * @tags Stream
     * @name V3UserDataStreamUpdate
     * @summary Ping/Keep-alive a ListenKey (USER_STREAM)
     * @request PUT:/api/v3/userDataStream
     * @secure
     */
    v3UserDataStreamUpdate: (query?: { listenKey?: string }, params: RequestParams = {}) =>
      this.request<object, Error>({
        path: `/api/v3/userDataStream`,
        method: "PUT",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Close out a user data stream. Weight: 1
     *
     * @tags Stream
     * @name V3UserDataStreamDelete
     * @summary Close a ListenKey (USER_STREAM)
     * @request DELETE:/api/v3/userDataStream
     * @secure
     */
    v3UserDataStreamDelete: (query?: { listenKey?: string }, params: RequestParams = {}) =>
      this.request<object, Error>({
        path: `/api/v3/userDataStream`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  sapi = {
    /**
     * @description Execute transfer between spot account and cross margin account. Weight(IP): 600
     *
     * @tags Margin
     * @name V1MarginTransferCreate
     * @summary Cross Margin Account Transfer (MARGIN)
     * @request POST:/sapi/v1/margin/transfer
     * @secure
     */
    v1MarginTransferCreate: (
      query: { asset: string; amount: number; type?: 1 | 2; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<Transaction, Error>({
        path: `/sapi/v1/margin/transfer`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - Response in descending order - Returns data for last 7 days by default - Set `archived` to `true` to query data from 6 months ago Weight(IP): 1
     *
     * @tags Margin
     * @name V1MarginTransferList
     * @summary Get Cross Margin Transfer History (USER_DATA)
     * @request GET:/sapi/v1/margin/transfer
     * @secure
     */
    v1MarginTransferList: (
      query: {
        asset?: string;
        type?: "ROLL_IN" | "ROLL_OUT";
        startTime?: number;
        endTime?: number;
        current?: number;
        size?: number;
        archived?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: { amount: string; asset: string; status: string; timestamp: number; txId: number; type: string }[];
          total: number;
        },
        Error
      >({
        path: `/sapi/v1/margin/transfer`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Apply for a loan. - If "isIsolated" = "TRUE", "symbol" must be sent - "isIsolated" = "FALSE" for crossed margin loan Weight(UID): 3000
     *
     * @tags Margin
     * @name V1MarginLoanCreate
     * @summary Margin Account Borrow (MARGIN)
     * @request POST:/sapi/v1/margin/loan
     * @secure
     */
    v1MarginLoanCreate: (
      query: {
        asset: string;
        isIsolated?: "TRUE" | "FALSE";
        symbol?: string;
        amount: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Transaction, Error>({
        path: `/sapi/v1/margin/loan`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - `txId` or `startTime` must be sent. `txId` takes precedence. - Response in descending order - If `isolatedSymbol` is not sent, crossed margin data will be returned - Set `archived` to `true` to query data from 6 months ago Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginLoanList
     * @summary Query Loan Record (USER_DATA)
     * @request GET:/sapi/v1/margin/loan
     * @secure
     */
    v1MarginLoanList: (
      query: {
        asset: string;
        isolatedSymbol?: string;
        txId?: number;
        startTime?: number;
        endTime?: number;
        current?: number;
        size?: number;
        archived?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: {
            isolatedSymbol: string;
            txId: number;
            asset: string;
            principal: string;
            timestamp: number;
            status: string;
          }[];
          total: number;
        },
        Error
      >({
        path: `/sapi/v1/margin/loan`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Repay loan for margin account. - If "isIsolated" = "TRUE", "symbol" must be sent - "isIsolated" = "FALSE" for crossed margin repay Weight(IP): 3000
     *
     * @tags Margin
     * @name V1MarginRepayCreate
     * @summary Margin Account Repay (MARGIN)
     * @request POST:/sapi/v1/margin/repay
     * @secure
     */
    v1MarginRepayCreate: (
      query: {
        asset: string;
        isIsolated?: "TRUE" | "FALSE";
        symbol?: string;
        amount: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Transaction, Error>({
        path: `/sapi/v1/margin/repay`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - `txId` or `startTime` must be sent. `txId` takes precedence. - Response in descending order - If `isolatedSymbol` is not sent, crossed margin data will be returned - Set `archived` to `true` to query data from 6 months ago Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginRepayList
     * @summary Query Repay Record (USER_DATA)
     * @request GET:/sapi/v1/margin/repay
     * @secure
     */
    v1MarginRepayList: (
      query: {
        asset: string;
        isolatedSymbol?: string;
        txId?: number;
        startTime?: number;
        endTime?: number;
        current?: number;
        size?: number;
        archived?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: {
            isolatedSymbol: string;
            amount: string;
            asset: string;
            interest: string;
            principal: string;
            status: string;
            timestamp: number;
            txId: number;
          }[];
          total: number;
        },
        Error
      >({
        path: `/sapi/v1/margin/repay`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginAssetList
     * @summary Query Margin Asset (MARKET_DATA)
     * @request GET:/sapi/v1/margin/asset
     * @secure
     */
    v1MarginAssetList: (query: { asset: string }, params: RequestParams = {}) =>
      this.request<
        {
          assetFullName: string;
          assetName: string;
          isBorrowable: boolean;
          isMortgageable: boolean;
          userMinBorrow: string;
          userMinRepay: string;
        },
        Error
      >({
        path: `/sapi/v1/margin/asset`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginPairList
     * @summary Query Cross Margin Pair (MARKET_DATA)
     * @request GET:/sapi/v1/margin/pair
     * @secure
     */
    v1MarginPairList: (query: { symbol: string }, params: RequestParams = {}) =>
      this.request<
        {
          id: number;
          symbol: string;
          base: string;
          quote: string;
          isMarginTrade: boolean;
          isBuyAllowed: boolean;
          isSellAllowed: boolean;
        },
        Error
      >({
        path: `/sapi/v1/margin/pair`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Margin
     * @name V1MarginAllAssetsList
     * @summary Get All Margin Assets (MARKET_DATA)
     * @request GET:/sapi/v1/margin/allAssets
     * @secure
     */
    v1MarginAllAssetsList: (params: RequestParams = {}) =>
      this.request<
        {
          assetFullName: string;
          assetName: string;
          isBorrowable: boolean;
          isMortgageable: boolean;
          userMinBorrow: string;
          userMinRepay: string;
        }[],
        Error
      >({
        path: `/sapi/v1/margin/allAssets`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Margin
     * @name V1MarginAllPairsList
     * @summary Get All Cross Margin Pairs (MARKET_DATA)
     * @request GET:/sapi/v1/margin/allPairs
     * @secure
     */
    v1MarginAllPairsList: (params: RequestParams = {}) =>
      this.request<
        {
          base: string;
          id: number;
          isBuyAllowed: boolean;
          isMarginTrade: boolean;
          isSellAllowed: boolean;
          quote: string;
          symbol: string;
        }[],
        Error
      >({
        path: `/sapi/v1/margin/allPairs`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginPriceIndexList
     * @summary Query Margin PriceIndex (MARKET_DATA)
     * @request GET:/sapi/v1/margin/priceIndex
     * @secure
     */
    v1MarginPriceIndexList: (query: { symbol: string }, params: RequestParams = {}) =>
      this.request<{ calcTime: number; price: string; symbol: string }, Error>({
        path: `/sapi/v1/margin/priceIndex`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - Either `orderId` or `origClientOrderId` must be sent. - For some historical orders `cummulativeQuoteQty` will be < 0, meaning the data is not available at this time. Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginOrderList
     * @summary Query Margin Account's Order (USER_DATA)
     * @request GET:/sapi/v1/margin/order
     * @secure
     */
    v1MarginOrderList: (
      query: {
        symbol: string;
        isIsolated?: "TRUE" | "FALSE";
        orderId?: number;
        origClientOrderId?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarginOrderDetail, Error>({
        path: `/sapi/v1/margin/order`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Post a new order for margin account. Weight(UID): 6
     *
     * @tags Margin
     * @name V1MarginOrderCreate
     * @summary Margin Account New Order (TRADE)
     * @request POST:/sapi/v1/margin/order
     * @secure
     */
    v1MarginOrderCreate: (
      query: {
        symbol: string;
        isIsolated?: "TRUE" | "FALSE";
        side: "SELL" | "BUY";
        type:
          | "LIMIT"
          | "MARKET"
          | "STOP_LOSS"
          | "STOP_LOSS_LIMIT"
          | "TAKE_PROFIT"
          | "TAKE_PROFIT_LIMIT"
          | "LIMIT_MAKER";
        quantity: number;
        quoteOrderQty?: number;
        price?: number;
        stopPrice?: number;
        newClientOrderId?: string;
        icebergQty?: number;
        newOrderRespType?: "ACK" | "RESULT" | "FULL";
        sideEffectType?: "NO_SIDE_EFFECT" | "MARGIN_BUY" | "AUTO_REPAY";
        timeInForce?: "GTC" | "IOC" | "FOK";
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarginOrderResponseAck | MarginOrderResponseResult | MarginOrderResponseFull, Error>({
        path: `/sapi/v1/margin/order`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cancel an active order for margin account. Either `orderId` or `origClientOrderId` must be sent. Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginOrderDelete
     * @summary Margin Account Cancel Order (TRADE)
     * @request DELETE:/sapi/v1/margin/order
     * @secure
     */
    v1MarginOrderDelete: (
      query: {
        symbol: string;
        isIsolated?: "TRUE" | "FALSE";
        orderId?: number;
        origClientOrderId?: string;
        newClientOrderId?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarginOrder, Error>({
        path: `/sapi/v1/margin/order`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - Response in descending order - If `isolatedSymbol` is not sent, crossed margin data will be returned - Set `archived` to `true` to query data from 6 months ago - `type` in response has 4 enums: - `PERIODIC` interest charged per hour - `ON_BORROW` first interest charged on borrow - `PERIODIC_CONVERTED` interest charged per hour converted into BNB - `ON_BORROW_CONVERTED` first interest charged on borrow converted into BNB Weight(IP): 1
     *
     * @tags Margin
     * @name V1MarginInterestHistoryList
     * @summary Get Interest History (USER_DATA)
     * @request GET:/sapi/v1/margin/interestHistory
     * @secure
     */
    v1MarginInterestHistoryList: (
      query: {
        asset?: string;
        isolatedSymbol?: string;
        startTime?: number;
        endTime?: number;
        current?: number;
        size?: number;
        archived?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: {
            isolatedSymbol: string;
            asset: string;
            interest: string;
            interestAccuredTime: number;
            interestRate: string;
            principal: string;
            type: string;
          }[];
          total: number;
        },
        Error
      >({
        path: `/sapi/v1/margin/interestHistory`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - Response in descending order Weight(IP): 1
     *
     * @tags Margin
     * @name V1MarginForceLiquidationRecList
     * @summary Get Force Liquidation Record (USER_DATA)
     * @request GET:/sapi/v1/margin/forceLiquidationRec
     * @secure
     */
    v1MarginForceLiquidationRecList: (
      query: {
        startTime?: number;
        endTime?: number;
        isolatedSymbol?: string;
        current?: number;
        size?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: {
            avgPrice: string;
            executedQty: string;
            orderId: number;
            price: string;
            qty: string;
            side: string;
            symbol: string;
            timeInForce: string;
            isIsolated: boolean;
            updatedTime: number;
          }[];
          total: number;
        },
        Error
      >({
        path: `/sapi/v1/margin/forceLiquidationRec`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginAccountList
     * @summary Query Cross Margin Account Details (USER_DATA)
     * @request GET:/sapi/v1/margin/account
     * @secure
     */
    v1MarginAccountList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          borrowEnabled: boolean;
          marginLevel: string;
          totalAssetOfBtc: string;
          totalLiabilityOfBtc: string;
          totalNetAssetOfBtc: string;
          tradeEnabled: boolean;
          transferEnabled: boolean;
          userAssets: {
            asset: string;
            borrowed: string;
            free: string;
            interest: string;
            locked: string;
            netAsset: string;
          }[];
        },
        Error
      >({
        path: `/sapi/v1/margin/account`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If the `symbol` is not sent, orders for all symbols will be returned in an array. - When all symbols are returned, the number of requests counted against the rate limiter is equal to the number of symbols currently trading on the exchange - If isIsolated ="TRUE", symbol must be sent. Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginOpenOrdersList
     * @summary Query Margin Account's Open Orders (USER_DATA)
     * @request GET:/sapi/v1/margin/openOrders
     * @secure
     */
    v1MarginOpenOrdersList: (
      query: {
        symbol?: string;
        isIsolated?: "TRUE" | "FALSE";
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarginOrderDetail[], Error>({
        path: `/sapi/v1/margin/openOrders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - Cancels all active orders on a symbol for margin account. - This includes OCO orders. Weight(IP): 1
     *
     * @tags Margin
     * @name V1MarginOpenOrdersDelete
     * @summary Margin Account Cancel all Open Orders on a Symbol (TRADE)
     * @request DELETE:/sapi/v1/margin/openOrders
     * @secure
     */
    v1MarginOpenOrdersDelete: (
      query: {
        symbol: string;
        isIsolated?: "TRUE" | "FALSE";
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        (CanceledMarginOrderDetail | MarginOcoOrder | (CanceledMarginOrderDetail & MarginOcoOrder))[],
        Error
      >({
        path: `/sapi/v1/margin/openOrders`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If `orderId` is set, it will get orders >= that orderId. Otherwise most recent orders are returned. - For some historical orders `cummulativeQuoteQty` will be < 0, meaning the data is not available at this time. Weight(IP): 200 Request Limit: 60 times/min per IP
     *
     * @tags Margin
     * @name V1MarginAllOrdersList
     * @summary Query Margin Account's All Orders (USER_DATA)
     * @request GET:/sapi/v1/margin/allOrders
     * @secure
     */
    v1MarginAllOrdersList: (
      query: {
        symbol: string;
        isIsolated?: "TRUE" | "FALSE";
        orderId?: number;
        startTime?: number;
        endTime?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarginOrderDetail[], Error>({
        path: `/sapi/v1/margin/allOrders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Send in a new OCO for a margin account - Price Restrictions: - SELL: Limit Price > Last Price > Stop Price - BUY: Limit Price < Last Price < Stop Price - Quantity Restrictions: - Both legs must have the same quantity - ICEBERG quantities however do not have to be the same. - Order Rate Limit - OCO counts as 2 orders against the order rate limit. Weight(UID): 6
     *
     * @tags Margin
     * @name V1MarginOrderOcoCreate
     * @summary Margin Account New OCO (TRADE)
     * @request POST:/sapi/v1/margin/order/oco
     * @secure
     */
    v1MarginOrderOcoCreate: (
      query: {
        symbol: string;
        isIsolated?: "TRUE" | "FALSE";
        listClientOrderId?: string;
        side: "SELL" | "BUY";
        quantity: number;
        limitClientOrderId?: string;
        price: number;
        limitIcebergQty?: number;
        stopClientOrderId?: string;
        stopPrice: number;
        stopLimitPrice?: number;
        stopIcebergQty?: number;
        stopLimitTimeInForce?: "GTC" | "FOK" | "IOC";
        newOrderRespType?: "ACK" | "RESULT" | "FULL";
        sideEffectType?: "NO_SIDE_EFFECT" | "MARGIN_BUY" | "AUTO_REPAY";
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          orderListId: number;
          contingencyType: string;
          listStatusType: string;
          listOrderStatus: string;
          listClientOrderId: string;
          transactionTime: number;
          symbol: string;
          marginBuyBorrowAmount: string;
          marginBuyBorrowAsset: string;
          isIsolated: boolean;
          orders: { symbol: string; orderId: number; clientOrderId: string }[];
          orderReports: {
            symbol: string;
            orderId: number;
            orderListId: number;
            clientOrderId: string;
            transactTime: number;
            price: string;
            origQty: string;
            executedQty: string;
            cummulativeQuoteQty: string;
            status: string;
            timeInForce: string;
            type: string;
            side: string;
            stopPrice: string;
          }[];
        },
        Error
      >({
        path: `/sapi/v1/margin/order/oco`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a specific OCO based on provided optional parameters - Either `orderListId` or `origClientOrderId` must be provided Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginOrderListList
     * @summary Query Margin Account's OCO (USER_DATA)
     * @request GET:/sapi/v1/margin/orderList
     * @secure
     */
    v1MarginOrderListList: (
      query: {
        isIsolated?: "TRUE" | "FALSE";
        symbol?: string;
        orderListId?: number;
        origClientOrderId?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          orderListId: number;
          contingencyType: string;
          listStatusType: string;
          listOrderStatus: string;
          listClientOrderId: string;
          transactionTime: number;
          symbol: string;
          isIsolated: boolean;
          orders: { symbol: string; orderId: number; clientOrderId: string }[];
        },
        Error
      >({
        path: `/sapi/v1/margin/orderList`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cancel an entire Order List for a margin account - Canceling an individual leg will cancel the entire OCO - Either `orderListId` or `listClientOrderId` must be provided Weight(UID): 1
     *
     * @tags Margin
     * @name V1MarginOrderListDelete
     * @summary Margin Account Cancel OCO (TRADE)
     * @request DELETE:/sapi/v1/margin/orderList
     * @secure
     */
    v1MarginOrderListDelete: (
      query: {
        symbol: string;
        isIsolated?: "TRUE" | "FALSE";
        orderListId?: number;
        listClientOrderId?: string;
        newClientOrderId?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarginOcoOrder, Error>({
        path: `/sapi/v1/margin/orderList`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves all OCO for a specific margin account based on provided optional parameters Weight(IP): 200
     *
     * @tags Margin
     * @name V1MarginAllOrderListList
     * @summary Query Margin Account's all OCO (USER_DATA)
     * @request GET:/sapi/v1/margin/allOrderList
     * @secure
     */
    v1MarginAllOrderListList: (
      query: {
        isIsolated?: "TRUE" | "FALSE";
        symbol?: string;
        fromId?: string;
        startTime?: number;
        endTime?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          orderListId: number;
          contingencyType: string;
          listStatusType: string;
          listOrderStatus: string;
          listClientOrderId: string;
          transactionTime: number;
          symbol: string;
          isIsolated: boolean;
          orders: { symbol: string; orderId: number; clientOrderId: string }[];
        }[],
        Error
      >({
        path: `/sapi/v1/margin/allOrderList`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginOpenOrderListList
     * @summary Query Margin Account's Open OCO (USER_DATA)
     * @request GET:/sapi/v1/margin/openOrderList
     * @secure
     */
    v1MarginOpenOrderListList: (
      query: {
        isIsolated?: "TRUE" | "FALSE";
        symbol?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          orderListId: number;
          contingencyType: string;
          listStatusType: string;
          listOrderStatus: string;
          listClientOrderId: string;
          transactionTime: number;
          symbol: string;
          isIsolated: boolean;
          orders: { symbol: string; orderId: number; clientOrderId: string }[];
        }[],
        Error
      >({
        path: `/sapi/v1/margin/openOrderList`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If `fromId` is set, it will get orders >= that `fromId`. Otherwise most recent trades are returned. Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginMyTradesList
     * @summary Query Margin Account's Trade List (USER_DATA)
     * @request GET:/sapi/v1/margin/myTrades
     * @secure
     */
    v1MarginMyTradesList: (
      query: {
        symbol: string;
        isIsolated?: "TRUE" | "FALSE";
        startTime?: number;
        endTime?: number;
        fromId?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarginTrade[], Error>({
        path: `/sapi/v1/margin/myTrades`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If `isolatedSymbol` is not sent, crossed margin data will be sent. - `borrowLimit` is also available from https://www.binance.com/en/margin-fee Weight(IP): 50
     *
     * @tags Margin
     * @name V1MarginMaxBorrowableList
     * @summary Query Max Borrow (USER_DATA)
     * @request GET:/sapi/v1/margin/maxBorrowable
     * @secure
     */
    v1MarginMaxBorrowableList: (
      query: { asset: string; isolatedSymbol?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ amount: string; borrowLimit: string }, Error>({
        path: `/sapi/v1/margin/maxBorrowable`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If `isolatedSymbol` is not sent, crossed margin data will be sent. Weight(IP): 50
     *
     * @tags Margin
     * @name V1MarginMaxTransferableList
     * @summary Query Max Transfer-Out Amount (USER_DATA)
     * @request GET:/sapi/v1/margin/maxTransferable
     * @secure
     */
    v1MarginMaxTransferableList: (
      query: { asset: string; isolatedSymbol?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ amount: string; borrowLimit: string }, Error>({
        path: `/sapi/v1/margin/maxTransferable`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Margin
     * @name V1MarginIsolatedTransferList
     * @summary Get Isolated Margin Transfer History (USER_DATA)
     * @request GET:/sapi/v1/margin/isolated/transfer
     * @secure
     */
    v1MarginIsolatedTransferList: (
      query: {
        asset?: string;
        symbol: string;
        transFrom?: "SPOT" | "ISOLATED_MARGIN";
        transTo?: "SPOT" | "ISOLATED_MARGIN";
        startTime?: number;
        endTime?: number;
        current?: number;
        size?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarginTransferDetails, Error>({
        path: `/sapi/v1/margin/isolated/transfer`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(UID): 600
     *
     * @tags Margin
     * @name V1MarginIsolatedTransferCreate
     * @summary Isolated Margin Account Transfer (MARGIN)
     * @request POST:/sapi/v1/margin/isolated/transfer
     * @secure
     */
    v1MarginIsolatedTransferCreate: (
      query: {
        asset: string;
        symbol: string;
        transFrom?: "SPOT" | "ISOLATED_MARGIN";
        transTo?: "SPOT" | "ISOLATED_MARGIN";
        amount: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<object, Error>({
        path: `/sapi/v1/margin/isolated/transfer`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If "symbols" is not sent, all isolated assets will be returned. - If "symbols" is sent, only the isolated assets of the sent symbols will be returned. Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginIsolatedAccountList
     * @summary Query Isolated Margin Account Info (USER_DATA)
     * @request GET:/sapi/v1/margin/isolated/account
     * @secure
     */
    v1MarginIsolatedAccountList: (
      query: { symbols?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<IsolatedMarginAccountInfo, Error>({
        path: `/sapi/v1/margin/isolated/account`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Disable isolated margin account for a specific symbol. Each trading pair can only be deactivated once every 24 hours . Weight(UID): 300
     *
     * @tags Margin
     * @name V1MarginIsolatedAccountDelete
     * @summary Disable Isolated Margin Account (TRADE)
     * @request DELETE:/sapi/v1/margin/isolated/account
     * @secure
     */
    v1MarginIsolatedAccountDelete: (
      query: { symbol: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ success: boolean; symbol: string }, Error>({
        path: `/sapi/v1/margin/isolated/account`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Enable isolated margin account for a specific symbol. Weight(UID): 300
     *
     * @tags Margin
     * @name V1MarginIsolatedAccountCreate
     * @summary Enable Isolated Margin Account (TRADE)
     * @request POST:/sapi/v1/margin/isolated/account
     * @secure
     */
    v1MarginIsolatedAccountCreate: (
      query: { symbol: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ success: boolean; symbol: string }, Error>({
        path: `/sapi/v1/margin/isolated/account`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Query enabled isolated margin account limit. Weight(IP): 1
     *
     * @tags Margin
     * @name V1MarginIsolatedAccountLimitList
     * @summary Query Enabled Isolated Margin Account Limit (USER_DATA)
     * @request GET:/sapi/v1/margin/isolated/accountLimit
     * @secure
     */
    v1MarginIsolatedAccountLimitList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ enabledAccount: number; maxAccount: number }, Error>({
        path: `/sapi/v1/margin/isolated/accountLimit`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginIsolatedPairList
     * @summary Query Isolated Margin Symbol (USER_DATA)
     * @request GET:/sapi/v1/margin/isolated/pair
     * @secure
     */
    v1MarginIsolatedPairList: (
      query: { symbol: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          symbol: string;
          base: string;
          quote: string;
          isMarginTrade: boolean;
          isBuyAllowed: boolean;
          isSellAllowed: boolean;
        },
        Error
      >({
        path: `/sapi/v1/margin/isolated/pair`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Margin
     * @name V1MarginIsolatedAllPairsList
     * @summary Get All Isolated Margin Symbol(USER_DATA)
     * @request GET:/sapi/v1/margin/isolated/allPairs
     * @secure
     */
    v1MarginIsolatedAllPairsList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          symbol: string;
          base: string;
          quote: string;
          isMarginTrade: boolean;
          isBuyAllowed: boolean;
          isSellAllowed: boolean;
        }[],
        Error
      >({
        path: `/sapi/v1/margin/isolated/allPairs`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - "spotBNBBurn" and "interestBNBBurn" should be sent at least one. Weight(IP): 1
     *
     * @tags Margin
     * @name V1BnbBurnCreate
     * @summary Toggle BNB Burn On Spot Trade And Margin Interest (USER_DATA)
     * @request POST:/sapi/v1/bnbBurn
     * @secure
     */
    v1BnbBurnCreate: (
      query: {
        spotBNBBurn?: "true" | "false";
        interestBNBBurn?: "true" | "false";
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BnbBurnStatus, Error>({
        path: `/sapi/v1/bnbBurn`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Margin
     * @name V1BnbBurnList
     * @summary Get All Isolated Margin Symbol(USER_DATA)
     * @request GET:/sapi/v1/bnbBurn
     * @secure
     */
    v1BnbBurnList: (query: { recvWindow?: number; timestamp: number; signature: string }, params: RequestParams = {}) =>
      this.request<BnbBurnStatus, Error>({
        path: `/sapi/v1/bnbBurn`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description The max interval between startTime and endTime is 30 days. Weight(IP): 1
     *
     * @tags Margin
     * @name V1MarginInterestRateHistoryList
     * @summary Margin Interest Rate History (USER_DATA)
     * @request GET:/sapi/v1/margin/interestRateHistory
     * @secure
     */
    v1MarginInterestRateHistoryList: (
      query: {
        asset: string;
        vipLevel?: number;
        startTime?: number;
        endTime?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ asset: string; dailyInterestRate: string; timestamp: number; vipLevel: number }[], Error>({
        path: `/sapi/v1/margin/interestRateHistory`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get cross margin fee data collection with any vip level or user's current specific data as https://www.binance.com/en/margin-fee Weight(IP): 1 when coin is specified; 5 when the coin parameter is omitted
     *
     * @tags Margin
     * @name V1MarginCrossMarginDataList
     * @summary Query Cross Margin Fee Data (USER_DATA)
     * @request GET:/sapi/v1/margin/crossMarginData
     * @secure
     */
    v1MarginCrossMarginDataList: (
      query: { vipLevel?: number; coin?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          vipLevel: number;
          coin: string;
          transferIn: boolean;
          borrowable: boolean;
          dailyInterest: string;
          yearlyInterest: string;
          borrowLimit: string;
          marginablePairs: string[];
        }[],
        Error
      >({
        path: `/sapi/v1/margin/crossMarginData`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get isolated margin fee data collection with any vip level or user's current specific data as https://www.binance.com/en/margin-fee Weight(IP): 1 when a single is specified; 10 when the symbol parameter is omitted
     *
     * @tags Margin
     * @name V1MarginIsolatedMarginDataList
     * @summary Query Isolated Margin Fee Data (USER_DATA)
     * @request GET:/sapi/v1/margin/isolatedMarginData
     * @secure
     */
    v1MarginIsolatedMarginDataList: (
      query: { vipLevel?: number; symbol?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          vipLevel?: number;
          symbol?: string;
          leverage?: string;
          data?: { coin?: string; dailyInterest?: string; borrowLimit?: string }[];
        }[],
        Error
      >({
        path: `/sapi/v1/margin/isolatedMarginData`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get isolated margin tier data collection with any tier as https://www.binance.com/en/margin-data Weight(IP): 1
     *
     * @tags Margin
     * @name V1MarginIsolatedMarginTierList
     * @summary Query Isolated Margin Tier Data (USER_DATA)
     * @request GET:/sapi/v1/margin/isolatedMarginTier
     * @secure
     */
    v1MarginIsolatedMarginTierList: (
      query: { symbol: string; tier?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          symbol?: string;
          tier?: number;
          effectiveMultiple?: string;
          initialRiskRatio?: string;
          liquidationRiskRatio?: string;
          baseAssetMaxBorrowable?: string;
          quoteAssetMaxBorrowable?: string;
        }[],
        Error
      >({
        path: `/sapi/v1/margin/isolatedMarginTier`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch system status. Weight(IP): 1
     *
     * @tags Wallet
     * @name V1SystemStatusList
     * @summary System Status (System)
     * @request GET:/sapi/v1/system/status
     */
    v1SystemStatusList: (params: RequestParams = {}) =>
      this.request<{ status: number; msg: string }, any>({
        path: `/sapi/v1/system/status`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Get information of coins (available for deposit and withdraw) for user. Weight(IP): 10
     *
     * @tags Wallet
     * @name V1CapitalConfigGetallList
     * @summary All Coins' Information (USER_DATA)
     * @request GET:/sapi/v1/capital/config/getall
     * @secure
     */
    v1CapitalConfigGetallList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          coin: string;
          depositAllEnable: boolean;
          free: string;
          freeze: string;
          ipoable: string;
          ipoing: string;
          isLegalMoney: boolean;
          locked: string;
          name: string;
          networkList: {
            addressRegex: string;
            coin: string;
            depositDesc: string;
            depositEnable: boolean;
            isDefault: boolean;
            memoRegex: string;
            minConfirm: number;
            name: string;
            resetAddressStatus: boolean;
            specialTips: string;
            unLockConfirm: number;
            withdrawDesc: string;
            withdrawEnable: boolean;
            withdrawFee: string;
            withdrawIntegerMultiple: string;
            withdrawMax: string;
            withdrawMin: string;
            sameAddress: boolean;
          }[];
          storage: string;
          trading: boolean;
          withdrawAllEnable: boolean;
          withdrawing: string;
        }[],
        Error
      >({
        path: `/sapi/v1/capital/config/getall`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - The query time period must be less than 30 days - Support query within the last 6 months only - If startTimeand endTime not sent, return records of the last 7 days by default Weight(IP): 2400
     *
     * @tags Wallet
     * @name V1AccountSnapshotList
     * @summary Daily Account Snapshot (USER_DATA)
     * @request GET:/sapi/v1/accountSnapshot
     * @secure
     */
    v1AccountSnapshotList: (
      query: {
        type: "SPOT" | "MARGIN" | "FUTURES";
        startTime?: number;
        endTime?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SnapshotSpot | SnapshotMargin | SnapshotFutures, Error>({
        path: `/sapi/v1/accountSnapshot`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - This request will disable fastwithdraw switch under your account. - You need to enable "trade" option for the api key which requests this endpoint. Weight(IP): 1
     *
     * @tags Wallet
     * @name V1AccountDisableFastWithdrawSwitchCreate
     * @summary Disable Fast Withdraw Switch (USER_DATA)
     * @request POST:/sapi/v1/account/disableFastWithdrawSwitch
     * @secure
     */
    v1AccountDisableFastWithdrawSwitchCreate: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<object, Error>({
        path: `/sapi/v1/account/disableFastWithdrawSwitch`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - This request will enable fastwithdraw switch under your account. You need to enable "trade" option for the api key which requests this endpoint. - When Fast Withdraw Switch is on, transferring funds to a Binance account will be done instantly. There is no on-chain transaction, no transaction ID and no withdrawal fee. Weight(IP): 1
     *
     * @tags Wallet
     * @name V1AccountEnableFastWithdrawSwitchCreate
     * @summary Enable Fast Withdraw Switch (USER_DATA)
     * @request POST:/sapi/v1/account/enableFastWithdrawSwitch
     * @secure
     */
    v1AccountEnableFastWithdrawSwitchCreate: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<object, Error>({
        path: `/sapi/v1/account/enableFastWithdrawSwitch`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Submit a withdraw request. - If `network` not send, return with default network of the coin. - You can get `network` and `isDefault` in `networkList` of a coin in the response of `Get /sapi/v1/capital/config/getall (HMAC SHA256)`. Weight(IP): 1
     *
     * @tags Wallet
     * @name V1CapitalWithdrawApplyCreate
     * @summary Withdraw (USER_DATA)
     * @request POST:/sapi/v1/capital/withdraw/apply
     * @secure
     */
    v1CapitalWithdrawApplyCreate: (
      query: {
        coin: string;
        withdrawOrderId?: string;
        network?: string;
        address: string;
        addressTag?: string;
        amount: number;
        transactionFeeFlag?: boolean;
        name?: string;
        walletType?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ id: string }, Error>({
        path: `/sapi/v1/capital/withdraw/apply`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch deposit history. - Please notice the default `startTime` and `endTime` to make sure that time interval is within 0-90 days. - If both `startTime` and `endTime` are sent, time between `startTime` and `endTime` must be less than 90 days. Weight(IP): 1
     *
     * @tags Wallet
     * @name V1CapitalDepositHisrecList
     * @summary Deposit History（supporting network） (USER_DATA)
     * @request GET:/sapi/v1/capital/deposit/hisrec
     * @secure
     */
    v1CapitalDepositHisrecList: (
      query: {
        coin: string;
        status?: 0 | 6 | 1;
        startTime?: number;
        endTime?: number;
        offset?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          amount: string;
          coin: string;
          network: string;
          status: number;
          address: string;
          addressTag: string;
          txId: string;
          insertTime: number;
          transferType: number;
          unlockConfirm: string;
          confirmTimes: string;
        }[],
        Error
      >({
        path: `/sapi/v1/capital/deposit/hisrec`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch withdraw history. - `network` may not be in the response for old withdraw. - Please notice the default `startTime` and `endTime` to make sure that time interval is within 0-90 days. - If both `startTime` and `endTime` are sent, time between `startTime` and `endTime` must be less than 90 days Weight(IP): 1
     *
     * @tags Wallet
     * @name V1CapitalWithdrawHistoryList
     * @summary Withdraw History (supporting network) (USER_DATA)
     * @request GET:/sapi/v1/capital/withdraw/history
     * @secure
     */
    v1CapitalWithdrawHistoryList: (
      query: {
        coin: string;
        withdrawOrderId?: string;
        status?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        startTime?: number;
        endTime?: number;
        offset?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          address: string;
          amount: string;
          applyTime: string;
          coin: string;
          id: string;
          withdrawOrderId: string;
          network: string;
          transferType: number;
          status: number;
          transactionFee: string;
          confirmNo: number;
          info: string;
          txId: string;
        }[],
        Error
      >({
        path: `/sapi/v1/capital/withdraw/history`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch deposit address with network. - If network is not send, return with default network of the coin. - You can get network and isDefault in networkList in the response of Get /sapi/v1/capital/config/getall (HMAC SHA256). Weight(IP): 10
     *
     * @tags Wallet
     * @name V1CapitalDepositAddressList
     * @summary Deposit Address (supporting network) (USER_DATA)
     * @request GET:/sapi/v1/capital/deposit/address
     * @secure
     */
    v1CapitalDepositAddressList: (
      query: { coin: string; network?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ address: string; coin: string; tag: string; url: string }, Error>({
        path: `/sapi/v1/capital/deposit/address`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch account status detail. Weight(IP): 1
     *
     * @tags Wallet
     * @name V1AccountStatusList
     * @summary Account Status (USER_DATA)
     * @request GET:/sapi/v1/account/status
     * @secure
     */
    v1AccountStatusList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ data: string }, Error>({
        path: `/sapi/v1/account/status`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch account API trading status with details. Weight(IP): 1
     *
     * @tags Wallet
     * @name V1AccountApiTradingStatusList
     * @summary Account API Trading Status (USER_DATA)
     * @request GET:/sapi/v1/account/apiTradingStatus
     * @secure
     */
    v1AccountApiTradingStatusList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            isLocked: boolean;
            plannedRecoverTime: number;
            triggerCondition: { GCR: number; IFER: number; UFR: number };
            indicators: { BTCUSDT: { i: string; c: number; v: number; t: number }[] };
            updateTime: number;
          };
        },
        Error
      >({
        path: `/sapi/v1/account/apiTradingStatus`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Wallet
     * @name V1AssetDribbletList
     * @summary DustLog(USER_DATA)
     * @request GET:/sapi/v1/asset/dribblet
     * @secure
     */
    v1AssetDribbletList: (
      query: { startTime?: number; endTime?: number; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          total: number;
          userAssetDribblets: {
            operateTime: number;
            totalTransferedAmount: string;
            totalServiceChargeAmount: string;
            transId: number;
            userAssetDribbletDetails: {
              transId: number;
              serviceChargeAmount: string;
              amount: string;
              operateTime: number;
              transferedAmount: string;
              fromAsset: string;
            }[];
          }[];
        },
        Error
      >({
        path: `/sapi/v1/asset/dribblet`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Convert dust assets to BNB. Weight(UID): 10
     *
     * @tags Wallet
     * @name V1AssetDustCreate
     * @summary Dust Transfer (USER_DATA)
     * @request POST:/sapi/v1/asset/dust
     * @secure
     */
    v1AssetDustCreate: (
      query: { asset: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          totalServiceCharge: string;
          totalTransfered: string;
          transferResult: {
            amount: string;
            fromAsset: string;
            operateTime: number;
            serviceChargeAmount: string;
            tranId: number;
            transferedAmount: string;
          }[];
        },
        Error
      >({
        path: `/sapi/v1/asset/dust`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Query asset Dividend Record Weight(IP): 10
     *
     * @tags Wallet
     * @name V1AssetAssetDividendList
     * @summary Asset Dividend Record (USER_DATA)
     * @request GET:/sapi/v1/asset/assetDividend
     * @secure
     */
    v1AssetAssetDividendList: (
      query: {
        asset?: string;
        startTime?: number;
        endTime?: number;
        limit: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: { id: number; amount: string; asset: string; divTime: number; enInfo: string; tranId: number }[];
          total: number;
        },
        Error
      >({
        path: `/sapi/v1/asset/assetDividend`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch details of assets supported on Binance. - Please get network and other deposit or withdraw details from `GET /sapi/v1/capital/config/getall`. Weight(IP): 1
     *
     * @tags Wallet
     * @name V1AssetAssetDetailList
     * @summary Asset Detail (USER_DATA)
     * @request GET:/sapi/v1/asset/assetDetail
     * @secure
     */
    v1AssetAssetDetailList: (
      query: { asset?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          CTR: {
            minWithdrawAmount: string;
            depositStatus: boolean;
            withdrawFee: number;
            withdrawStatus: boolean;
            depositTip: string;
          };
        },
        Error
      >({
        path: `/sapi/v1/asset/assetDetail`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch trade fee Weight(IP): 1
     *
     * @tags Wallet
     * @name V1AssetTradeFeeList
     * @summary Trade Fee (USER_DATA)
     * @request GET:/sapi/v1/asset/tradeFee
     * @secure
     */
    v1AssetTradeFeeList: (
      query: { symbol?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ symbol: string; makerCommission: string; takerCommission: string }[], Error>({
        path: `/sapi/v1/asset/tradeFee`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - `fromSymbol` must be sent when type are ISOLATEDMARGIN_MARGIN and ISOLATEDMARGIN_ISOLATEDMARGIN - `toSymbol` must be sent when type are MARGIN_ISOLATEDMARGIN and ISOLATEDMARGIN_ISOLATEDMARGIN - Support query within the last 6 months only - If `startTime` and `endTime` not sent, return records of the last 7 days by default Weight(IP): 1
     *
     * @tags Wallet
     * @name V1AssetTransferList
     * @summary Query User Universal Transfer History (USER_DATA)
     * @request GET:/sapi/v1/asset/transfer
     * @secure
     */
    v1AssetTransferList: (
      query: {
        type:
          | "MAIN_C2C"
          | "MAIN_UMFUTURE"
          | "MAIN_CMFUTURE"
          | "MAIN_MARGIN"
          | "MAIN_MINING"
          | "C2C_MAIN"
          | "C2C_UMFUTURE"
          | "C2C_MINING"
          | "C2C_MARGIN"
          | "UMFUTURE_MAIN"
          | "UMFUTURE_C2C"
          | "UMFUTURE_MARGIN"
          | "CMFUTURE_MAIN"
          | "CMFUTURE_MARGIN"
          | "MARGIN_MAIN"
          | "MARGIN_UMFUTURE"
          | "MARGIN_CMFUTURE"
          | "MARGIN_MINING"
          | "MARGIN_C2C"
          | "MINING_MAIN"
          | "MINING_UMFUTURE"
          | "MINING_C2C"
          | "MINING_MARGIN"
          | "MAIN_PAY"
          | "PAY_MAIN"
          | "ISOLATEDMARGIN_MARGIN"
          | "MARGIN_ISOLATEDMARGIN"
          | "ISOLATEDMARGIN_ISOLATEDMARGIN";
        startTime?: number;
        endTime?: number;
        current?: number;
        size?: number;
        fromSymbol?: string;
        toSymbol?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          total: number;
          rows: { asset: string; amount: string; type: string; status: string; tranId: number; timestamp: number }[];
        },
        Error
      >({
        path: `/sapi/v1/asset/transfer`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You need to enable `Permits Universal Transfer` option for the api key which requests this endpoint. - `fromSymbol` must be sent when type are ISOLATEDMARGIN_MARGIN and ISOLATEDMARGIN_ISOLATEDMARGIN - `toSymbol` must be sent when type are MARGIN_ISOLATEDMARGIN and ISOLATEDMARGIN_ISOLATEDMARGIN ENUM of transfer types: - MAIN_UMFUTURE Spot account transfer to USDⓈ-M Futures account - MAIN_CMFUTURE Spot account transfer to COIN-M Futures account - MAIN_MARGIN Spot account transfer to Margin（cross）account - UMFUTURE_MAIN USDⓈ-M Futures account transfer to Spot account - UMFUTURE_MARGIN USDⓈ-M Futures account transfer to Margin（cross）account - CMFUTURE_MAIN COIN-M Futures account transfer to Spot account - CMFUTURE_MARGIN COIN-M Futures account transfer to Margin(cross) account - MARGIN_MAIN Margin（cross）account transfer to Spot account - MARGIN_UMFUTURE Margin（cross）account transfer to USDⓈ-M Futures - MARGIN_CMFUTURE Margin（cross）account transfer to COIN-M Futures - ISOLATEDMARGIN_MARGIN Isolated margin account transfer to Margin(cross) account - MARGIN_ISOLATEDMARGIN Margin(cross) account transfer to Isolated margin account - ISOLATEDMARGIN_ISOLATEDMARGIN Isolated margin account transfer to Isolated margin account - MAIN_FUNDING Spot account transfer to Funding account - FUNDING_MAIN Funding account transfer to Spot account - FUNDING_UMFUTURE Funding account transfer to UMFUTURE account - UMFUTURE_FUNDING UMFUTURE account transfer to Funding account - MARGIN_FUNDING MARGIN account transfer to Funding account - FUNDING_MARGIN Funding account transfer to Margin account - FUNDING_CMFUTURE Funding account transfer to CMFUTURE account - CMFUTURE_FUNDING CMFUTURE account transfer to Funding account Weight(IP): 1
     *
     * @tags Wallet
     * @name V1AssetTransferCreate
     * @summary User Universal Transfer (USER_DATA)
     * @request POST:/sapi/v1/asset/transfer
     * @secure
     */
    v1AssetTransferCreate: (
      query: {
        type:
          | "MAIN_C2C"
          | "MAIN_UMFUTURE"
          | "MAIN_CMFUTURE"
          | "MAIN_MARGIN"
          | "MAIN_MINING"
          | "C2C_MAIN"
          | "C2C_UMFUTURE"
          | "C2C_MINING"
          | "C2C_MARGIN"
          | "UMFUTURE_MAIN"
          | "UMFUTURE_C2C"
          | "UMFUTURE_MARGIN"
          | "CMFUTURE_MAIN"
          | "CMFUTURE_MARGIN"
          | "MARGIN_MAIN"
          | "MARGIN_UMFUTURE"
          | "MARGIN_CMFUTURE"
          | "MARGIN_MINING"
          | "MARGIN_C2C"
          | "MINING_MAIN"
          | "MINING_UMFUTURE"
          | "MINING_C2C"
          | "MINING_MARGIN"
          | "MAIN_PAY"
          | "PAY_MAIN"
          | "ISOLATEDMARGIN_MARGIN"
          | "MARGIN_ISOLATEDMARGIN"
          | "ISOLATEDMARGIN_ISOLATEDMARGIN";
        asset: string;
        amount: number;
        fromSymbol?: string;
        toSymbol?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ tranId: number }, Error>({
        path: `/sapi/v1/asset/transfer`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - Currently supports querying the following business assets：Binance Pay, Binance Card, Binance Gift Card, Stock Token Weight(IP): 1
     *
     * @tags Wallet
     * @name V1AssetGetFundingAssetCreate
     * @summary Funding Wallet (USER_DATA)
     * @request POST:/sapi/v1/asset/get-funding-asset
     * @secure
     */
    v1AssetGetFundingAssetCreate: (
      query: {
        asset?: string;
        needBtcValuation?: "true" | "false";
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        { asset: string; free: string; locked: string; freeze: string; withdrawing: string; btcValuation: string }[],
        Error
      >({
        path: `/sapi/v1/asset/get-funding-asset`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Wallet
     * @name V1AccountApiRestrictionsList
     * @summary Get API Key Permission (USER_DATA)
     * @request GET:/sapi/v1/account/apiRestrictions
     * @secure
     */
    v1AccountApiRestrictionsList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          ipRestrict: boolean;
          createTime: number;
          enableWithdrawals: boolean;
          enableInternalTransfer: boolean;
          permitsUniversalTransfer: boolean;
          enableVanillaOptions: boolean;
          enableReading: boolean;
          enableFutures: boolean;
          enableMargin: boolean;
          enableSpotAndMarginTrading: boolean;
          tradingAuthorityExpirationTime: number;
        },
        Error
      >({
        path: `/sapi/v1/account/apiRestrictions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - This request will generate a virtual sub account under your master account. - You need to enable "trade" option for the api key which requests this endpoint. Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountVirtualSubAccountCreate
     * @summary Create a Virtual Sub-account(For Master Account)
     * @request POST:/sapi/v1/sub-account/virtualSubAccount
     * @secure
     */
    v1SubAccountVirtualSubAccountCreate: (
      query: { subAccountString: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ email: string }, Error>({
        path: `/sapi/v1/sub-account/virtualSubAccount`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountListList
     * @summary Query Sub-account List (For Master Account)
     * @request GET:/sapi/v1/sub-account/list
     * @secure
     */
    v1SubAccountListList: (
      query: {
        email?: string;
        isFreeze?: "true" | "false";
        page?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ subAccounts: { email: string; isFreeze: boolean; createTime: number }[] }, Error>({
        path: `/sapi/v1/sub-account/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - fromEmail and toEmail cannot be sent at the same time. - Return fromEmail equal master account email by default. Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountSubTransferHistoryList
     * @summary Sub-account Spot Asset Transfer History (For Master Account)
     * @request GET:/sapi/v1/sub-account/sub/transfer/history
     * @secure
     */
    v1SubAccountSubTransferHistoryList: (
      query: {
        fromEmail?: string;
        toEmail?: string;
        startTime?: number;
        endTime?: number;
        page?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        { from: string; to: string; asset: string; qty: string; status: string; tranId: number; time: number }[],
        Error
      >({
        path: `/sapi/v1/sub-account/sub/transfer/history`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountFuturesInternalTransferList
     * @summary Sub-account Futures Asset Transfer History (For Master Account)
     * @request GET:/sapi/v1/sub-account/futures/internalTransfer
     * @secure
     */
    v1SubAccountFuturesInternalTransferList: (
      query: {
        email: string;
        futuresType: number;
        startTime?: number;
        endTime?: number;
        page?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          success: boolean;
          futuresType: number;
          transfers: { from: string; to: string; asset: string; qty: string; tranId: number; time: number }[];
        },
        Error
      >({
        path: `/sapi/v1/sub-account/futures/internalTransfer`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - Master account can transfer max 2000 times a minute Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountFuturesInternalTransferCreate
     * @summary Sub-account Futures Asset Transfer (For Master Account)
     * @request POST:/sapi/v1/sub-account/futures/internalTransfer
     * @secure
     */
    v1SubAccountFuturesInternalTransferCreate: (
      query: {
        fromEmail: string;
        toEmail: string;
        futuresType: number;
        asset: string;
        amount: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ success: boolean; txnId: string }, Error>({
        path: `/sapi/v1/sub-account/futures/internalTransfer`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch sub-account assets Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V3SubAccountAssetsList
     * @summary Sub-account Assets (For Master Account)
     * @request GET:/sapi/v3/sub-account/assets
     * @secure
     */
    v3SubAccountAssetsList: (
      query: { email: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ balances: { asset: string; free: number; locked: number }[] }, Error>({
        path: `/sapi/v3/sub-account/assets`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get BTC valued asset summary of subaccounts. Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountSpotSummaryList
     * @summary Sub-account Spot Assets Summary (For Master Account)
     * @request GET:/sapi/v1/sub-account/spotSummary
     * @secure
     */
    v1SubAccountSpotSummaryList: (
      query: { email: string; page?: number; size?: number; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          totalCount: number;
          masterAccountTotalAsset: string;
          spotSubUserAssetBtcVoList: { email: string; totalAsset: string }[];
        },
        Error
      >({
        path: `/sapi/v1/sub-account/spotSummary`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch sub-account deposit address Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1CapitalDepositSubAddressList
     * @summary Sub-account Spot Assets Summary (For Master Account)
     * @request GET:/sapi/v1/capital/deposit/subAddress
     * @secure
     */
    v1CapitalDepositSubAddressList: (
      query: {
        email: string;
        coin: string;
        network?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ address: string; coin: string; tag: string; url: string }, Error>({
        path: `/sapi/v1/capital/deposit/subAddress`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetch sub-account deposit history Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1CapitalDepositSubHisrecList
     * @summary Sub-account Deposit History (For Master Account)
     * @request GET:/sapi/v1/capital/deposit/subHisrec
     * @secure
     */
    v1CapitalDepositSubHisrecList: (
      query: {
        email: string;
        coin?: string;
        status?: number;
        startTime?: number;
        endTime?: number;
        limit?: number;
        offset?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          amount: string;
          coin: string;
          network: string;
          status: number;
          address: string;
          addressTag: string;
          txId: string;
          insertTime: number;
          transferType: number;
          confirmTimes: string;
        }[],
        Error
      >({
        path: `/sapi/v1/capital/deposit/subHisrec`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If no `email` sent, all sub-accounts' information will be returned. Weight(IP): 10
     *
     * @tags Sub-Account
     * @name V1SubAccountStatusList
     * @summary Sub-account's Status on Margin/Futures (For Master Account)
     * @request GET:/sapi/v1/sub-account/status
     * @secure
     */
    v1SubAccountStatusList: (
      query: { email?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          email: string;
          isSubUserEnabled: boolean;
          isUserActive: boolean;
          insertTime: number;
          isMarginEnabled: boolean;
          isFutureEnabled: boolean;
          mobile: number;
        }[],
        Error
      >({
        path: `/sapi/v1/sub-account/status`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountMarginEnableCreate
     * @summary Enable Margin for Sub-account (For Master Account)
     * @request POST:/sapi/v1/sub-account/margin/enable
     * @secure
     */
    v1SubAccountMarginEnableCreate: (
      query: { email: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ email: string; isMarginEnabled: boolean }, Error>({
        path: `/sapi/v1/sub-account/margin/enable`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Sub-Account
     * @name V1SubAccountMarginAccountList
     * @summary Detail on Sub-account's Margin Account (For Master Account)
     * @request GET:/sapi/v1/sub-account/margin/account
     * @secure
     */
    v1SubAccountMarginAccountList: (
      query: { email: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          email: string;
          marginLevel: string;
          totalAssetOfBtc: string;
          totalLiabilityOfBtc: string;
          totalNetAssetOfBtc: string;
          marginTradeCoeffVo: { forceLiquidationBar: string; marginCallBar: string; normalBar: string };
          marginUserAssetVoList: {
            asset: string;
            borrowed: string;
            free: string;
            interest: string;
            locked: string;
            netAsset: string;
          }[];
        },
        Error
      >({
        path: `/sapi/v1/sub-account/margin/account`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Sub-Account
     * @name V1SubAccountMarginAccountSummaryList
     * @summary Summary of Sub-account's Margin Account (For Master Account)
     * @request GET:/sapi/v1/sub-account/margin/accountSummary
     * @secure
     */
    v1SubAccountMarginAccountSummaryList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          totalAssetOfBtc: string;
          totalLiabilityOfBtc: string;
          totalNetAssetOfBtc: string;
          subAccountList: {
            email: string;
            totalAssetOfBtc: string;
            totalLiabilityOfBtc: string;
            totalNetAssetOfBtc: string;
          }[];
        },
        Error
      >({
        path: `/sapi/v1/sub-account/margin/accountSummary`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountFuturesEnableCreate
     * @summary Enable Futures for Sub-account (For Master Account)
     * @request POST:/sapi/v1/sub-account/futures/enable
     * @secure
     */
    v1SubAccountFuturesEnableCreate: (
      query: { email: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ email: string; isFuturesEnabled: boolean }, Error>({
        path: `/sapi/v1/sub-account/futures/enable`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Sub-Account
     * @name V1SubAccountFuturesAccountList
     * @summary Detail on Sub-account's Futures Account (For Master Account)
     * @request GET:/sapi/v1/sub-account/futures/account
     * @secure
     */
    v1SubAccountFuturesAccountList: (
      query: { email: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          email: string;
          asset: string;
          assets: {
            asset: string;
            initialMargin: string;
            maintenanceMargin: string;
            marginBalance: string;
            maxWithdrawAmount: string;
            openOrderInitialMargin: string;
            positionInitialMargin: string;
            unrealizedProfit: string;
            walletBalance: string;
          }[];
          canDeposit: boolean;
          canTrade: boolean;
          canWithdraw: boolean;
          feeTier: number;
          maxWithdrawAmount: string;
          totalInitialMargin: string;
          totalMaintenanceMargin: string;
          totalMarginBalance: string;
          totalOpenOrderInitialMargin: string;
          totalPositionInitialMargin: string;
          totalUnrealizedProfit: string;
          totalWalletBalance: string;
          updateTime: number;
        },
        Error
      >({
        path: `/sapi/v1/sub-account/futures/account`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountFuturesAccountSummaryList
     * @summary Summary of Sub-account's Futures Account (For Master Account)
     * @request GET:/sapi/v1/sub-account/futures/accountSummary
     * @secure
     */
    v1SubAccountFuturesAccountSummaryList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          totalInitialMargin: string;
          totalMaintenanceMargin: string;
          totalMarginBalance: string;
          totalOpenOrderInitialMargin: string;
          totalPositionInitialMargin: string;
          totalUnrealizedProfit: string;
          totalWalletBalance: string;
          asset: string;
          subAccountList: {
            email: string;
            totalInitialMargin: string;
            totalMaintenanceMargin: string;
            totalMarginBalance: string;
            totalOpenOrderInitialMargin: string;
            totalPositionInitialMargin: string;
            totalUnrealizedProfit: string;
            totalWalletBalance: string;
            asset: string;
          }[];
        },
        Error
      >({
        path: `/sapi/v1/sub-account/futures/accountSummary`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Sub-Account
     * @name V1SubAccountFuturesPositionRiskList
     * @summary Futures Position-Risk of Sub-account (For Master Account)
     * @request GET:/sapi/v1/sub-account/futures/positionRisk
     * @secure
     */
    v1SubAccountFuturesPositionRiskList: (
      query: { email: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          entryPrice: string;
          leverage: string;
          maxNotional: string;
          liquidationPrice: string;
          markPrice: string;
          positionAmount: string;
          symbol: string;
          unrealizedProfit: string;
        }[],
        Error
      >({
        path: `/sapi/v1/sub-account/futures/positionRisk`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountFuturesTransferCreate
     * @summary Transfer for Sub-account (For Master Account)
     * @request POST:/sapi/v1/sub-account/futures/transfer
     * @secure
     */
    v1SubAccountFuturesTransferCreate: (
      query: {
        email: string;
        asset: string;
        amount: number;
        type: 1 | 2 | 3 | 4;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ txnId: string }, Error>({
        path: `/sapi/v1/sub-account/futures/transfer`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountMarginTransferCreate
     * @summary Margin Transfer for Sub-account (For Master Account)
     * @request POST:/sapi/v1/sub-account/margin/transfer
     * @secure
     */
    v1SubAccountMarginTransferCreate: (
      query: {
        email: string;
        asset: string;
        amount: number;
        type: 1 | 2;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ txnId: string }, Error>({
        path: `/sapi/v1/sub-account/margin/transfer`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountTransferSubToSubCreate
     * @summary Transfer to Sub-account of Same Master (For Sub-account)
     * @request POST:/sapi/v1/sub-account/transfer/subToSub
     * @secure
     */
    v1SubAccountTransferSubToSubCreate: (
      query: {
        toEmail: string;
        asset: string;
        amount: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ txnId: string }, Error>({
        path: `/sapi/v1/sub-account/transfer/subToSub`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountTransferSubToMasterCreate
     * @summary Transfer to Master (For Sub-account)
     * @request POST:/sapi/v1/sub-account/transfer/subToMaster
     * @secure
     */
    v1SubAccountTransferSubToMasterCreate: (
      query: { asset: string; amount: number; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ txnId: string }, Error>({
        path: `/sapi/v1/sub-account/transfer/subToMaster`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If `type` is not sent, the records of type 2: transfer out will be returned by default. - If `startTime` and `endTime` are not sent, the recent 30-day data will be returned. Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountTransferSubUserHistoryList
     * @summary Sub-account Transfer History (For Sub-account)
     * @request GET:/sapi/v1/sub-account/transfer/subUserHistory
     * @secure
     */
    v1SubAccountTransferSubUserHistoryList: (
      query: {
        asset?: string;
        type?: 1 | 2;
        startTime?: number;
        endTime?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          counterParty: string;
          email: string;
          type: number;
          asset: string;
          qty: string;
          fromAccountType: string;
          toAccountType: string;
          status: string;
          tranId: number;
          time: number;
        }[],
        Error
      >({
        path: `/sapi/v1/sub-account/transfer/subUserHistory`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - fromEmail and toEmail cannot be sent at the same time. - Return fromEmail equal master account email by default. - Only get the latest history of past 30 days. Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountUniversalTransferList
     * @summary Universal Transfer History (For Master Account)
     * @request GET:/sapi/v1/sub-account/universalTransfer
     * @secure
     */
    v1SubAccountUniversalTransferList: (
      query: {
        fromEmail?: string;
        toEmail?: string;
        clientTranId?: string;
        startTime?: number;
        endTime?: number;
        page?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          tranId: number;
          fromEmail: string;
          toEmail: string;
          asset: string;
          amount: string;
          fromAccountType: string;
          toAccountType: string;
          status: string;
          createTimeStamp: number;
        }[],
        Error
      >({
        path: `/sapi/v1/sub-account/universalTransfer`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - You need to enable "internal transfer" option for the api key which requests this endpoint. - Transfer from master account by default if fromEmail is not sent. - Transfer to master account by default if toEmail is not sent. - Transfer between futures accounts is not supported. Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountUniversalTransferCreate
     * @summary Universal Transfer (For Master Account)
     * @request POST:/sapi/v1/sub-account/universalTransfer
     * @secure
     */
    v1SubAccountUniversalTransferCreate: (
      query: {
        fromEmail?: string;
        toEmail?: string;
        fromAccountType: "SPOT" | "USDT_FUTURE" | "COIN_FUTURE";
        toAccountType: "SPOT" | "USDT_FUTURE" | "COIN_FUTURE";
        clientTranId?: string;
        asset: string;
        amount: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ tranId: number }, Error>({
        path: `/sapi/v1/sub-account/universalTransfer`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V2SubAccountFuturesAccountList
     * @summary Detail on Sub-account's Futures Account V2 (For Master Account)
     * @request GET:/sapi/v2/sub-account/futures/account
     * @secure
     */
    v2SubAccountFuturesAccountList: (
      query: { email: string; futuresType: 1 | 2; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<SubAccountUSDTFuturesDetails | SubAccountCOINFuturesDetails, Error>({
        path: `/sapi/v2/sub-account/futures/account`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 10
     *
     * @tags Sub-Account
     * @name V2SubAccountFuturesAccountSummaryList
     * @summary Summary of Sub-account's Futures Account V2 (For Master Account)
     * @request GET:/sapi/v2/sub-account/futures/accountSummary
     * @secure
     */
    v2SubAccountFuturesAccountSummaryList: (
      query: {
        futuresType: 1 | 2;
        page?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SubAccountUSDTFuturesSummary | SubAccountCOINFuturesSummary, Error>({
        path: `/sapi/v2/sub-account/futures/accountSummary`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V2SubAccountFuturesPositionRiskList
     * @summary Futures Position-Risk of Sub-account V2 (For Master Account)
     * @request GET:/sapi/v2/sub-account/futures/positionRisk
     * @secure
     */
    v2SubAccountFuturesPositionRiskList: (
      query: { email: string; futuresType: 1 | 2; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<SubAccountUSDTFuturesPositionRisk | SubAccountCOINFuturesPositionRisk, Error>({
        path: `/sapi/v2/sub-account/futures/positionRisk`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1SubAccountBlvtEnableCreate
     * @summary Enable Leverage Token for Sub-account (For Master Account)
     * @request POST:/sapi/v1/sub-account/blvt/enable
     * @secure
     */
    v1SubAccountBlvtEnableCreate: (
      query: { email: string; enableBlvt: boolean; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ email: string; enableBlvt: boolean }, Error>({
        path: `/sapi/v1/sub-account/blvt/enable`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1ManagedSubaccountDepositCreate
     * @summary Deposit assets into the managed sub-account（For Investor Master Account）
     * @request POST:/sapi/v1/managed-subaccount/deposit
     * @secure
     */
    v1ManagedSubaccountDepositCreate: (
      query: {
        toEmail: string;
        asset: string;
        amount: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ tranId: number }, Error>({
        path: `/sapi/v1/managed-subaccount/deposit`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1ManagedSubaccountAssetList
     * @summary Managed sub-account asset details（For Investor Master Account)
     * @request GET:/sapi/v1/managed-subaccount/asset
     * @secure
     */
    v1ManagedSubaccountAssetList: (
      query: { email: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          coin: string;
          name: string;
          totalBalance: string;
          availableBalance: string;
          inOrder: string;
          btcValue: string;
        }[],
        Error
      >({
        path: `/sapi/v1/managed-subaccount/asset`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Sub-Account
     * @name V1ManagedSubaccountWithdrawCreate
     * @summary Withdrawl assets from the managed sub-account（For Investor Master Account)
     * @request POST:/sapi/v1/managed-subaccount/withdraw
     * @secure
     */
    v1ManagedSubaccountWithdrawCreate: (
      query: {
        fromEmail: string;
        asset: string;
        amount: number;
        transferDate?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ tranId: number }, Error>({
        path: `/sapi/v1/managed-subaccount/withdraw`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(UID): 3000
     *
     * @tags Sub-Account
     * @name V1SubAccountSubAccountApiIpRestrictionCreate
     * @summary Enable or Disable IP Restriction for a Sub-account API Key (For Master Account)
     * @request POST:/sapi/v1/sub-account/subAccountApi/ipRestriction
     * @secure
     */
    v1SubAccountSubAccountApiIpRestrictionCreate: (
      query: {
        email: string;
        subAccountApiKey: string;
        ipRestrict: any;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ ipRestrict: string; ipList: string[]; updateTime: number; apiKey: string }, Error>({
        path: `/sapi/v1/sub-account/subAccountApi/ipRestriction`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(UID): 3000
     *
     * @tags Sub-Account
     * @name V1SubAccountSubAccountApiIpRestrictionList
     * @summary Get IP Restriction for a Sub-account API Key (For Master Account)
     * @request GET:/sapi/v1/sub-account/subAccountApi/ipRestriction
     * @secure
     */
    v1SubAccountSubAccountApiIpRestrictionList: (
      query: { email: string; subAccountApiKey: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ ipRestrict: string; ipList: string[]; updateTime: number; apiKey: string }, Error>({
        path: `/sapi/v1/sub-account/subAccountApi/ipRestriction`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Before the usage of this endpoint, please ensure `POST /sapi/v1/sub-account/subAccountApi/ipRestriction` was used to enable the IP restriction. Weight(UID): 3000
     *
     * @tags Sub-Account
     * @name V1SubAccountSubAccountApiIpRestrictionIpListCreate
     * @summary Add IP List for a Sub-account API Key (For Master Account)
     * @request POST:/sapi/v1/sub-account/subAccountApi/ipRestriction/ipList
     * @secure
     */
    v1SubAccountSubAccountApiIpRestrictionIpListCreate: (
      query: {
        email: string;
        subAccountApiKey: string;
        ipAddress: any;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ ip: string; updateTime: number; apiKey: string }, Error>({
        path: `/sapi/v1/sub-account/subAccountApi/ipRestriction/ipList`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(UID): 3000
     *
     * @tags Sub-Account
     * @name V1SubAccountSubAccountApiIpRestrictionIpListDelete
     * @summary Delete IP List for a Sub-account API Key (For Master Account)
     * @request DELETE:/sapi/v1/sub-account/subAccountApi/ipRestriction/ipList
     * @secure
     */
    v1SubAccountSubAccountApiIpRestrictionIpListDelete: (
      query: {
        email: string;
        subAccountApiKey: string;
        ipAddress: any;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ ipRestrict: string; ipList: string[]; updateTime: number; apiKey: string }, Error>({
        path: `/sapi/v1/sub-account/subAccountApi/ipRestriction/ipList`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Start a new user data stream. The stream will close after 60 minutes unless a keepalive is sent. If the account has an active `listenKey`, that `listenKey` will be returned and its validity will be extended for 60 minutes. Weight: 1
     *
     * @tags Margin Stream
     * @name V1UserDataStreamCreate
     * @summary Create a ListenKey (USER_STREAM)
     * @request POST:/sapi/v1/userDataStream
     * @secure
     */
    v1UserDataStreamCreate: (params: RequestParams = {}) =>
      this.request<{ listenKey: string }, any>({
        path: `/sapi/v1/userDataStream`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Keepalive a user data stream to prevent a time out. User data streams will close after 60 minutes. It's recommended to send a ping about every 30 minutes. Weight: 1
     *
     * @tags Margin Stream
     * @name V1UserDataStreamUpdate
     * @summary Ping/Keep-alive a ListenKey (USER_STREAM)
     * @request PUT:/sapi/v1/userDataStream
     * @secure
     */
    v1UserDataStreamUpdate: (query?: { listenKey?: string }, params: RequestParams = {}) =>
      this.request<object, Error>({
        path: `/sapi/v1/userDataStream`,
        method: "PUT",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Close out a user data stream. Weight: 1
     *
     * @tags Margin Stream
     * @name V1UserDataStreamDelete
     * @summary Close a ListenKey (USER_STREAM)
     * @request DELETE:/sapi/v1/userDataStream
     * @secure
     */
    v1UserDataStreamDelete: (query?: { listenKey?: string }, params: RequestParams = {}) =>
      this.request<object, Error>({
        path: `/sapi/v1/userDataStream`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Start a new user data stream. The stream will close after 60 minutes unless a keepalive is sent. If the account has an active `listenKey`, that `listenKey` will be returned and its validity will be extended for 60 minutes. Weight: 1
     *
     * @tags Isolated Margin Stream
     * @name V1UserDataStreamIsolatedCreate
     * @summary Generate a Listen Key (USER_STREAM)
     * @request POST:/sapi/v1/userDataStream/isolated
     * @secure
     */
    v1UserDataStreamIsolatedCreate: (params: RequestParams = {}) =>
      this.request<{ listenKey: string }, any>({
        path: `/sapi/v1/userDataStream/isolated`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Keepalive a user data stream to prevent a time out. User data streams will close after 60 minutes. It's recommended to send a ping about every 30 minutes. Weight: 1
     *
     * @tags Isolated Margin Stream
     * @name V1UserDataStreamIsolatedUpdate
     * @summary Ping/Keep-alive a Listen Key (USER_STREAM)
     * @request PUT:/sapi/v1/userDataStream/isolated
     * @secure
     */
    v1UserDataStreamIsolatedUpdate: (query?: { listenKey?: string }, params: RequestParams = {}) =>
      this.request<object, Error>({
        path: `/sapi/v1/userDataStream/isolated`,
        method: "PUT",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Close out a user data stream. Weight: 1
     *
     * @tags Isolated Margin Stream
     * @name V1UserDataStreamIsolatedDelete
     * @summary Close a ListenKey (USER_STREAM)
     * @request DELETE:/sapi/v1/userDataStream/isolated
     * @secure
     */
    v1UserDataStreamIsolatedDelete: (query?: { listenKey?: string }, params: RequestParams = {}) =>
      this.request<object, Error>({
        path: `/sapi/v1/userDataStream/isolated`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If beginTime and endTime are not sent, the recent 30-day data will be returned. Weight(IP): 1
     *
     * @tags Fiat
     * @name V1FiatOrdersList
     * @summary Fiat Deposit/Withdraw History (USER_DATA)
     * @request GET:/sapi/v1/fiat/orders
     * @secure
     */
    v1FiatOrdersList: (
      query: {
        transactionType: "0" | "1";
        beginTime?: number;
        endTime?: number;
        page?: number;
        rows?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: string;
          message: string;
          data: {
            orderNo: string;
            fiatCurrency: string;
            indicatedAmount: string;
            amount: string;
            totalFee: string;
            method: string;
            status: string;
            createTime: number;
            updateTime: number;
          }[];
          total: number;
          success: boolean;
        },
        Error
      >({
        path: `/sapi/v1/fiat/orders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If beginTime and endTime are not sent, the recent 30-day data will be returned. Weight(IP): 1
     *
     * @tags Fiat
     * @name V1FiatPaymentsList
     * @summary Fiat Payments History (USER_DATA)
     * @request GET:/sapi/v1/fiat/payments
     * @secure
     */
    v1FiatPaymentsList: (
      query: {
        transactionType: "0" | "1";
        beginTime?: number;
        endTime?: number;
        page?: number;
        rows?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: string;
          message: string;
          data: {
            orderNo: string;
            sourceAmount: string;
            fiatCurrency: string;
            obtainAmount: string;
            cryptoCurrency: string;
            totalFee: string;
            price: string;
            status: string;
            createTime: number;
            updateTime: number;
          }[];
          total: number;
          success: boolean;
        },
        Error
      >({
        path: `/sapi/v1/fiat/payments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingDailyProductListList
     * @summary Get Flexible Product List (USER_DATA)
     * @request GET:/sapi/v1/lending/daily/product/list
     * @secure
     */
    v1LendingDailyProductListList: (
      query: {
        status: "ALL" | "SUBSCRIBABLE" | "UNSUBSCRIBABLE";
        featured?: "ALL" | "TRUE";
        current?: number;
        size?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          asset: string;
          avgAnnualInterestRate: string;
          canPurchase: boolean;
          canRedeem: boolean;
          dailyInterestPerThousand: string;
          featured: boolean;
          minPurchaseAmount: string;
          productId: string;
          purchasedAmount: string;
          status: string;
          upLimit: string;
          upLimitPerUser: string;
        }[],
        Error
      >({
        path: `/sapi/v1/lending/daily/product/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingDailyUserLeftQuotaList
     * @summary Get Left Daily Purchase Quota of Flexible Product (USER_DATA)
     * @request GET:/sapi/v1/lending/daily/userLeftQuota
     * @secure
     */
    v1LendingDailyUserLeftQuotaList: (
      query: { productId: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ asset: string; leftQuota: string }, Error>({
        path: `/sapi/v1/lending/daily/userLeftQuota`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingDailyPurchaseCreate
     * @summary Purchase Flexible Product (USER_DATA)
     * @request POST:/sapi/v1/lending/daily/purchase
     * @secure
     */
    v1LendingDailyPurchaseCreate: (
      query: { productId: string; amount: number; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ purchaseId: number }, Error>({
        path: `/sapi/v1/lending/daily/purchase`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingDailyUserRedemptionQuotaList
     * @summary Get Left Daily Redemption Quota of Flexible Product (USER_DATA)
     * @request GET:/sapi/v1/lending/daily/userRedemptionQuota
     * @secure
     */
    v1LendingDailyUserRedemptionQuotaList: (
      query: { productId: string; type: "FAST" | "NORMAL"; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ asset: string; dailyQuota: string; leftQuota: string; minRedemptionAmount: string }, Error>({
        path: `/sapi/v1/lending/daily/userRedemptionQuota`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingDailyRedeemCreate
     * @summary Redeem Flexible Product (USER_DATA)
     * @request POST:/sapi/v1/lending/daily/redeem
     * @secure
     */
    v1LendingDailyRedeemCreate: (
      query: {
        productId: string;
        amount: number;
        type: "FAST" | "NORMAL";
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<object, Error>({
        path: `/sapi/v1/lending/daily/redeem`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingDailyTokenPositionList
     * @summary Get Flexible Product Position (USER_DATA)
     * @request GET:/sapi/v1/lending/daily/token/position
     * @secure
     */
    v1LendingDailyTokenPositionList: (
      query: { asset: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          annualInterestRate: string;
          asset: string;
          avgAnnualInterestRate: string;
          canRedeem: boolean;
          dailyInterestRate: string;
          freeAmount: string;
          freezeAmount: string;
          lockedAmount: string;
          productId: string;
          productName: string;
          redeemingAmount: string;
          todayPurchasedAmount: string;
          totalAmount: string;
          totalInterest: string;
        }[],
        Error
      >({
        path: `/sapi/v1/lending/daily/token/position`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingProjectListList
     * @summary Get Fixed/Activity Project List(USER_DATA)
     * @request GET:/sapi/v1/lending/project/list
     * @secure
     */
    v1LendingProjectListList: (
      query: {
        asset?: string;
        type: "ACTIVITY" | "CUSTOMIZED_FIXED";
        status: "ALL" | "SUBSCRIBABLE" | "UNSUBSCRIBABLE";
        isSortAsc: boolean;
        sortBy: "START_TIME" | "LOT_SIZ" | "LOT_SIZE" | "INTEREST_RATE" | "DURATION";
        current?: number;
        size?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          asset: string;
          displayPriority: number;
          duration: number;
          interestPerLot: string;
          interestRate: string;
          lotSize: string;
          lotsLowLimit: number;
          lotsPurchased: number;
          lotsUpLimit: number;
          maxLotsPerUser: number;
          needKyc: boolean;
          projectId: string;
          projectName: string;
          status: string;
          type: string;
          withAreaLimitation: boolean;
        }[],
        Error
      >({
        path: `/sapi/v1/lending/project/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingCustomizedFixedPurchaseCreate
     * @summary Purchase Fixed/Activity Project (USER_DATA)
     * @request POST:/sapi/v1/lending/customizedFixed/purchase
     * @secure
     */
    v1LendingCustomizedFixedPurchaseCreate: (
      query: { projectId: string; lot: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ purchaseId: string }, Error>({
        path: `/sapi/v1/lending/customizedFixed/purchase`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingProjectPositionListList
     * @summary Get Fixed/Activity Project Position (USER_DATA)
     * @request GET:/sapi/v1/lending/project/position/list
     * @secure
     */
    v1LendingProjectPositionListList: (
      query: {
        asset: string;
        projectId: string;
        status: "ALL" | "SUBSCRIBABLE" | "UNSUBSCRIBABLE";
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          asset: string;
          canTransfer: boolean;
          createTimestamp: number;
          duration: number;
          endTime: number;
          interest: string;
          interestRate: string;
          lot: number;
          positionId: number;
          principal: string;
          projectId: string;
          projectName: string;
          purchaseTime: number;
          redeemDate: string;
          startTime: number;
          status: string;
          type: string;
        }[],
        Error
      >({
        path: `/sapi/v1/lending/project/position/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingUnionAccountList
     * @summary Lending Account (USER_DATA)
     * @request GET:/sapi/v1/lending/union/account
     * @secure
     */
    v1LendingUnionAccountList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          positionAmountVos: { amount: string; amountInBTC: string; amountInUSDT: string; asset: string }[];
          totalAmountInBTC: string;
          totalAmountInUSDT: string;
          totalFixedAmountInBTC: string;
          totalFixedAmountInUSDT: string;
          totalFlexibleInBTC: string;
          totalFlexibleInUSDT: string;
        },
        Error
      >({
        path: `/sapi/v1/lending/union/account`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - The time between startTime and endTime cannot be longer than 30 days. - If startTime and endTime are both not sent, then the last 30 days' data will be returned. Weigh(IP): 1
     *
     * @tags Savings
     * @name V1LendingUnionPurchaseRecordList
     * @summary Get Purchase Record (USER_DATA)
     * @request GET:/sapi/v1/lending/union/purchaseRecord
     * @secure
     */
    v1LendingUnionPurchaseRecordList: (
      query: {
        lendingType: "DAILY" | "ACTIVITY" | "CUSTOMIZED_FIXED";
        asset?: string;
        startTime?: number;
        endTime?: number;
        current?: number;
        size?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SavingsFlexiblePurchaseRecord | SavingsFixedActivityPurchaseRecord, Error>({
        path: `/sapi/v1/lending/union/purchaseRecord`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - The time between startTime and endTime cannot be longer than 30 days. - If startTime and endTime are both not sent, then the last 30 days' data will be returned. Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingUnionRedemptionRecordList
     * @summary Get Redemption Record (USER_DATA)
     * @request GET:/sapi/v1/lending/union/redemptionRecord
     * @secure
     */
    v1LendingUnionRedemptionRecordList: (
      query: {
        lendingType: "DAILY" | "ACTIVITY" | "CUSTOMIZED_FIXED";
        asset?: string;
        startTime?: number;
        endTime?: number;
        current?: number;
        size?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SavingsFlexibleRedemptionRecord | SavingsFixedActivityRedemptionRecord, Error>({
        path: `/sapi/v1/lending/union/redemptionRecord`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - The time between startTime and endTime cannot be longer than 30 days. - If startTime and endTime are both not sent, then the last 30 days' data will be returned. Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingUnionInterestHistoryList
     * @summary Get Interest History (USER_DATA)
     * @request GET:/sapi/v1/lending/union/interestHistory
     * @secure
     */
    v1LendingUnionInterestHistoryList: (
      query: {
        lendingType: "DAILY" | "ACTIVITY" | "CUSTOMIZED_FIXED";
        asset?: string;
        startTime?: number;
        endTime?: number;
        current?: number;
        size?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        { asset: string; interest: string; lendingType: string; productName: string; time: number }[],
        Error
      >({
        path: `/sapi/v1/lending/union/interestHistory`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - PositionId is mandatory parameter for fixed position. Weight(IP): 1
     *
     * @tags Savings
     * @name V1LendingPositionChangedCreate
     * @summary Change Fixed/Activity Position to Daily Position (USER_DATA)
     * @request POST:/sapi/v1/lending/positionChanged
     * @secure
     */
    v1LendingPositionChangedCreate: (
      query: {
        projectId: string;
        lot: string;
        positionId?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ dailyPurchaseId: number; success: boolean; time: number }, Error>({
        path: `/sapi/v1/lending/positionChanged`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Mining
     * @name V1MiningPubAlgoListList
     * @summary Acquiring Algorithm (MARKET_DATA)
     * @request GET:/sapi/v1/mining/pub/algoList
     * @secure
     */
    v1MiningPubAlgoListList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        { code: number; msg: string; data: { algoName: string; algoId: number; poolIndex: number; unit: string }[] },
        Error
      >({
        path: `/sapi/v1/mining/pub/algoList`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags Mining
     * @name V1MiningPubCoinListList
     * @summary Acquiring CoinName (MARKET_DATA)
     * @request GET:/sapi/v1/mining/pub/coinList
     * @secure
     */
    v1MiningPubCoinListList: (
      query: { recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: number;
          msg: string;
          data: { coinName: string; coinId: number; poolIndex: number; algoId: number; algoName: string }[];
        },
        Error
      >({
        path: `/sapi/v1/mining/pub/coinList`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 5
     *
     * @tags Mining
     * @name V1MiningWorkerDetailList
     * @summary Request for Detail Miner List (USER_DATA)
     * @request GET:/sapi/v1/mining/worker/detail
     * @secure
     */
    v1MiningWorkerDetailList: (
      query: {
        algo: string;
        userName: string;
        workerName: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: number;
          msg: string;
          data: {
            workerName: string;
            type: string;
            hashrateDatas: { time: number; hashrate: string; reject: number }[];
          }[];
        },
        Error
      >({
        path: `/sapi/v1/mining/worker/detail`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 5
     *
     * @tags Mining
     * @name V1MiningWorkerListList
     * @summary Request for Miner List (USER_DATA)
     * @request GET:/sapi/v1/mining/worker/list
     * @secure
     */
    v1MiningWorkerListList: (
      query: {
        algo: string;
        userName: string;
        pageIndex?: number;
        sort?: number;
        sortColumn?: number;
        workerStatus?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: number;
          msg: string;
          data: {
            workerDatas: {
              workerId: string;
              workerName: string;
              status: number;
              hashRate: number;
              dayHashRate: number;
              rejectRate: number;
              lastShareTime: number;
            }[];
            totalNum: number;
            pageSize: number;
          };
        },
        Error
      >({
        path: `/sapi/v1/mining/worker/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 5
     *
     * @tags Mining
     * @name V1MiningPaymentListList
     * @summary Earnings List (USER_DATA)
     * @request GET:/sapi/v1/mining/payment/list
     * @secure
     */
    v1MiningPaymentListList: (
      query: {
        algo: string;
        userName: string;
        coin?: string;
        startDate?: string;
        endDate?: string;
        pageIndex?: number;
        pageSize?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: number;
          msg: string;
          data: {
            accountProfits: {
              time: number;
              type: number;
              hashTransfer: number;
              transferAmount: number;
              dayHashRate: number;
              profitAmount: number;
              coinName: string;
              status: number;
            }[];
            totalNum: number;
            pageSize: number;
          };
        },
        Error
      >({
        path: `/sapi/v1/mining/payment/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 5
     *
     * @tags Mining
     * @name V1MiningPaymentOtherList
     * @summary Extra Bonus List (USER_DATA)
     * @request GET:/sapi/v1/mining/payment/other
     * @secure
     */
    v1MiningPaymentOtherList: (
      query: {
        algo: string;
        userName: string;
        coin?: string;
        startDate?: string;
        endDate?: string;
        pageIndex?: number;
        pageSize?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: number;
          msg: string;
          data: {
            otherProfits: { time: number; coinName: string; type: number; profitAmount: number; status: number }[];
            totalNum: number;
            pageSize: number;
          };
        },
        Error
      >({
        path: `/sapi/v1/mining/payment/other`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 5
     *
     * @tags Mining
     * @name V1MiningHashTransferConfigDetailsListList
     * @summary Hashrate Resale List (USER_DATA)
     * @request GET:/sapi/v1/mining/hash-transfer/config/details/list
     * @secure
     */
    v1MiningHashTransferConfigDetailsListList: (
      query: { pageIndex?: number; pageSize?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: number;
          msg: string;
          data: {
            configDetails: {
              configId: number;
              poolUsername: string;
              toPoolUsername: string;
              algoName: string;
              hashRate: number;
              startDay: number;
              endDay: number;
              status: number;
            }[];
            totalNum: number;
            pageSize: number;
          };
        },
        Error
      >({
        path: `/sapi/v1/mining/hash-transfer/config/details/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 5
     *
     * @tags Mining
     * @name V1MiningHashTransferProfitDetailsList
     * @summary Hashrate Resale Details (USER_DATA)
     * @request GET:/sapi/v1/mining/hash-transfer/profit/details
     * @secure
     */
    v1MiningHashTransferProfitDetailsList: (
      query: {
        configId: string;
        userName: string;
        pageIndex?: number;
        pageSize?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: number;
          msg: string;
          data: {
            profitTransferDetails: {
              poolUsername: string;
              toPoolUsername: string;
              algoName: string;
              hashRate: number;
              day: number;
              amount: number;
              coinName: string;
            }[];
            totalNum: number;
            pageSize: number;
          };
        },
        Error
      >({
        path: `/sapi/v1/mining/hash-transfer/profit/details`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 5
     *
     * @tags Mining
     * @name V1MiningHashTransferConfigCreate
     * @summary Hashrate Resale Request (USER_DATA)
     * @request POST:/sapi/v1/mining/hash-transfer/config
     * @secure
     */
    v1MiningHashTransferConfigCreate: (
      query: {
        userName: string;
        algo: string;
        startDate?: string;
        endDate?: string;
        toPoolUser: string;
        hashRate: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ code: number; msg: string; data: number }, Error>({
        path: `/sapi/v1/mining/hash-transfer/config`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 5
     *
     * @tags Mining
     * @name V1MiningHashTransferConfigCancelCreate
     * @summary Cancel Hashrate Resale configuration (USER_DATA)
     * @request POST:/sapi/v1/mining/hash-transfer/config/cancel
     * @secure
     */
    v1MiningHashTransferConfigCancelCreate: (
      query: { configId: string; userName: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ code: number; msg: string; data: boolean }, Error>({
        path: `/sapi/v1/mining/hash-transfer/config/cancel`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 5
     *
     * @tags Mining
     * @name V1MiningStatisticsUserStatusList
     * @summary Statistic List (USER_DATA)
     * @request GET:/sapi/v1/mining/statistics/user/status
     * @secure
     */
    v1MiningStatisticsUserStatusList: (
      query: { algo: string; userName: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: number;
          msg: string;
          data: {
            fifteenMinHashRate: string;
            dayHashRate: string;
            validNum: number;
            invalidNum: number;
            profitToday: { BTC: string; BSV: string; BCH: string };
            profitYesterday: { BTC: string; BSV: string; BCH: string };
            userName: string;
            unit: string;
            algo: string;
          };
        },
        Error
      >({
        path: `/sapi/v1/mining/statistics/user/status`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 5
     *
     * @tags Mining
     * @name V1MiningStatisticsUserListList
     * @summary Account List (USER_DATA)
     * @request GET:/sapi/v1/mining/statistics/user/list
     * @secure
     */
    v1MiningStatisticsUserListList: (
      query: { algo: string; userName: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: number;
          msg: string;
          data: { type: string; userName: string; list: { time: number; hashrate: string; reject: string }[] }[];
        },
        Error
      >({
        path: `/sapi/v1/mining/statistics/user/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 5
     *
     * @tags Mining
     * @name V1MiningPaymentUidList
     * @summary Mining Account Earning (USER_DATA)
     * @request GET:/sapi/v1/mining/payment/uid
     * @secure
     */
    v1MiningPaymentUidList: (
      query: {
        algo: string;
        startDate?: string;
        endDate?: string;
        pageIndex?: number;
        pageSize?: string;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: number;
          msg: string;
          data: {
            accountProfits: {
              time: number;
              coinName: string;
              type: number;
              puid: number;
              subName: string;
              amount: number;
            }[];
            totalNum: number;
            pageSize: number;
          };
        },
        Error
      >({
        path: `/sapi/v1/mining/payment/uid`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags BLVT
     * @name V1BlvtTokenInfoList
     * @summary BLVT Info (MARKET_DATA)
     * @request GET:/sapi/v1/blvt/tokenInfo
     * @secure
     */
    v1BlvtTokenInfoList: (query?: { tokenName?: string }, params: RequestParams = {}) =>
      this.request<
        {
          tokenName: string;
          description: string;
          underlying: string;
          tokenIssued: string;
          basket: string;
          currentBaskets: { symbol: string; amount: string; notionalValue: string }[];
          nav: string;
          realLeverage: string;
          fundingRate: string;
          dailyManagementFee: string;
          purchaseFeePct: string;
          dailyPurchaseLimit: string;
          redeemFeePct: string;
          dailyRedeemLimit: string;
          timestamp: number;
        }[],
        Error
      >({
        path: `/sapi/v1/blvt/tokenInfo`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags BLVT
     * @name V1BlvtSubscribeCreate
     * @summary Subscribe BLVT (USER_DATA)
     * @request POST:/sapi/v1/blvt/subscribe
     * @secure
     */
    v1BlvtSubscribeCreate: (
      query: { tokenName: string; cost: number; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        { id: number; status: string; tokenName: string; amount: string; cost: string; timestamp: number },
        Error
      >({
        path: `/sapi/v1/blvt/subscribe`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - Only the data of the latest 90 days is available Weight(IP): 1
     *
     * @tags BLVT
     * @name V1BlvtSubscribeRecordList
     * @summary Query Subscription Record (USER_DATA)
     * @request GET:/sapi/v1/blvt/subscribe/record
     * @secure
     */
    v1BlvtSubscribeRecordList: (
      query: {
        tokenName?: string;
        id?: number;
        startTime?: number;
        endTime?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: number;
          tokenName: string;
          amount: string;
          nav: string;
          fee: string;
          totalCharge: string;
          timestamp: number;
        },
        Error
      >({
        path: `/sapi/v1/blvt/subscribe/record`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags BLVT
     * @name V1BlvtRedeemCreate
     * @summary Redeem BLVT (USER_DATA)
     * @request POST:/sapi/v1/blvt/redeem
     * @secure
     */
    v1BlvtRedeemCreate: (
      query: { tokenName: string; amount: number; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        { id: number; status: string; tokenName: string; redeemAmount: string; amount: string; timestamp: number },
        Error
      >({
        path: `/sapi/v1/blvt/redeem`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - Only the data of the latest 90 days is available Weight(IP): 1
     *
     * @tags BLVT
     * @name V1BlvtRedeemRecordList
     * @summary Redemption Record (USER_DATA)
     * @request GET:/sapi/v1/blvt/redeem/record
     * @secure
     */
    v1BlvtRedeemRecordList: (
      query: {
        tokenName?: string;
        id?: number;
        startTime?: number;
        endTime?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: number;
          tokenName: string;
          amount: string;
          nav: string;
          fee: string;
          netProceed: string;
          timestamp: number;
        }[],
        Error
      >({
        path: `/sapi/v1/blvt/redeem/record`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 1
     *
     * @tags BLVT
     * @name V1BlvtUserLimitList
     * @summary BLVT User Limit Info (USER_DATA)
     * @request GET:/sapi/v1/blvt/userLimit
     * @secure
     */
    v1BlvtUserLimitList: (
      query: { tokenName?: string; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        { tokenName: string; userDailyTotalPurchaseLimit: string; userDailyTotalRedeemLimit: string }[],
        Error
      >({
        path: `/sapi/v1/blvt/userLimit`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get metadata about all swap pools. Weight(IP): 1
     *
     * @tags BSwap
     * @name V1BswapPoolsList
     * @summary List All Swap Pools (MARKET_DATA)
     * @request GET:/sapi/v1/bswap/pools
     * @secure
     */
    v1BswapPoolsList: (params: RequestParams = {}) =>
      this.request<{ poolId: number; poolName: string; assets: string[] }[], Error>({
        path: `/sapi/v1/bswap/pools`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get liquidity information and user share of a pool. Weight(IP):\ `1`  for one pool;\ `10` when the poolId parameter is omitted;
     *
     * @tags BSwap
     * @name V1BswapLiquidityList
     * @summary Liquidity information of a pool (USER_DATA)
     * @request GET:/sapi/v1/bswap/liquidity
     * @secure
     */
    v1BswapLiquidityList: (
      query: { poolId?: number; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          poolId: number;
          poolNmae: string;
          updateTime: number;
          liquidity: { BUSD: number; USDT: number };
          share: { shareAmount: number; sharePercentage: number; asset: { BUSD: number; USDT: number } };
        }[],
        Error
      >({
        path: `/sapi/v1/bswap/liquidity`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Add liquidity to a pool. Weight(UID): 1000 (Additional: 3 times one second)
     *
     * @tags BSwap
     * @name V1BswapLiquidityAddCreate
     * @summary Add Liquidity (TRADE)
     * @request POST:/sapi/v1/bswap/liquidityAdd
     * @secure
     */
    v1BswapLiquidityAddCreate: (
      query: {
        poolId: number;
        asset: string;
        quantity: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ operationId: number }, Error>({
        path: `/sapi/v1/bswap/liquidityAdd`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove liquidity from a pool, `type` include `SINGLE` and `COMBINATION`, asset is mandatory for single asset removal Weight(UID): 1000 (Additional: 3 times one second)
     *
     * @tags BSwap
     * @name V1BswapLiquidityRemoveCreate
     * @summary Remove Liquidity (TRADE)
     * @request POST:/sapi/v1/bswap/liquidityRemove
     * @secure
     */
    v1BswapLiquidityRemoveCreate: (
      query: {
        poolId: number;
        type: "SINGLE" | "COMBINATION";
        asset?: string;
        shareAmount: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ operationId: number }, Error>({
        path: `/sapi/v1/bswap/liquidityRemove`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get liquidity operation (add/remove) records. Weight(UID): 3000
     *
     * @tags BSwap
     * @name V1BswapLiquidityOpsList
     * @summary Liquidity Operation Record (USER_DATA)
     * @request GET:/sapi/v1/bswap/liquidityOps
     * @secure
     */
    v1BswapLiquidityOpsList: (
      query: {
        operationId?: number;
        poolId?: number;
        operation?: "ADD" | "REMOVE";
        startTime?: number;
        endTime?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          operationId: number;
          poolId: number;
          poolName: string;
          operation: string;
          status: number;
          updateTime: number;
          shareAmount: string;
        }[],
        Error
      >({
        path: `/sapi/v1/bswap/liquidityOps`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Request a quote for swap quote asset (selling asset) for base asset (buying asset), essentially price/exchange rates. quoteQty is quantity of quote asset (to sell). Please be noted the quote is for reference only, the actual price will change as the liquidity changes, it's recommended to swap immediate after request a quote for slippage prevention. Weight(UID): 150
     *
     * @tags BSwap
     * @name V1BswapQuoteList
     * @summary Request Quote (USER_DATA)
     * @request GET:/sapi/v1/bswap/quote
     * @secure
     */
    v1BswapQuoteList: (
      query: {
        quoteAsset: string;
        baseAsset: string;
        quoteQty: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          quoteAsset: string;
          baseAsset: string;
          quoteQty: number;
          baseQty: number;
          price: number;
          slippage: number;
          fee: number;
        },
        Error
      >({
        path: `/sapi/v1/bswap/quote`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Swap `quoteAsset` for `baseAsset`. Weight(UID): 1000 (Additional: 3 times one second)
     *
     * @tags BSwap
     * @name V1BswapSwapCreate
     * @summary Swap (TRADE)
     * @request POST:/sapi/v1/bswap/swap
     * @secure
     */
    v1BswapSwapCreate: (
      query: {
        quoteAsset: string;
        baseAsset: string;
        quoteQty: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ swapId: number }, Error>({
        path: `/sapi/v1/bswap/swap`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get swap history. Weight(UID): 3000
     *
     * @tags BSwap
     * @name V1BswapSwapList
     * @summary Swap History (USER_DATA)
     * @request GET:/sapi/v1/bswap/swap
     * @secure
     */
    v1BswapSwapList: (
      query: {
        swapId?: number;
        startTime?: number;
        endTime?: number;
        status?: 0 | 1 | 2;
        quoteAsset?: string;
        baseAsset?: string;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          swapId: number;
          swapTime: number;
          status: number;
          quoteAsset: string;
          baseAsset: string;
          quoteQty: number;
          baseQty: number;
          price: number;
          fee: number;
        }[],
        Error
      >({
        path: `/sapi/v1/bswap/swap`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(IP): 150
     *
     * @tags BSwap
     * @name V1BswapPoolConfigureList
     * @summary Pool Configure (USER_DATA)
     * @request GET:/sapi/v1/bswap/poolConfigure
     * @secure
     */
    v1BswapPoolConfigureList: (
      query: { poolId?: number; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          poolId: number;
          poolNmae: string;
          updateTime: number;
          liquidity: { constantA: number; minRedeemShare: number; slippageTolerance: number };
          assetConfigure: {
            BUSD: { minAdd: number; maxAdd: number; minSwap: number; maxSwap: number };
            USDT: { minAdd: number; maxAdd: number; minSwap: number; maxSwap: number };
          };
        }[],
        Error
      >({
        path: `/sapi/v1/bswap/poolConfigure`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Calculate expected share amount for adding liquidity in single or dual token. Weight(IP): 150
     *
     * @tags BSwap
     * @name V1BswapAddLiquidityPreviewList
     * @summary Add Liquidity Preview (USER_DATA)
     * @request GET:/sapi/v1/bswap/addLiquidityPreview
     * @secure
     */
    v1BswapAddLiquidityPreviewList: (
      query: {
        poolId: number;
        type: "SINGLE" | "COMBINATION";
        quoteAsset: string;
        quoteQty: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BswapAddLiquidityPreviewCombination | BswapAddLiquidityPreviewSingle, Error>({
        path: `/sapi/v1/bswap/addLiquidityPreview`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Calculate the expected asset amount of single token redemption or dual token redemption. Weight(IP): 150
     *
     * @tags BSwap
     * @name V1BswapRemoveLiquidityPreviewList
     * @summary Remove Liquidity Preview (USER_DATA)
     * @request GET:/sapi/v1/bswap/removeLiquidityPreview
     * @secure
     */
    v1BswapRemoveLiquidityPreviewList: (
      query: {
        poolId: number;
        type: "SINGLE" | "COMBINATION";
        quoteAsset: string;
        shareAmount: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BswapRmvLiquidityPreviewCombination | BswapRmvLiquidityPreviewSingle, Error>({
        path: `/sapi/v1/bswap/removeLiquidityPreview`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get unclaimed rewards record. Weight(UID): 1000
     *
     * @tags BSwap
     * @name V1BswapUnclaimedRewardsList
     * @summary Get Unclaimed Rewards Record (USER_DATA)
     * @request GET:/sapi/v1/bswap/unclaimedRewards
     * @secure
     */
    v1BswapUnclaimedRewardsList: (
      query: { type?: number; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          totalUnclaimedRewards: { BUSD: number; BNB: number; USDT: number };
          details: { "BNB/USDT": { BUSD: number; USDT: number }; "BNB/BTC": { BNB: number } };
        },
        Error
      >({
        path: `/sapi/v1/bswap/unclaimedRewards`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Claim swap rewards or liquidity rewards Weight(UID): 1000
     *
     * @tags BSwap
     * @name V1BswapUnclaimedRewardsCreate
     * @summary Claim rewards (TRADE)
     * @request POST:/sapi/v1/bswap/unclaimedRewards
     * @secure
     */
    v1BswapUnclaimedRewardsCreate: (
      query: { type?: number; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ success: boolean }, Error>({
        path: `/sapi/v1/bswap/unclaimedRewards`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get history of claimed rewards. Weight(UID): 1000
     *
     * @tags BSwap
     * @name V1BswapClaimedHistoryList
     * @summary Get Claimed History (USER_DATA)
     * @request GET:/sapi/v1/bswap/claimedHistory
     * @secure
     */
    v1BswapClaimedHistoryList: (
      query: {
        poolId?: number;
        assetRewards?: string;
        type?: number;
        startTime?: number;
        endTime?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          poolId: number;
          poolName: string;
          assetRewards: string;
          claimTime: number;
          claimAmount: number;
          status: number;
        }[],
        Error
      >({
        path: `/sapi/v1/bswap/claimedHistory`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If startTimestamp and endTimestamp are not sent, the recent 30-day data will be returned. - The max interval between startTimestamp and endTimestamp is 30 days. Weight(IP): 1
     *
     * @tags C2C
     * @name V1C2COrderMatchListUserOrderHistoryList
     * @summary Get C2C Trade History (USER_DATA)
     * @request GET:/sapi/v1/c2c/orderMatch/listUserOrderHistory
     * @secure
     */
    v1C2COrderMatchListUserOrderHistoryList: (
      query: {
        tradeType?: "BUY" | "SELL";
        startTimestamp?: number;
        endTimestamp?: number;
        page?: number;
        rows?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: string;
          message: string;
          data: {
            orderNumber: string;
            advNo: string;
            tradeType: string;
            asset: string;
            fiat: string;
            fiatSymbol: string;
            amount: string;
            totalPrice: string;
            unitPrice: string;
            orderStatus: string;
            createTime: number;
            commission: string;
            counterPartNickName: string;
            advertisementRole: string;
          }[];
          total: number;
          success: boolean;
        },
        Error
      >({
        path: `/sapi/v1/c2c/orderMatch/listUserOrderHistory`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If startTime and endTime are not sent, the recent 7-day data will be returned. - The max interval between startTime and endTime is 30 days. Weight(UID): 6000
     *
     * @tags Crypto Loans
     * @name V1LoanIncomeList
     * @summary Get Crypto Loans Income History (USER_DATA)
     * @request GET:/sapi/v1/loan/income
     * @secure
     */
    v1LoanIncomeList: (
      query: {
        asset: string;
        type?:
          | "borrowIn"
          | "collateralSpent"
          | "repayAmount"
          | "collateralReturn"
          | "addCollateral"
          | "removeCollateral"
          | "collateralReturnAfterLiquidation";
        startTime?: number;
        endTime?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<{ asset: string; type: string; amount: string; timestamp: number; tranId: string }[], Error>({
        path: `/sapi/v1/loan/income`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - If startTimestamp and endTimestamp are not sent, the recent 90 days' data will be returned. - The max interval between startTimestamp and endTimestamp is 90 days. - Support for querying orders within the last 18 months. Weight(UID): 3000
     *
     * @tags Pay
     * @name V1PayTransactionsList
     * @summary Get Pay Trade History (USER_DATA)
     * @request GET:/sapi/v1/pay/transactions
     * @secure
     */
    v1PayTransactionsList: (
      query: {
        startTimestamp?: number;
        endTimestamp?: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          code: string;
          message: string;
          data: {
            orderType: string;
            transactionId: string;
            transactionTime: number;
            amount: string;
            currency: string;
            fundsDetail: { currency: string; amount: string }[];
          }[];
          success: boolean;
        },
        Error
      >({
        path: `/sapi/v1/pay/transactions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - The max interval between startTime and endTime is 30 days. Weight(UID): 3000
     *
     * @tags Convert
     * @name V1ConvertTradeFlowList
     * @summary Get Convert Trade History (USER_DATA)
     * @request GET:/sapi/v1/convert/tradeFlow
     * @secure
     */
    v1ConvertTradeFlowList: (
      query: {
        startTime: number;
        endTime: number;
        limit?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          list: {
            quoteId: string;
            orderId: number;
            orderStatus: string;
            fromAsset: string;
            fromAmount: string;
            toAsset: string;
            toAmount: string;
            ratio: string;
            inverseRatio: string;
            createTime: number;
          }[];
          startTime: number;
          endTime: number;
          limit: number;
          moreData: boolean;
        },
        Error
      >({
        path: `/sapi/v1/convert/tradeFlow`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - The max interval between startTime and endTime is 90 days. - If startTime and endTime are not sent, the recent 7 days' data will be returned. - The earliest startTime is supported on June 10, 2020 Weight(UID): 3000
     *
     * @tags Rebate
     * @name V1RebateTaxQueryList
     * @summary Get Spot Rebate History Records (USER_DATA)
     * @request GET:/sapi/v1/rebate/taxQuery
     * @secure
     */
    v1RebateTaxQueryList: (
      query: {
        startTime?: number;
        endTime?: number;
        page?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          status: string;
          type: string;
          code: string;
          data: {
            page: number;
            totalRecords: number;
            totalPageNum: number;
            data: { asset: string; type: number; amount: string; updateTime: number }[];
          };
        },
        Error
      >({
        path: `/sapi/v1/rebate/taxQuery`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - The max interval between startTime and endTime is 90 days. - If startTime and endTime are not sent, the recent 7 days' data will be returned. Weight(UID): 3000
     *
     * @tags NFT
     * @name V1NftHistoryTransactionsList
     * @summary Get NFT Transaction History (USER_DATA)
     * @request GET:/sapi/v1/nft/history/transactions
     * @secure
     */
    v1NftHistoryTransactionsList: (
      query: {
        orderType: number;
        startTime?: number;
        endTime?: number;
        limit?: number;
        page?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          total: number;
          list: {
            orderNo: string;
            tokens: { network: string; tokenId: string; contractAddress: string }[];
            tradeTime: number;
            tradeAmount: string;
            tradeCurrency: string;
          }[];
        },
        Error
      >({
        path: `/sapi/v1/nft/history/transactions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - The max interval between startTime and endTime is 90 days. - If startTime and endTime are not sent, the recent 7 days' data will be returned. Weight(UID): 3000
     *
     * @tags NFT
     * @name V1NftHistoryDepositList
     * @summary Get NFT Deposit History(USER_DATA)
     * @request GET:/sapi/v1/nft/history/deposit
     * @secure
     */
    v1NftHistoryDepositList: (
      query: {
        startTime?: number;
        endTime?: number;
        limit?: number;
        page?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          total: number;
          list: { network: string; txID: number | null; contractAdrress: string; tokenId: string; timestamp: number }[];
        },
        Error
      >({
        path: `/sapi/v1/nft/history/deposit`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description - The max interval between startTime and endTime is 90 days. - If startTime and endTime are not sent, the recent 7 days' data will be returned. Weight(UID): 3000
     *
     * @tags NFT
     * @name V1NftHistoryWithdrawList
     * @summary Get NFT Withdraw History (USER_DATA)
     * @request GET:/sapi/v1/nft/history/withdraw
     * @secure
     */
    v1NftHistoryWithdrawList: (
      query: {
        startTime?: number;
        endTime?: number;
        limit?: number;
        page?: number;
        recvWindow?: number;
        timestamp: number;
        signature: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          total: number;
          list: {
            network: string;
            txID: string;
            contractAdrress: string;
            tokenId: string;
            timestamp: number;
            fee: number;
            feeAsset: string;
          }[];
        },
        Error
      >({
        path: `/sapi/v1/nft/history/withdraw`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Weight(UID): 3000
     *
     * @tags NFT
     * @name V1NftUserGetAssetList
     * @summary Get NFT Asset (USER_DATA)
     * @request GET:/sapi/v1/nft/user/getAsset
     * @secure
     */
    v1NftUserGetAssetList: (
      query: { limit?: number; page?: number; recvWindow?: number; timestamp: number; signature: string },
      params: RequestParams = {},
    ) =>
      this.request<{ total: number; list: { network: string; contractAddress: string; tokenId: string }[] }, Error>({
        path: `/sapi/v1/nft/user/getAsset`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
