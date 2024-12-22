import { Router } from "express";
import Container from "typedi";

import buildValidator from "../middlewares/build-validator";
import { UserController } from "../controllers/users";

const usersController = Container.get(UserController);

import { createUserSchema, authenticateUserSchema } from "common";

const users = Router();

users.post(
  "/",
  buildValidator("body", createUserSchema),
  usersController.create.bind(usersController),
);
users.post(
  "/login",
  buildValidator("body", authenticateUserSchema),
  usersController.login.bind(usersController),
);

export default users;
