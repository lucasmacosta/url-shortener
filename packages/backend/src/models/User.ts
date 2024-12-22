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
  IsAlphanumeric,
} from "sequelize-typescript";

interface UserAttributes {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "createdAt" | "updatedAt"
>;

@Table({
  timestamps: true,
  tableName: "users",
  underscored: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Length({ min: 1, max: 50 })
  @AllowNull(false)
  @Unique
  @IsAlphanumeric
  @Column
  username!: string;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
