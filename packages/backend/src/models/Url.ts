import { Optional } from "sequelize";
import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  AllowNull,
  Length,
  Unique,
  Min,
  Default,
  Is,
} from "sequelize-typescript";
import Container from "typedi";

import { APP_CONFIG } from "../config";

const config = Container.get(APP_CONFIG);

const SLUG_REGEX = new RegExp(`^[a-zA-Z0-9]{${config.slugs.length}}$`);

interface UrlAttributes {
  id: number;
  url: string;
  slug: string;
  hits: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UrlCreationAttributes
  extends Optional<UrlAttributes, "id" | "hits" | "createdAt" | "updatedAt"> {}

@Table({
  timestamps: true,
  tableName: "urls",
  underscored: true,
})
export class Url extends Model<UrlAttributes, UrlCreationAttributes> {
  @Length({ min: 1, max: 2048 })
  @AllowNull(false)
  @Column
  url!: string;

  @AllowNull(false)
  @Unique
  @Is("validSlug", (value) => {
    if (!SLUG_REGEX.test(value)) {
      throw new Error(`"${value}" is not a valid slug.`);
    }
  })
  @Column
  slug!: string;

  @Min(0)
  @AllowNull(false)
  @Default(0)
  @Column
  hits!: number;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
