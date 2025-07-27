const { Sequelize } = require("sequelize");
require("dotenv").config();

// Database connection
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "event_registration",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  logging: false, // Set to console.log to see SQL queries
});

// Initialize models
const Class = require("./class")(sequelize);
const Registration = require("./registration")(sequelize);
const Student = require("./student")(sequelize);
const ClassSelection = require("./classSelection")(sequelize);

// Define relationships
Registration.hasMany(Student, {
  foreignKey: "registrationId",
  as: "students",
  onDelete: "CASCADE",
});

Student.belongsTo(Registration, {
  foreignKey: "registrationId",
  as: "registration",
});

Student.belongsToMany(Class, {
  through: ClassSelection,
  foreignKey: "studentId",
  as: "classes",
});

Class.belongsToMany(Student, {
  through: ClassSelection,
  foreignKey: "classId",
  as: "students",
});

// Module exports
module.exports = {
  sequelize,
  Class,
  Registration,
  Student,
  ClassSelection,
};
