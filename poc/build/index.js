"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const connector_1 = require("@binance/connector");
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const client = new connector_1.Spot(apiKey, apiSecret);
client.account().then((response) => {
    // client.logger.log(response.data)
    const res = response.data.balances.filter((t) => t.asset === "BNB");
    console.log(res[0].free);
});
