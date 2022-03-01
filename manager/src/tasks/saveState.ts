import fs from "fs";
import cron from "node-cron";
import { logger } from "../log.js";
import { botRegister } from "../models.js";

export const saveState = (): void => {
  fs.writeFile(
    "botRegisterState.json",
    JSON.stringify(botRegister.state, null, 2),
    "utf8",
    (err) => {
      logger.error("Failed to save bot register state", err);
    }
  );
};

export const startPeriodicStateSaving = () => {
  console.log("Started bot state saving scheduler");
  cron.schedule("15 * * * *", saveState);
};
