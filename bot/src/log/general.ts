import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { Config } from "../config.js";
import { gcpTransport } from "./gcpTransport.js";

const dailyRotationTransport: DailyRotateFile = new DailyRotateFile({
  filename: "%DATE%-general.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "40m",
  maxFiles: "7d",
});

export const generalLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    service: `general-${Config.APP_VERSION}-${Config.EXCHANGE}-${Config.SYMBOL}`,
  },
  transports: [dailyRotationTransport],
});

if (process.env.NODE_ENV !== "production") {
  generalLogger.add(
    new winston.transports.Console({
      format: winston.format.colorize(),
    })
  );
}

if (process.env.NODE_ENV === "production") {
  generalLogger.add(gcpTransport);
}
