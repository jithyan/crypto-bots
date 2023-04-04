import axios from "axios";
import { selector } from "recoil";

export const queryProfit = selector({
  key: "getProfit",
  get: () =>
    axios
      .get<{ profit: string }>("http://35.193.249.151:2000/db/profit")
      .then((resp) => {
        return resp.data.profit;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      }),
});
