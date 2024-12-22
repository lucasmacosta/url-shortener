import Container, { Token } from "typedi";
import winston, { Logger } from "winston";

import { APP_CONFIG } from "../config";

const config = Container.get(APP_CONFIG);

const logger = winston.createLogger({
  level: config.logger.level,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
  silent: config.logger.silent,
});

export const LOGGER = new Token<Logger>("LOGGER");

Container.set(LOGGER, logger);
