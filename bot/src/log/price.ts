import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { Config } from "../config.js";

const dailyRotationTransport: DailyRotateFile = new DailyRotateFile({
  filename: "%DATE%-pricestats.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "100m",
  maxFiles: "365d",
});

export const priceLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    service: `price-${Config.APP_VERSION}-${Config.EXCHANGE}-${Config.SYMBOL}`,
  },
  transports: [dailyRotationTransport],
});
