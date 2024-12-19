import "dotenv/config";
import Container, { Token } from "typedi";

const config = {
  env: process.env.NODE_ENV,
  slugs: {
    maxAttempts: Number(process.env.SLUG_MAX_ATTEMPTS || 5),
    length: Number(process.env.SLUG_LENGTH || 6),
  },
  auth: {
    secret: process.env.AUTH_SECRET || "secret",
    expiresIn: process.env.AUTH_EXPIRES_IN || "1h",
  },
  db: {
    uri: process.env.DB_URI || "",
    logging: process.env.DB_LOGGING === "true",
  },
  logger: {
    level: process.env.LOGGER_LEVEL || "info",
    silent: process.env.LOGGER_SILENT === "true",
  },
};

export type AppConfig = typeof config;

export const APP_CONFIG = new Token<AppConfig>("APP_CONFIG");

Container.set(APP_CONFIG, config);
