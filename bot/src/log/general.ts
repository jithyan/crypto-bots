import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const dailyRotationTransport: DailyRotateFile = new DailyRotateFile({
  filename: "%DATE%-general.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "40m",
  maxFiles: "365d",
});

export const generalLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [dailyRotationTransport],
});

if (process.env.NODE_ENV !== "production2") {
  generalLogger.add(
    new winston.transports.Console({
      format: winston.format.colorize(),
    })
  );
}
