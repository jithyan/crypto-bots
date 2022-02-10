//@ts-ignore
import { Spot } from "@binance/connector";

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const client = new Spot(apiKey, apiSecret);

client.account().then((response: any) => {
  // client.logger.log(response.data)
  const res = response.data.balances.filter((t: any) => t.asset === "BNB");
  console.log(res[0].free);
});
