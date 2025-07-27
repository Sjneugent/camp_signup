const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Registration = sequelize.define(
    "Registration",
    {
      id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      parentName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "parent_name",
        validate: {
          notEmpty: true,
        },
      },
      parentEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "parent_email",
        validate: {
          isEmail: true,
        },
      },
      parentPhone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "parent_phone",
        validate: {
          notEmpty: true,
        },
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "registrations",
      timestamps: false,
    },
  );

  return Registration;
};
