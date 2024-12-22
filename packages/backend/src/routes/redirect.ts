import { Router } from "express";
import Container from "typedi";

import buildValidator from "../middlewares/build-validator";
import { UrlController } from "../controllers/urls";

const urlsController = Container.get(UrlController);

import { urlParamsSchema } from "common";

const redirect = Router();

redirect.get(
  "/:slug",
  buildValidator("params", urlParamsSchema),
  urlsController.redirect.bind(urlsController),
);

export default redirect;
