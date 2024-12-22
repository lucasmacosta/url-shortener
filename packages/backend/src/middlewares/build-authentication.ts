import { RequestHandler } from "express";

import ApiError from "../lib/api-error";
import Container from "typedi";
import { UserService } from "../services/users";
import { AuthService } from "../services/auth";

const userService = Container.get(UserService);
const authService = Container.get(AuthService);

export default function buildAuthentication(allowAnonymous = false) {
  return async function authenticationMiddleware(req, res, next) {
    const token = (req.headers.authorization || "").split(" ")[1];

    if (!token) {
      if (allowAnonymous) {
        next();
        return;
      } else {
        throw new ApiError("Token missing", "unauthorized");
      }
    }

    try {
      const tokenPayload = authService.validateToken(token);
      const user = await userService.get(tokenPayload.sub as string);
      res.locals.user = user;
      res.locals.tokenPayload = tokenPayload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new ApiError("Unauthorized", "unauthorized");
    }

    next();
  } as RequestHandler;
}
