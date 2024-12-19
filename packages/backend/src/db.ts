import { Sequelize } from "sequelize-typescript";
import Container from "typedi";

import { APP_CONFIG } from "./config";

const config = Container.get(APP_CONFIG);

const sequelize = new Sequelize(config.db.uri, {
  models: [__dirname + "/models"],
  logging: config.db.logging ? console.log : false,
});

export default sequelize;
