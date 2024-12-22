import { Inject, Service } from "typedi";
import { Transaction } from "sequelize";
import { Logger } from "winston";

import { CreateUserDto } from "common";
import ApiError from "../lib/api-error";
import { LOGGER } from "../lib/logger";
import { User } from "../models/User";

@Service()
export class UserService {
  constructor(
    @Inject(LOGGER)
    private logger: Logger
  ) {}

  public async get(username: string, transaction?: Transaction) {
    const user = await User.findOne({ where: { username }, transaction });

    if (user === null) {
      throw new ApiError("Not Found", "notFound");
    }

    return user;
  }

  public async create(params: CreateUserDto): Promise<User> {
    return await User.create(params);
  }
}
