const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ClassSelection = sequelize.define(
    "ClassSelection",
    {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "student_id",
        primaryKey: true,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "class_id",
        primaryKey: true,
      },
    },
    {
      tableName: "class_selections",
      timestamps: false,
    },
  );

  return ClassSelection;
};
