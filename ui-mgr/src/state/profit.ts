import axios from "axios";
import { selector } from "recoil";

export const queryProfit = selector({
  key: "getProfit",
  get: () =>
    axios
      .get<{ profit: string }>("http://35.243.104.152:2000/db/profit")
      .then((resp) => {
        return resp.data.profit;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      }),
});
