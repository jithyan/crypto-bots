import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { Config } from "../config.js";
import { gcpTransport } from "./gcpTransport.js";

const dailyRotationTransport: DailyRotateFile = new DailyRotateFile({
  filename: "%DATE%-state.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "40m",
  maxFiles: "365d",
});

export const stateLogger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    service: `state-${Config.APP_VERSION}-${Config.EXCHANGE}-${Config.SYMBOL}`,
  },
  transports: [dailyRotationTransport],
});

// if (process.env.NODE_ENV === "production") {
//   stateLogger.add(gcpTransport);
// }

if (process.env.NODE_ENV !== "production") {
  stateLogger.add(
    new winston.transports.Console({
      format: winston.format.colorize(),
    })
  );
}
