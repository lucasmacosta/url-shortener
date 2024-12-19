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
} from "sequelize-typescript";

interface UrlAttributes {
  id: number;
  url: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UrlCreationAttributes
  extends Optional<UrlAttributes, "id" | "createdAt" | "updatedAt"> {}

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

  @Length({ min: 1, max: 10 })
  @AllowNull(false)
  @Unique
  @Column
  slug!: string;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
