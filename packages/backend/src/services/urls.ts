import { Inject, Service } from "typedi";
import { Transaction, UniqueConstraintError } from "sequelize";
import { generate } from "randomstring";
import { Logger } from "winston";

import { Url } from "../models/Url";
import { CreateUrlDto, UpdateUrlDto } from "common";
import ApiError from "../lib/api-error";
import sequelize from "../db";
import { APP_CONFIG, AppConfig } from "../config";
import { LOGGER } from "../lib/logger";
import { User } from "../models/User";

@Service()
export class UrlService {
  constructor(
    @Inject(APP_CONFIG)
    private config: AppConfig,
    @Inject(LOGGER)
    private logger: Logger
  ) {}

  public async get(slug: string, transaction?: Transaction) {
    const url = await Url.findOne({ where: { slug }, transaction });

    if (url === null) {
      throw new ApiError("Not Found", "notFound");
    }

    return url;
  }

  public async create(
    params: CreateUrlDto,
    user?: User,
    attempts = 0
  ): Promise<Url> {
    const dbParams = {
      ...params,
      userId: user?.id,
      slug: params.slug || this.generateSlug(),
    };

    try {
      return await Url.create(dbParams);
    } catch (err) {
      if (!(err instanceof UniqueConstraintError)) {
        throw err;
      }

      this.logger.info(`The slug ${dbParams.slug} already exists`);

      if (params.slug === undefined) {
        throw new ApiError("Custom slug already exists", "conflict");
      }

      if (attempts < this.config.slugs.maxAttempts) {
        return this.create(params, user, attempts + 1);
      }

      throw new ApiError(
        "Could not create shortened url",
        "internalServerError"
      );
    }
  }

  public async update(slug: string, params: UpdateUrlDto, user: User) {
    try {
      return await sequelize.transaction(async (t) => {
        const url = await this.get(slug, t);

        if (url.userId !== user.id) {
          throw new ApiError("Bad Request", "badRequest");
        }

        url.set(params);

        await url.save({ transaction: t });

        return url;
      });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        this.logger.info(`The slug ${params.slug} already exists`);
        throw new ApiError("Custom slug already exists", "conflict");
      }
      throw err;
    }
  }

  private generateSlug() {
    return generate({
      length: this.config.slugs.length,
      charset: "alphabetic",
    });
  }
}
