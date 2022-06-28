import winston from "winston";

const isDebug = ["development", "qa"].includes(process.env.NODE_ENV);

const logger = winston.createLogger({
  level: isDebug ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.printf((msg) => {
      return `${msg.timestamp} ${msg.service} ${msg.level}: ${msg.message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
  defaultMeta: { service: "server" },
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true })),
    })
  );
}

export default logger;
