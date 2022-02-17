import winston from "winston";

export const gcpTransport = new winston.transports.File({
  filename: "boterror.log",
  level: "error",
  dirname: "/var/log/",
});
