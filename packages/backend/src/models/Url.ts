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
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Container from "typedi";

import { APP_CONFIG } from "../config";
import { User } from "./User";

const config = Container.get(APP_CONFIG);

const SLUG_REGEX = new RegExp(`^[a-zA-Z0-9]{${config.slugs.length}}$`);

interface UrlAttributes {
  id: number;
  url: string;
  slug: string;
  hits: number;
  user?: User;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
}

type UrlCreationAttributes = Optional<
  UrlAttributes,
  "id" | "hits" | "userId" | "createdAt" | "updatedAt"
>;

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

  @ForeignKey(() => User)
  @Column({
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  userId?: number;

  @BelongsTo(() => User)
  user?: User;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
