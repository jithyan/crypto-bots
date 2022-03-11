export const exchangeInfo = {
  ethbusd: {
    timezone: "UTC",
    serverTime: 1646880143509,
    rateLimits: [
      {
        rateLimitType: "REQUEST_WEIGHT",
        interval: "MINUTE",
        intervalNum: 1,
        limit: 1200,
      },
      {
        rateLimitType: "ORDERS",
        interval: "SECOND",
        intervalNum: 10,
        limit: 50,
      },
      {
        rateLimitType: "ORDERS",
        interval: "DAY",
        intervalNum: 1,
        limit: 160000,
      },
      {
        rateLimitType: "RAW_REQUESTS",
        interval: "MINUTE",
        intervalNum: 5,
        limit: 6100,
      },
    ],
    exchangeFilters: [],
    symbols: [
      {
        symbol: "ETHBUSD",
        status: "TRADING",
        baseAsset: "ETH",
        baseAssetPrecision: 8,
        quoteAsset: "BUSD",
        quotePrecision: 8,
        quoteAssetPrecision: 8,
        baseCommissionPrecision: 8,
        quoteCommissionPrecision: 8,
        orderTypes: [
          "LIMIT",
          "LIMIT_MAKER",
          "MARKET",
          "STOP_LOSS_LIMIT",
          "TAKE_PROFIT_LIMIT",
        ],
        icebergAllowed: true,
        ocoAllowed: true,
        quoteOrderQtyMarketAllowed: true,
        allowTrailingStop: false,
        isSpotTradingAllowed: true,
        isMarginTradingAllowed: true,
        filters: [
          {
            filterType: "PRICE_FILTER",
            minPrice: "0.01000000",
            maxPrice: "100000.00000000",
            tickSize: "0.01000000",
          },
          {
            filterType: "PERCENT_PRICE",
            multiplierUp: "5",
            multiplierDown: "0.2",
            avgPriceMins: 5,
          },
          {
            filterType: "LOT_SIZE",
            minQty: "0.00010000",
            maxQty: "90000.00000000",
            stepSize: "0.00010000",
          },
          {
            filterType: "MIN_NOTIONAL",
            minNotional: "10.00000000",
            applyToMarket: true,
            avgPriceMins: 5,
          },
          {
            filterType: "ICEBERG_PARTS",
            limit: 10,
          },
          {
            filterType: "MARKET_LOT_SIZE",
            minQty: "0.00000000",
            maxQty: "1186.71124927",
            stepSize: "0.00000000",
          },
          {
            filterType: "MAX_NUM_ORDERS",
            maxNumOrders: 200,
          },
          {
            filterType: "MAX_NUM_ALGO_ORDERS",
            maxNumAlgoOrders: 5,
          },
        ],
        permissions: ["SPOT", "MARGIN"],
      },
    ],
  },
  xrpbusd: {
    timezone: "UTC",
    serverTime: 1646880119868,
    rateLimits: [
      {
        rateLimitType: "REQUEST_WEIGHT",
        interval: "MINUTE",
        intervalNum: 1,
        limit: 1200,
      },
      {
        rateLimitType: "ORDERS",
        interval: "SECOND",
        intervalNum: 10,
        limit: 50,
      },
      {
        rateLimitType: "ORDERS",
        interval: "DAY",
        intervalNum: 1,
        limit: 160000,
      },
      {
        rateLimitType: "RAW_REQUESTS",
        interval: "MINUTE",
        intervalNum: 5,
        limit: 6100,
      },
    ],
    exchangeFilters: [],
    symbols: [
      {
        symbol: "XRPBUSD",
        status: "TRADING",
        baseAsset: "XRP",
        baseAssetPrecision: 8,
        quoteAsset: "BUSD",
        quotePrecision: 8,
        quoteAssetPrecision: 8,
        baseCommissionPrecision: 8,
        quoteCommissionPrecision: 8,
        orderTypes: [
          "LIMIT",
          "LIMIT_MAKER",
          "MARKET",
          "STOP_LOSS_LIMIT",
          "TAKE_PROFIT_LIMIT",
        ],
        icebergAllowed: true,
        ocoAllowed: true,
        quoteOrderQtyMarketAllowed: true,
        allowTrailingStop: false,
        isSpotTradingAllowed: true,
        isMarginTradingAllowed: true,
        filters: [
          {
            filterType: "PRICE_FILTER",
            minPrice: "0.00010000",
            maxPrice: "1000.00000000",
            tickSize: "0.00010000",
          },
          {
            filterType: "PERCENT_PRICE",
            multiplierUp: "5",
            multiplierDown: "0.2",
            avgPriceMins: 5,
          },
          {
            filterType: "LOT_SIZE",
            minQty: "1.00000000",
            maxQty: "900000.00000000",
            stepSize: "1.00000000",
          },
          {
            filterType: "MIN_NOTIONAL",
            minNotional: "10.00000000",
            applyToMarket: true,
            avgPriceMins: 5,
          },
          {
            filterType: "ICEBERG_PARTS",
            limit: 10,
          },
          {
            filterType: "MARKET_LOT_SIZE",
            minQty: "0.00000000",
            maxQty: "1932946.90479499",
            stepSize: "0.00000000",
          },
          {
            filterType: "MAX_NUM_ORDERS",
            maxNumOrders: 200,
          },
          {
            filterType: "MAX_NUM_ALGO_ORDERS",
            maxNumAlgoOrders: 5,
          },
        ],
        permissions: ["SPOT", "MARGIN"],
      },
    ],
  },
  avaxbusd: {
    timezone: "UTC",
    serverTime: 1646782578295,
    rateLimits: [
      {
        rateLimitType: "REQUEST_WEIGHT",
        interval: "MINUTE",
        intervalNum: 1,
        limit: 1200,
      },
      {
        rateLimitType: "ORDERS",
        interval: "SECOND",
        intervalNum: 10,
        limit: 50,
      },
      {
        rateLimitType: "ORDERS",
        interval: "DAY",
        intervalNum: 1,
        limit: 160000,
      },
      {
        rateLimitType: "RAW_REQUESTS",
        interval: "MINUTE",
        intervalNum: 5,
        limit: 6100,
      },
    ],
    exchangeFilters: [],
    symbols: [
      {
        symbol: "AVAXBUSD",
        status: "TRADING",
        baseAsset: "AVAX",
        baseAssetPrecision: 8,
        quoteAsset: "BUSD",
        quotePrecision: 8,
        quoteAssetPrecision: 8,
        baseCommissionPrecision: 8,
        quoteCommissionPrecision: 8,
        orderTypes: [
          "LIMIT",
          "LIMIT_MAKER",
          "MARKET",
          "STOP_LOSS_LIMIT",
          "TAKE_PROFIT_LIMIT",
        ],
        icebergAllowed: true,
        ocoAllowed: true,
        quoteOrderQtyMarketAllowed: true,
        allowTrailingStop: false,
        isSpotTradingAllowed: true,
        isMarginTradingAllowed: true,
        filters: [
          {
            filterType: "PRICE_FILTER",
            minPrice: "0.01000000",
            maxPrice: "10000.00000000",
            tickSize: "0.01000000",
          },
          {
            filterType: "PERCENT_PRICE",
            multiplierUp: "5",
            multiplierDown: "0.2",
            avgPriceMins: 5,
          },
          {
            filterType: "LOT_SIZE",
            minQty: "0.01000000",
            maxQty: "90000.00000000",
            stepSize: "0.01000000",
          },
          {
            filterType: "MIN_NOTIONAL",
            minNotional: "10.00000000",
            applyToMarket: true,
            avgPriceMins: 5,
          },
          {
            filterType: "ICEBERG_PARTS",
            limit: 10,
          },
          {
            filterType: "MARKET_LOT_SIZE",
            minQty: "0.00000000",
            maxQty: "17185.52067361",
            stepSize: "0.00000000",
          },
          {
            filterType: "MAX_NUM_ORDERS",
            maxNumOrders: 200,
          },
          {
            filterType: "MAX_NUM_ALGO_ORDERS",
            maxNumAlgoOrders: 5,
          },
        ],
        permissions: ["SPOT", "MARGIN"],
      },
    ],
  },
  adabusd: {
    timezone: "UTC",
    serverTime: 1646717951970,
    rateLimits: [
      {
        rateLimitType: "REQUEST_WEIGHT",
        interval: "MINUTE",
        intervalNum: 1,
        limit: 1200,
      },
      {
        rateLimitType: "ORDERS",
        interval: "SECOND",
        intervalNum: 10,
        limit: 50,
      },
      {
        rateLimitType: "ORDERS",
        interval: "DAY",
        intervalNum: 1,
        limit: 160000,
      },
      {
        rateLimitType: "RAW_REQUESTS",
        interval: "MINUTE",
        intervalNum: 5,
        limit: 6100,
      },
    ],
    exchangeFilters: [],
    symbols: [
      {
        symbol: "ADABUSD",
        status: "TRADING",
        baseAsset: "ADA",
        baseAssetPrecision: 8,
        quoteAsset: "BUSD",
        quotePrecision: 8,
        quoteAssetPrecision: 8,
        baseCommissionPrecision: 8,
        quoteCommissionPrecision: 8,
        orderTypes: [
          "LIMIT",
          "LIMIT_MAKER",
          "MARKET",
          "STOP_LOSS_LIMIT",
          "TAKE_PROFIT_LIMIT",
        ],
        icebergAllowed: true,
        ocoAllowed: true,
        quoteOrderQtyMarketAllowed: true,
        allowTrailingStop: false,
        isSpotTradingAllowed: true,
        isMarginTradingAllowed: true,
        filters: [
          {
            filterType: "PRICE_FILTER",
            minPrice: "0.00100000",
            maxPrice: "1000.00000000",
            tickSize: "0.00100000",
          },
          {
            filterType: "PERCENT_PRICE",
            multiplierUp: "5",
            multiplierDown: "0.2",
            avgPriceMins: 5,
          },
          {
            filterType: "LOT_SIZE",
            minQty: "0.10000000",
            maxQty: "900000.00000000",
            stepSize: "0.10000000",
          },
          {
            filterType: "MIN_NOTIONAL",
            minNotional: "10.00000000",
            applyToMarket: true,
            avgPriceMins: 5,
          },
          {
            filterType: "ICEBERG_PARTS",
            limit: 10,
          },
          {
            filterType: "MARKET_LOT_SIZE",
            minQty: "0.00000000",
            maxQty: "1399824.99972222",
            stepSize: "0.00000000",
          },
          {
            filterType: "MAX_NUM_ORDERS",
            maxNumOrders: 200,
          },
          {
            filterType: "MAX_NUM_ALGO_ORDERS",
            maxNumAlgoOrders: 5,
          },
        ],
        permissions: ["SPOT", "MARGIN"],
      },
    ],
  },
};