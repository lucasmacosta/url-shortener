import { Service } from "typedi";
import { RequestHandler } from "express";

import { CreateUserDto, AuthenticateUserDto } from "common";
import { UserService } from "../services/users";
import ApiError from "../lib/api-error";
import { AuthService } from "../services/auth";

@Service()
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  create: RequestHandler = async (req, res) => {
    const body = res.locals.validated.body as CreateUserDto;

    const user = await this.userService.create(body);

    res.status(201).json(user);
  };

  login: RequestHandler = async (req, res) => {
    const body = res.locals.validated.body as AuthenticateUserDto;

    try {
      const user = await this.userService.get(body.username);
      const token = this.authService.getToken(user);
      res.status(200).json({ token, user });
      return;
    } catch (err) {
      throw new ApiError("Login failed", "unauthorized");
    }
  };
}
