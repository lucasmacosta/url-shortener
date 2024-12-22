import { Router } from "express";
import Container from "typedi";
import { rateLimit } from "express-rate-limit";

import buildValidator from "../middlewares/build-validator";
import buildAuthentication from "../middlewares/build-authentication";
import buildAuthorization from "../middlewares/build-authorization";
import { UrlController } from "../controllers/urls";
import { createUrlSchema, urlParamsSchema, updateUrlSchema } from "common";
import { APP_CONFIG } from "../config";
const urlsController = Container.get(UrlController);
const config = Container.get(APP_CONFIG);

const urls = Router();

urls.get(
  "/",
  buildAuthentication(),
  buildAuthorization("url:list"),
  urlsController.getForUser.bind(urlsController),
);
urls.get("/stats", urlsController.stats.bind(urlsController));
urls.post(
  "/",
  rateLimit({
    windowMs: config.rateLimit.window * 1000,
    limit: config.rateLimit.limit,
  }),
  buildAuthentication(true),
  buildValidator("body", createUrlSchema),
  urlsController.create.bind(urlsController),
);
urls.put(
  "/:slug",
  buildAuthentication(),
  buildAuthorization("url:update"),
  buildValidator("params", urlParamsSchema),
  buildValidator("body", updateUrlSchema),
  urlsController.update.bind(urlsController),
);

export default urls;
