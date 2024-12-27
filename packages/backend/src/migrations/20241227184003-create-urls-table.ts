import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "urls",
        {
          id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          url: {
            allowNull: false,
            type: Sequelize.STRING(2048),
          },
          slug: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING(64),
          },
          hits: {
            allowNull: false,
            defaultValue: 0,
            type: Sequelize.INTEGER,
          },
          userId: {
            type: Sequelize.INTEGER,
            references: {
              model: {
                tableName: "users",
              },
              key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            field: "user_id",
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            field: "created_at",
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            field: "updated_at",
          },
        },
        { transaction: t },
      );
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("users");
  },
};
