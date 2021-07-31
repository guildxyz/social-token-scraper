import { createLogger, format, transports } from "winston";

const { printf, combine, colorize, timestamp, errors } = format;

const logFormat = printf(
  (log) => `${log.timestamp} ${log.level}: ${log.stack || log.message}`
);

const logger = createLogger({
  level: "debug",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [new transports.Console()],
});

export default logger;
