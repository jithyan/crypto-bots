import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const dailyRotationTransport: DailyRotateFile = new DailyRotateFile({
  filename: "%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "1m",
  maxFiles: "30d",
});

export const gcpTransport = new winston.transports.File({
  filename: "boterror.log",
  level: "error",
  dirname: "/var/log/",
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    service: `bot_manager`,
  },
  transports: [dailyRotationTransport],
});

if (process.env.NODE_ENV === "production") {
  logger.add(gcpTransport);
}
