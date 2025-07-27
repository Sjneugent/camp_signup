const fs = require("fs");
const path = require("path");
const { sequelize, Class } = require("./models");

// Load classes from configuration file
const loadClassesConfig = () => {
  try {
    const configPath = path.join(__dirname, "config", "classes.json");
    const classesData = fs.readFileSync(configPath, "utf8");
    return JSON.parse(classesData).classes;
  } catch (err) {
    console.error("Error loading classes configuration:", err);
    // Return default classes if configuration file is not found or invalid
    return [
      {
        name: "Art & Drawing",
        capacity: 20,
        description: "Explore various art mediums and drawing techniques.",
      },
      {
        name: "Music Fundamentals",
        capacity: 15,
        description: "Introduction to music theory and basic instruments.",
      },
    ];
  }
};

// Initialize database by creating tables and populating classes
const initializeDatabase = async () => {
  try {
    // Create tables based on models
    await sequelize.sync({ alter: false });
    console.log("Database tables created successfully");

    // Check if classes already exist
    const classesCount = await Class.count();

    if (classesCount === 0) {
      // Load classes from configuration file
      const classesConfig = loadClassesConfig();

      // Insert classes from configuration
      await Class.bulkCreate(classesConfig);
      console.log(`Added ${classesConfig.length} classes from configuration`);
    }

    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  }
};

// Function to reset classes - useful for administrators
const resetClasses = async () => {
  try {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Delete all class selections and classes
      await sequelize.models.ClassSelection.destroy({
        where: {},
        truncate: true,
        cascade: true,
        transaction,
      });

      await Class.destroy({
        where: {},
        truncate: true,
        cascade: true,
        transaction,
        restartIdentity: true,
      });

      // Load classes from configuration file
      const classesConfig = loadClassesConfig();

      // Insert classes from configuration
      await Class.bulkCreate(classesConfig, { transaction });

      // Commit the transaction
      await transaction.commit();

      console.log("Classes reset successfully");
      return true;
    } catch (err) {
      // Rollback transaction in case of error
      await transaction.rollback();
      console.error("Error during class reset:", err);
      throw err;
    }
  } catch (err) {
    console.error("Error resetting classes:", err);
    throw err;
  }
};

module.exports = {
  sequelize,
  initializeDatabase,
  resetClasses,
};
