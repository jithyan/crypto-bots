import fs from "fs";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { IntervalPriceData, Intervals, PriceData } from "./api";
import { exchangeInfo } from "./mockApiData";

const intervals: Intervals[] = ["m3", "m9", "m6", "m15", "m30", "m60"];

type AssetArgs = Record<"volatileAsset" | "stableAsset", string>;

export function getApiPriceDataMock(args: AssetArgs): IntervalPriceData {
  const symbol = makeLowerCaseSymbolFromArgs(args);
  const data: Partial<IntervalPriceData> = {};

  for (const interval of intervals) {
    data[interval] = JSON.parse(
      fs.readFileSync(`./data/${symbol}/${interval}_${symbol}.json`, "utf8")
    );
  }

  return data as IntervalPriceData;
}

function makeLowerCaseSymbolFromArgs(args: AssetArgs) {
  return args.volatileAsset.concat(args.stableAsset).trim().toLowerCase();
}

const current = {
  ptr: -1,
  adaBalance: "0",
};

export const makeMockServer = (args: AssetArgs, interval: Intervals) => {
  const symbol = makeLowerCaseSymbolFromArgs(args);
  const data = getApiPriceDataMock(args)[interval];

  return setupServer(
    rest.get("*/api/v3/ticker/price", async (req, res, ctx) => {
      current.ptr += 1;
      if (current.ptr >= data.length) {
        return res(ctx.status(500), ctx.json({ message: "out of data" }));
      }
      return res(ctx.json(data[current.ptr]));
    }),
    rest.post("*/api/v3/order", async (req, res, ctx) => {
      if (req.url.searchParams.get("side") === "BUY") {
        current.adaBalance = req.url.searchParams.get("quantity") as string;
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
      return res(ctx.json(exchangeInfo[symbol as keyof typeof exchangeInfo]));
    }),
    rest.get("*/api/v3/account*", async (req, res, ctx) => {
      const resp = {
        balances: [
          { asset: "ADA", free: current.adaBalance },
          { asset: "BUSD", free: "25" },
        ],
      };
      console.log(req.url.href, resp);
      console.log(req.method);

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
