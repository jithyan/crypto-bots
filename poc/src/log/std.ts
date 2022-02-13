import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const dailyRotationTransport: DailyRotateFile = new DailyRotateFile({
  filename: "%DATE%-cryptobot.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "40m",
  maxFiles: "365d",
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  // defaultMeta: { service: "crypto-trading-bot" },
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
  logger.add(
    new winston.transports.Console({
      format: winston.format.json(),
    })
  );
}
