import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "users",
        {
          id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          username: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING(50),
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
