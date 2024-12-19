import { RequestHandler } from "express";
import Container from "typedi";

import ApiError from "../lib/api-error";
import { AuthService, Scope, TokenPayload } from "../services/auth";
import { User } from "../models/User";

const authService = Container.get(AuthService);

export default function buildAuthorization(scope: Scope) {
  return function authorizationMiddleware(req, res, next) {
    const user = res.locals.user as User;
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    if (!authService.isAuthorized(user, tokenPayload, scope)) {
      throw new ApiError("Unauthorized", "unauthorized");
    }

    next();
  } as RequestHandler;
}
