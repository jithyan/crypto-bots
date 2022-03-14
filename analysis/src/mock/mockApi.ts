import fs from "fs";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { IntervalPriceData, Intervals, PriceData } from "../parse/api";
import { exchangeInfo } from "./mockApiData";
import { exchangeInfoData } from "./exchange";

export const intervals: Intervals[] = ["m3", "m9", "m6", "m15", "m30", "m60"];

type AssetArgs = Record<"volatileAsset" | "stableAsset", string>;

export function getApiPriceDataMock(args: AssetArgs): IntervalPriceData {
  const symbol = makeLowerCaseSymbolFromArgs(args);
  const data: Partial<IntervalPriceData> = {};

  for (const interval of intervals) {
    try {
      data[interval] = JSON.parse(
        fs.readFileSync(
          `../../data/${symbol}/${interval}_${symbol}.json`,
          "utf8"
        )
      );
    } catch (e) {
      data[interval] = JSON.parse(
        fs.readFileSync(
          `../../data/pricebot/symbols/${symbol}/${interval}_${symbol}.json`,
          "utf8"
        )
      );
    }
  }

  return data as IntervalPriceData;
}

function makeLowerCaseSymbolFromArgs(args: AssetArgs) {
  return args.volatileAsset.concat(args.stableAsset).trim().toLowerCase();
}

export const makeMockServer = (args: AssetArgs, interval: Intervals) => {
  const current = {
    ptr: -1,
    balance: "0",
    numTrades: 0,
  };
  const symbol = makeLowerCaseSymbolFromArgs(args);
  const data = getApiPriceDataMock(args)[interval];

  return setupServer(
    rest.get("*/api/v3/ticker/price", async (req, res, ctx) => {
      if (req.url.searchParams.get("symbol") === "AUDBUSD") {
        return res(
          ctx.status(200),
          ctx.json({
            symbol: "AUDBUSD",
            price: "0.72960000",
          })
        );
      }

      current.ptr += 1;
      if (current.ptr >= data.length) {
        fs.appendFileSync(
          "numtrades.txt",
          "\n" +
            JSON.stringify(
              {
                trades: current.numTrades,
                symbol,
                time: new Date().toISOString(),
              },
              undefined,
              2
            )
        );
        return res(ctx.status(500), ctx.json({ message: "out of data" }));
      }
      return res(ctx.json(data[current.ptr]));
    }),
    rest.post("*/api/v3/order", async (req, res, ctx) => {
      if (req.url.searchParams.get("side") === "BUY") {
        current.balance = req.url.searchParams.get("quantity") as string;
      } else {
        current.numTrades += 1;
      }

      return res(ctx.json({ clientOrderId: "123" }));
    }),
    rest.get("*/api/v3/order", async (req, res, ctx) => {
      return res(
        ctx.json({
          clientOrderId: "123",
          status: "FILLED",
          executedQty: "100%",
        })
      );
    }),
    rest.get(`*/api/v3/exchangeInfo`, async (req, res, ctx) => {
      const { symbols, ...rest } = exchangeInfoData;
      const symbolData = symbols.find((x) => x.symbol === symbol.toUpperCase());
      const response = { ...rest, symbols: [symbolData] };
      const originalResp = exchangeInfo["ethbusd"];

      if (symbolData) {
        return res(ctx.json(response));
      } else {
        return res(
          ctx.status(404),
          ctx.json({ status: "Not found for symbol " + symbol })
        );
      }
    }),
    rest.get("*/api/v3/account*", async (req, res, ctx) => {
      const resp = {
        balances: [
          { asset: args.volatileAsset.toUpperCase(), free: current.balance },
          { asset: "BUSD", free: "25" },
        ],
      };

      return res(ctx.json(resp));
    }),
    rest.get("*", async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}));
    }),
    rest.post("*", async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}));
    })
  );
};
