import fs from "fs";
import cron from "node-cron";
import { botRegister } from "../models.js";

export const saveState = (): void => {
  fs.writeFileSync(
    "./botRegisterState.json",
    JSON.stringify(botRegister.state, null, 2),
    "utf8"
  );
};

export const startPeriodicStateSaving = () => {
  console.log("Started bot state saving scheduler");
  cron.schedule("* * * * *", saveState);
};
