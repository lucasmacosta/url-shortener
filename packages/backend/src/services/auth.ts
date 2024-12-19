import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { sign, verify, JwtPayload, Jwt } from "jsonwebtoken";

import { LOGGER } from "../lib/logger";
import { User } from "../models/User";
import { APP_CONFIG, AppConfig } from "../config";

export type Scope = "url:update" | "url:list";

export interface TokenPayload extends JwtPayload {
  scopes: Scope[];
}

const USER_SCOPES = ["url:update", "url:list"];

@Service()
export class AuthService {
  constructor(
    @Inject(APP_CONFIG)
    private config: AppConfig,
    @Inject(LOGGER)
    private logger: Logger
  ) {}

  getToken(user: User) {
    const token = sign({ scopes: USER_SCOPES }, this.config.auth.secret, {
      expiresIn: this.config.auth.expiresIn,
      issuer: "api",
      subject: user.username,
    });

    return token;
  }

  validateToken(token: string) {
    return verify(token, this.config.auth.secret) as TokenPayload;
  }

  isAuthorized(user: User, tokenPayload: TokenPayload, scope: Scope) {
    return tokenPayload.scopes.includes(scope);
  }
}
