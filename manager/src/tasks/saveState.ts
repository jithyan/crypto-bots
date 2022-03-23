import fs from "fs";
import { botRegister } from "../models.js";

export const saveState = (): void => {
  fs.writeFileSync(
    "./botRegisterState.json",
    JSON.stringify(botRegister.state, null, 2),
    "utf8"
  );
};

export const startSavingStatePeriodically = () => {
  console.log("Starting saving state periodically");
  setInterval(saveState, 75 * 1000);
};
