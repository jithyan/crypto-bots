import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { Config } from "../config.js";
import { gcpTransport } from "./gcpTransport.js";

const dailyRotationTransport: DailyRotateFile = new DailyRotateFile({
  filename: "%DATE%-api.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "40m",
  maxFiles: "30d",
});

export const apiLogger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    service: `api-${Config.APP_VERSION}-${Config.EXCHANGE}-${Config.SYMBOL}`,
  },
  transports: [dailyRotationTransport],
});

// if (process.env.NODE_ENV === "production") {
//   apiLogger.add(gcpTransport);
// }

if (process.env.NODE_ENV !== "production") {
  apiLogger.add(
    new winston.transports.Console({
      format: winston.format.colorize(),
    })
  );
}
