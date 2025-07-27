const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Student = sequelize.define(
    "Student",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 5,
          max: 18,
        },
      },
      allergies: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      medicalNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "medical_notes",
      },
      registrationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "registration_id",
      },
    },
    {
      tableName: "students",
      timestamps: false,
    },
  );

  return Student;
};
