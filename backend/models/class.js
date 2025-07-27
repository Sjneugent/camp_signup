const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Class = sequelize.define(
    "Class",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "classes",
      timestamps: false,
    },
  );

  return Class;
};
