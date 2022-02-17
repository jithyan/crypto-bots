import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

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

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  apiLogger.add(
    new winston.transports.Console({
      format: winston.format.colorize(),
    })
  );
}
