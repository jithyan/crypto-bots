import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const dailyRotationTransport: DailyRotateFile = new DailyRotateFile({
  filename: "%DATE%-db.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "50m",
  maxFiles: "366d",
});

export const gcpTransport = new winston.transports.File({
  filename: "dberror.log",
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
    service: `db_service`,
  },
  transports: [dailyRotationTransport],
});

if (process.env.NODE_ENV === "production") {
  logger.add(gcpTransport);
}
