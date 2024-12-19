import { createServer } from "http";
import Container from "typedi";

import "./config";
import { LOGGER } from "./lib/logger";
import { app } from "./app";
import sequelize from "./db";

const port = process.env.PORT || 3000;

(async () => {
  await sequelize.sync({ force: true });

  const logger = Container.get(LOGGER);

  createServer(app).listen(port, () =>
    logger.info(`Server running on port ${port}`)
  );
})();
