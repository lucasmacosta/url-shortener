import { RequestHandler } from "express";
import { Schema } from "zod";

import ApiError from "../lib/api-error";
import Container from "typedi";
import { UserService } from "../services/users";
import { AuthService } from "../services/auth";

const userService = Container.get(UserService);
const authService = Container.get(AuthService);

const authenticationMiddleware: RequestHandler = async (req, res, next) => {
  const token = (req.headers.authorization || "").split(" ")[1];

  if (!token) {
    throw new ApiError("Token missing", "unauthorized");
  }

  try {
    const tokenPayload = authService.validateToken(token);
    res.locals.user = await userService.get(tokenPayload.sub as string);
  } catch (err) {
    throw new ApiError("Unauthorized", "unauthorized");
  }

  next();
};

export default authenticationMiddleware;
