import { Router } from "express";
import Container from "typedi";

import buildValidator from "../middlewares/build-validator";
import buildAuthentication from "../middlewares/build-authentication";
import buildAuthorization from "../middlewares/build-authorization";
import { UrlController } from "../controllers/urls";

const urlsController = Container.get(UrlController);

import { createUrlSchema, urlParamsSchema, updateUrlSchema } from "common";

const urls = Router();

urls.get(
  "/",
  buildAuthentication(),
  buildAuthorization("url:list"),
  urlsController.getForUser.bind(urlsController)
);
urls.get(
  "/:slug",
  buildValidator("params", urlParamsSchema),
  urlsController.get.bind(urlsController)
);
urls.post(
  "/",
  buildAuthentication(true),
  buildValidator("body", createUrlSchema),
  urlsController.create.bind(urlsController)
);
urls.put(
  "/:slug",
  buildAuthentication(),
  buildAuthorization("url:update"),
  buildValidator("params", urlParamsSchema),
  buildValidator("body", updateUrlSchema),
  urlsController.update.bind(urlsController)
);

export default urls;
