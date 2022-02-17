import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { gcpTransport } from "./gcpTransport";

const dailyRotationTransport: DailyRotateFile = new DailyRotateFile({
  filename: "%DATE%-api.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "40m",
  maxFiles: "365d",
});

export const apiLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "api" },
  transports: [
    dailyRotationTransport,
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV === "production") {
  apiLogger.add(gcpTransport);
}

if (process.env.NODE_ENV !== "production") {
  apiLogger.add(
    new winston.transports.Console({
      format: winston.format.colorize(),
    })
  );
}
